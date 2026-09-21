"""
TerraTree — Interactive Dashboard
Run locally: streamlit run app.py
(Runs Earth Engine auth interactively via your browser — same account as your notebooks.)
"""

import streamlit as st
import ee
import pandas as pd
import joblib
import folium
from streamlit_folium import st_folium

st.set_page_config(page_title="TerraTree — Sundarbans Mangrove Classifier", layout="wide")

# ---------------------------------------------------------------------------
# Setup: Earth Engine + trained model (cached so this only runs once per session)
# ---------------------------------------------------------------------------

GEE_PROJECT_ID = "terratree"
MODEL_PATH = "models/random_forest_v1.joblib"  # copy from Drive: terratree/models/random_forest_v1.joblib

CLASS_COLORS = {
    "Water": "#1f77b4",
    "Mangrove": "#2ca02c",
    "Other vegetation": "#8c8c00",
    "Bare/built": "#8B4513",
}

DROP_ALWAYS = ['TCI_R', 'TCI_G', 'TCI_B', 'AOT', 'WVP', 'SCL',
               'MSK_CLDPRB', 'MSK_SNWPRB', 'QA60', 'QA10', 'QA20',
               'MSK_CLASSI_OPAQUE', 'MSK_CLASSI_CIRRUS', 'MSK_CLASSI_SNOW_ICE']


@st.cache_resource
def init_earth_engine():
    try:
        ee.Initialize(project=GEE_PROJECT_ID)
    except Exception:
        ee.Authenticate()
        ee.Initialize(project=GEE_PROJECT_ID)
    return True


@st.cache_resource
def load_model():
    bundle = joblib.load(MODEL_PATH)
    return bundle['model'], bundle['features'], bundle['class_names']


@st.cache_resource
def get_aoi():
    import requests
    for query in ["Sundarbans National Park, West Bengal, India",
                  "Sundarban Tiger Reserve", "Sundarbans"]:
        resp = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": query, "format": "geojson", "polygon_geojson": 1, "limit": 1},
            headers={"User-Agent": "terratree-dashboard"}
        )
        features = resp.json().get('features', [])
        if features:
            return ee.Geometry(features[0]['geometry'])
    return ee.Geometry.Rectangle([88.75, 21.50, 89.20, 22.20])


def mask_s2_clouds(image):
    qa = image.select('QA60')
    mask = qa.bitwiseAnd(1 << 10).eq(0).And(qa.bitwiseAnd(1 << 11).eq(0))
    return image.updateMask(mask).divide(10000).copyProperties(image, ['system:time_start'])


@st.cache_resource
def build_feature_image(_aoi):
    s2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
          .filterBounds(_aoi).filterDate('2022-01-01', '2024-12-31')
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
          .map(mask_s2_clouds).median().clip(_aoi))
    s2 = s2.select([b for b in s2.bandNames().getInfo() if b not in DROP_ALWAYS])

    ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI')
    ndwi = s2.normalizedDifference(['B3', 'B8']).rename('NDWI')
    ndvire = s2.normalizedDifference(['B8', 'B5']).rename('NDVIre')
    ndi45 = s2.normalizedDifference(['B5', 'B4']).rename('NDI45')
    ndre1 = s2.normalizedDifference(['B6', 'B5']).rename('NDre1')
    s2 = s2.addBands([ndvi, ndwi, ndvire, ndi45, ndre1])

    s1 = (ee.ImageCollection('COPERNICUS/S1_GRD')
          .filterBounds(_aoi).filterDate('2022-01-01', '2024-12-31')
          .filter(ee.Filter.eq('instrumentMode', 'IW'))
          .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
          .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
          .select(['VV', 'VH']).median().toFloat().clip(_aoi))
    ratio = s1.select('VH').divide(s1.select('VV')).rename('VH_VV_ratio')
    s1 = s1.addBands(ratio)

    return s2.addBands(s1)


TRAINING_CSV_PATH = "data/sundarbans_training_table_v4.csv"  # copy this from your Drive terratree/ folder


@st.cache_resource
def load_ee_training_fc(feature_names):
    """Builds an Earth Engine FeatureCollection directly from the local
    training CSV instead of re-sampling imagery interactively — this is
    what avoids the 'Computation timed out' error, since no scanning of
    the actual satellite imagery happens here at all."""
    df = pd.read_csv(TRAINING_CSV_PATH)
    drop_cols = [c for c in ['.geo', 'system:index'] if c in df.columns]
    df = df.drop(columns=drop_cols).dropna()
    records = df[feature_names + ['label']].to_dict('records')
    ee_features = [ee.Feature(None, r) for r in records]
    return ee.FeatureCollection(ee_features)


@st.cache_resource
def train_ee_classifier(_aoi, _feature_image, feature_names):
    """Trains a matching Random Forest directly in Earth Engine, using the
    already-exported training table (fast, no imagery re-scan) so we can
    render a full classified map layer."""
    training_fc = load_ee_training_fc(feature_names)

    classifier = ee.Classifier.smileRandomForest(numberOfTrees=200).train(
        features=training_fc, classProperty='label', inputProperties=feature_names
    )
    # Use the simple bounding box for the clip here, not the full detailed
    # coastline polygon — a complex multi-vertex polygon adds real overhead
    # to map-tile registration for no visual benefit at this zoom level.
    classified = _feature_image.select(feature_names).clip(_aoi.bounds()).classify(classifier)
    return classified


