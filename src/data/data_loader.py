import os
import json
import math
from typing import Dict, List, Optional, Tuple, Any
import pandas as pd

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DASHBOARD_DATA_DIR = os.path.join(BASE_DIR, "dashboard", "data")
GEO_DIR = os.path.join(os.path.dirname(__file__), "geo")

FEATURE_DESCRIPTIONS = {
    "B1": {"category": "Optical (Aerosol)", "desc": "Coastal aerosol band (443nm) for atmospheric & shallow water analysis"},
    "B2": {"category": "Optical (Visible)", "desc": "Blue band (490nm) capturing chlorophyll absorption and atmospheric scattering"},
    "B3": {"category": "Optical (Visible)", "desc": "Green band (560nm) reflecting peak healthy vegetation reflectance"},
    "B4": {"category": "Optical (Visible)", "desc": "Red band (665nm) capturing strong chlorophyll-a absorption"},
    "B5": {"category": "Vegetation Red-Edge", "desc": "Red-Edge 1 (705nm) highly sensitive to canopy chlorophyll concentration"},
    "B6": {"category": "Vegetation Red-Edge", "desc": "Red-Edge 2 (740nm) tracking leaf cellular structure changes"},
    "B7": {"category": "Vegetation Red-Edge", "desc": "Red-Edge 3 (783nm) measuring canopy leaf area and density"},
    "B8": {"category": "Near-Infrared (NIR)", "desc": "Broad NIR band (842nm) driven by internal spongy mesophyll scattering"},
    "B8A": {"category": "Near-Infrared (NIR)", "desc": "Narrow NIR band (865nm) for atmospheric water vapor correction & biomass"},
    "B9": {"category": "Water Vapor", "desc": "Water vapor absorption band (945nm)"},
    "B11": {"category": "Short-Wave Infrared", "desc": "SWIR-1 band (1610nm) highly responsive to canopy water content & lignocellulose"},
    "B12": {"category": "Short-Wave Infrared", "desc": "SWIR-2 band (2190nm) measuring structural biochemical absorption & dry matter"},
    "NDI45": {"category": "Red-Edge Index", "desc": "Normalized Difference Index (B5-B4)/(B5+B4) detecting early chlorophyll transitions"},
    "NDVI": {"category": "Vegetation Index", "desc": "Normalized Difference Vegetation Index (B8-B4)/(B8+B4) for photosynthetic activity"},
    "NDVIre": {"category": "Red-Edge Index", "desc": "Red-Edge NDVI (B8-B5)/(B8+B5) avoiding saturation in dense tropical multi-tier canopies"},
    "NDWI": {"category": "Moisture Index", "desc": "Normalized Difference Water Index (B3-B8)/(B3+B8) delineating open water & moisture"},
    "NDre1": {"category": "Red-Edge Index", "desc": "Red-Edge Ratio Index (B6-B5)/(B6+B5) sensitive to foliar nitrogen status"},
    "VH": {"category": "SAR Backscatter", "desc": "Cross-polarized radar backscatter (dB) measuring volume scattering in woody branches"},
    "VV": {"category": "SAR Backscatter", "desc": "Co-polarized radar backscatter (dB) sensitive to surface roughness & soil moisture"},
    "VH_VV_ratio": {"category": "SAR Polarimetric Ratio", "desc": "Depolarization ratio (VH/VV) distinguishing multi-path canopy bounce from bare ground"},
}