def classify_point(lat, lon, feature_image, model, feature_names):
    point = ee.Geometry.Point([lon, lat])
    values = feature_image.reduceRegion(ee.Reducer.first(), point, scale=10).getInfo()
    row = {f: values.get(f, None) for f in feature_names}
    if any(v is None for v in row.values()):
        return None, None
    X = pd.DataFrame([row])[feature_names]
    pred = model.predict(X)[0]
    proba = model.predict_proba(X)[0]
    return pred, proba


# ---------------------------------------------------------------------------
# UI
# ---------------------------------------------------------------------------

st.title("🌳 TerraTree — Sundarbans Mangrove Classifier")
st.caption("Multi-temporal Sentinel-1/2 fusion + Random Forest, trained against Global Mangrove Watch and ESA WorldCover reference labels.")

with st.spinner("Connecting to Earth Engine..."):
    init_earth_engine()

model, feature_names, class_names = load_model()
aoi = get_aoi()
feature_image = build_feature_image(aoi)

tab1, tab2, tab3 = st.tabs(["🗺️ Interactive Classifier", "📊 Model Performance", "ℹ️ About"])

with tab1:
    st.subheader("Click anywhere in the Sundarbans to classify that point")
    col1, col2 = st.columns([2, 1])

    with col1:
        try:
            with st.spinner("Training map-view classifier and rendering tiles (first load takes a minute)..."):
                classified = train_ee_classifier(aoi, feature_image, feature_names)

            vis_params = {'min': 0, 'max': 3, 'palette': ['1f77b4', '2ca02c', '8c8c00', '8B4513']}
            map_id_dict = classified.getMapId(vis_params)

            m = folium.Map(location=[21.95, 88.9], zoom_start=10, tiles=None)
            folium.TileLayer(
                tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attr='Esri', name='Satellite', overlay=False,
            ).add_to(m)
            folium.TileLayer(
                tiles=map_id_dict['tile_fetcher'].url_format,
                attr='Google Earth Engine',
                name='Classification',
                overlay=True,
            ).add_to(m)
            folium.GeoJson(aoi.getInfo(), name="Study area", style_function=lambda x: {
                'color': 'red', 'fillOpacity': 0, 'weight': 2
            }).add_to(m)
            folium.LayerControl().add_to(m)
            map_data = st_folium(m, width=700, height=500, key="main_map", returned_objects=["last_clicked"])

            st.markdown("**Legend:** 🔵 Water  🟢 Mangrove  🟡 Other vegetation  🟤 Bare/built")
        except Exception as e:
            st.error(f"Map failed to render: {e}")
            st.exception(e)
            map_data = None

    with col2:
        if map_data and map_data.get("last_clicked"):
            lat = map_data["last_clicked"]["lat"]
            lon = map_data["last_clicked"]["lng"]
            st.write(f"**Clicked:** {lat:.4f}, {lon:.4f}")

            with st.spinner("Querying Earth Engine and classifying..."):
                pred, proba = classify_point(lat, lon, feature_image, model, feature_names)

            if pred is None:
                st.warning("No valid data at this point (likely outside imagery coverage or masked by cloud). Try another spot.")
            else:
                pred_name = class_names[pred]
                st.markdown(f"### Prediction: **{pred_name}**")
                st.markdown(
                    f'<div style="width:100%;height:24px;background:{CLASS_COLORS.get(pred_name, "#888")};border-radius:4px;"></div>',
                    unsafe_allow_html=True
                )
                st.write("**Class probabilities:**")
                proba_df = pd.DataFrame({
                    "Class": [class_names[c] for c in sorted(class_names)],
                    "Probability": proba
                }).sort_values("Probability", ascending=False)
                st.bar_chart(proba_df.set_index("Class"))
        else:
            st.info("Click a point on the map to classify it.")

with tab2:
    st.subheader("Model performance (from notebook 03 evaluation)")
    st.markdown("""
    Fill these in with your actual notebook 03 numbers, or load them from a
    saved metrics.json if you export one — see the note in the About tab.
    """)
    # Placeholder — replace with your real numbers or wire up a metrics.json load
    c1, c2 = st.columns(2)
    c1.metric("Overall Accuracy", "80.2%")
    c2.metric("Kappa coefficient", "0.73")
    st.markdown("**Per-class performance:** Water and Other vegetation classify cleanly "
                "(>90% precision). The main confusion is Mangrove ↔ Bare/built, "
                "reflecting the known spectral ambiguity of tidal mudflats at the mangrove fringe.")

with tab3:
    st.markdown("""
    ### About TerraTree
    Satellite-based mangrove classification for the Sundarbans, built on
    multi-temporal Sentinel-1 (SAR) and Sentinel-2 (optical) imagery fused
    with Global Mangrove Watch and ESA WorldCover as reference labels
    (no field survey was feasible for this project).

    **Pipeline:** data acquisition (Earth Engine) → feature extraction
    (spectral + red-edge indices, SAR backscatter) → Random Forest
    classification → this dashboard.

    **To wire up real metrics on the Performance tab:** in notebook 03, save
    `oa`, `kappa`, and the classification report to a `metrics.json` file in
    this `dashboard/` folder, then load it here instead of the hardcoded values.
    """)