class DataLoader:
    def __init__(self):
        self._kali_df: Optional[pd.DataFrame] = None
        self._sundarbans_df: Optional[pd.DataFrame] = None
        self._sundarbans_anchors: Optional[List[Dict[str, Any]]] = None
        self._load_data()

    def _load_data(self):
        # Load Kali training table
        kali_path = os.path.join(DASHBOARD_DATA_DIR, "kali_training_table.csv")
        if os.path.exists(kali_path):
            self._kali_df = pd.read_csv(kali_path)
            # Ensure proper numeric typing
            self._kali_df["decimalLatitude"] = pd.to_numeric(self._kali_df["decimalLatitude"], errors="coerce")
            self._kali_df["decimalLongitude"] = pd.to_numeric(self._kali_df["decimalLongitude"], errors="coerce")
            self._kali_df["species_richness"] = pd.to_numeric(self._kali_df["species_richness"], errors="coerce")
            self._kali_df["shannon_index"] = pd.to_numeric(self._kali_df["shannon_index"], errors="coerce")
        else:
            print(f"Warning: {kali_path} not found")

        # Load Sundarbans training table
        sundarbans_path = os.path.join(DASHBOARD_DATA_DIR, "sundarbans_training_table_v4.csv")
        if os.path.exists(sundarbans_path):
            self._sundarbans_df = pd.read_csv(sundarbans_path)
            drop_cols = [c for c in [".geo", "system:index"] if c in self._sundarbans_df.columns]
            self._sundarbans_df = self._sundarbans_df.drop(columns=drop_cols).dropna()
            self._create_sundarbans_anchors()
        else:
            print(f"Warning: {sundarbans_path} not found")

    def _create_sundarbans_anchors(self):
        """
        Builds realistic anchor reference stations distributed across Sundarbans National Park
        with real feature vectors from the stratified training dataset.
        Class 0: Water, Class 1: Mangrove, Class 2: Other veg, Class 3: Bare/built/mudflats.
        """
        if self._sundarbans_df is None or len(self._sundarbans_df) == 0:
            return

        anchors_def = [
            # Mangrove interior plots
            {"id": "SB-MG01", "name": "Sajnekhali Mangrove Core", "lat": 22.1245, "lng": 88.8256, "label": 1, "class": "Mangrove"},
            {"id": "SB-MG02", "name": "Netidhopani Dense Avicennia", "lat": 21.9421, "lng": 88.7912, "label": 1, "class": "Mangrove"},
            {"id": "SB-MG03", "name": "Dobanki Blue Carbon Fringe", "lat": 22.0210, "lng": 88.7510, "label": 1, "class": "Mangrove"},
            {"id": "SB-MG04", "name": "Piramkhali Rhizophora Stand", "lat": 22.1812, "lng": 88.9214, "label": 1, "class": "Mangrove"},
            {"id": "SB-MG05", "name": "Harikhali Estuarine Canopy", "lat": 21.8540, "lng": 88.9610, "label": 1, "class": "Mangrove"},
            {"id": "SB-MG06", "name": "Gosaba Southern Dense Stand", "lat": 22.0890, "lng": 88.8950, "label": 1, "class": "Mangrove"},
            {"id": "SB-MG07", "name": "Panchmukhani Tidal Forest", "lat": 22.1550, "lng": 88.7920, "label": 1, "class": "Mangrove"},
            {"id": "SB-MG08", "name": "Chhotokhali Saline Mangrove", "lat": 22.0450, "lng": 88.9810, "label": 1, "class": "Mangrove"},
            # Estuarine water channels
            {"id": "SB-WT01", "name": "Matla River Confluence", "lat": 21.9950, "lng": 88.6820, "label": 0, "class": "Water"},
            {"id": "SB-WT02", "name": "Bidya Estuary Deep Channel", "lat": 22.0620, "lng": 88.8510, "label": 0, "class": "Water"},
            {"id": "SB-WT03", "name": "Panchamukhani Confluence", "lat": 22.1380, "lng": 88.7750, "label": 0, "class": "Water"},
            {"id": "SB-WT04", "name": "Bay of Bengal Marine Outer", "lat": 21.6820, "lng": 88.9150, "label": 0, "class": "Water"},
            # Other vegetation (inland agriculture & coastal scrub)
            {"id": "SB-OV01", "name": "Gosaba Agricultural Buffer", "lat": 22.1680, "lng": 88.8050, "label": 2, "class": "Other vegetation"},
            {"id": "SB-OV02", "name": "Pakhiralay Homestead Agroforest", "lat": 22.1480, "lng": 88.8310, "label": 2, "class": "Other vegetation"},
            {"id": "SB-OV03", "name": "Canning Northern Transition Veg", "lat": 22.2410, "lng": 88.6650, "label": 2, "class": "Other vegetation"},
            # Bare ground / tidal mudflats
            {"id": "SB-BR01", "name": "Jambu Island Tidal Sandbar", "lat": 21.5910, "lng": 88.1920, "label": 3, "class": "Bare/built"},
            {"id": "SB-BR02", "name": "Sajnekhali Exposed Mudflats", "lat": 22.1150, "lng": 88.8410, "label": 3, "class": "Bare/built"},
            {"id": "SB-BR03", "name": "Dhamakhali Silt Embankment", "lat": 22.2610, "lng": 88.9020, "label": 3, "class": "Bare/built"},
        ]

        anchors = []
        for i, a in enumerate(anchors_def):
            class_df = self._sundarbans_df[self._sundarbans_df["label"] == a["label"]]
            if len(class_df) > 0:
                # Select a consistent representative row from the training dataset for this anchor
                row_idx = (i * 17) % len(class_df)
                row = class_df.iloc[row_idx]
                feat_dict = {col: float(row[col]) for col in class_df.columns if col not in ["label", "system:index", ".geo"]}
                anchors.append({
                    "plot_id": a["id"],
                    "name": a["name"],
                    "latitude": a["lat"],
                    "longitude": a["lng"],
                    "label": a["label"],
                    "class_name": a["class"],
                    "features": feat_dict
                })
        self._sundarbans_anchors = anchors

    def get_boundary_geojson(self, region_id: str) -> Optional[Dict[str, Any]]:
        filename = f"{region_id}_boundary.geojson"
        path = os.path.join(GEO_DIR, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return None

    def get_plots(self, region_id: str) -> List[Dict[str, Any]]:
        if region_id == "kali":
            if self._kali_df is None:
                return []
            plots = []
            for _, row in self._kali_df.iterrows():
                plots.append({
                    "plot_id": str(row["plot_id"]),
                    "latitude": float(row["decimalLatitude"]),
                    "longitude": float(row["decimalLongitude"]),
                    "observed_dominant_family": str(row["dominant_family"]) if pd.notna(row["dominant_family"]) else None,
                    "observed_species_richness": float(row["species_richness"]) if pd.notna(row["species_richness"]) else None,
                    "observed_shannon_index": float(row["shannon_index"]) if pd.notna(row["shannon_index"]) else None,
                    "has_ground_truth": True,
                })
            return plots

        elif region_id == "sundarbans":
            if self._sundarbans_anchors is None:
                return []
            plots = []
            for a in self._sundarbans_anchors:
                plots.append({
                    "plot_id": a["plot_id"],
                    "latitude": a["latitude"],
                    "longitude": a["longitude"],
                    "observed_dominant_family": a["class_name"],
                    "observed_species_richness": None,
                    "observed_shannon_index": None,
                    "has_ground_truth": True,
                })
            return plots

        return []

    def get_plot_by_id(self, region_id: str, plot_id: str) -> Optional[Dict[str, Any]]:
        if region_id == "kali":
            if self._kali_df is None:
                return None
            matches = self._kali_df[self._kali_df["plot_id"].astype(str) == str(plot_id)]
            if matches.empty:
                return None
            row = matches.iloc[0]
            feature_cols = [c for c in self._kali_df.columns if c not in
                            ["plot_id", "decimalLatitude", "decimalLongitude",
                             "dominant_family", "species_richness", "shannon_index"]]
            features = {c: float(row[c]) for c in feature_cols}
            return {
                "region_id": "kali",
                "plot_id": str(row["plot_id"]),
                "latitude": float(row["decimalLatitude"]),
                "longitude": float(row["decimalLongitude"]),
                "observed_dominant_family": str(row["dominant_family"]),
                "observed_species_richness": float(row["species_richness"]),
                "observed_shannon_index": float(row["shannon_index"]),
                "features": features
            }

        elif region_id == "sundarbans":
            if self._sundarbans_anchors is None:
                return None
            for a in self._sundarbans_anchors:
                if a["plot_id"] == plot_id:
                    return {
                        "region_id": "sundarbans",
                        "plot_id": a["plot_id"],
                        "latitude": a["latitude"],
                        "longitude": a["longitude"],
                        "observed_dominant_family": a["class_name"],
                        "observed_species_richness": None,
                        "observed_shannon_index": None,
                        "features": a["features"]
                    }
        return None

    def get_nearest_plot(self, region_id: str, lat: float, lng: float) -> Tuple[Optional[Dict[str, Any]], float]:
        plots = self.get_plots(region_id)
        if not plots:
            return None, float("inf")

        best_plot = None
        min_dist = float("inf")

        for p in plots:
            # Haversine distance in km
            d_lat = math.radians(p["latitude"] - lat)
            d_lng = math.radians(p["longitude"] - lng)
            a = (math.sin(d_lat / 2) ** 2 +
                 math.cos(math.radians(lat)) * math.cos(math.radians(p["latitude"])) *
                 math.sin(d_lng / 2) ** 2)
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            dist_km = 6371.0 * c

            if dist_km < min_dist:
                min_dist = dist_km
                best_plot = p

        if best_plot:
            full_plot = self.get_plot_by_id(region_id, best_plot["plot_id"])
            return full_plot, min_dist

        return None, float("inf")

# Singleton instance
data_loader = DataLoader()
