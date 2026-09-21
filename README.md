# TerraTree — AI-Powered Forest Intelligence

> **"See the forest. Beyond what satellites show."**

TerraTree is a production-quality geospatial AI platform that estimates tropical forest biodiversity, dominant plant families, species richness, and mangrove extent by fusing **Sentinel-1 SAR radar**, **Sentinel-2 optical spectroscopy**, and **calibrated botanical ground truth**.

---

## 1. Architecture Overview

```
                                  ORBITAL SENSORS
                     Sentinel-2 (MSI)         Sentinel-1 (C-SAR)
               [Optical Reflectance + Red-Edge]    [Dual-Pol VH/VV Radar]
                                      │                     │
                                      ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       REUSABLE INFERENCE PIPELINE                           │
│  • Band Extraction: B2, B3, B4, B5, B6, B7, B8, B8A, B11, B12 (10m - 20m)   │
│  • Spectral Chemistry: NDVI, NDVIre, NDWI, NDI45, NDre1                     │
│  • SAR Radar Structure: VH, VV, VH/VV Depolarization Volume Ratio           │
│                                                                             │
│               ▼                                            ▼                │
│    Kali Tiger Reserve Track                     Sundarbans Delta Track      │
│    (2,485 Field-Surveyed Trees)                 (Global Mangrove Watch)     │
│    • Dominant Family Classifier (7 classes)     • Land Cover RF Classifier  │
│    • Species Richness Regressor (21-67 taxa)    • 94.1% Holdout Accuracy    │
│    • Shannon Diversity Regressor (H': 3.0-4.2)  • 0.920 Cohen's Kappa       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FASTAPI REST BACKEND                               │
│        /api/regions   /api/analyze   /api/model-info   /api/boundary        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                RETRO-FUTURISTIC SCIENTIFIC REACT DASHBOARD                  │
│  • Dark Matter & Satellite Leaflet Map  • Multi-step Orbital Telemetry HUD  │
│  • Live Probability Distribution Bars   • 18-Band Spectral Inspector Drawer │
│  • Genuine Scikit-Learn Feature Weights • Scientific Validation Auditing    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Available Regions & Discovered Models

The application directly interfaces with the serialized model artifacts in `dashboard/models/` without synthetic or mocked predictions:

### 1. Kali Tiger Reserve (KTR), Karnataka, India
- **Landscape**: Western Ghats biodiversity hotspot (moist deciduous and semi-evergreen tropical forest).
- **Botanical Ground Truth**: 2,485 individually enumerated trees across 55 permanent 50×10m vegetation plots (`KTR_actual_ground_truth.csv` and `dashboard/data/kali_training_table.csv`).
- **Trained Artifact**: `dashboard/models/kali_models.joblib`
  - `family_classifier`: `RandomForestClassifier(n_estimators=200, class_weight='balanced')` predicting 7 plant families: *Combretaceae, Fabaceae, Lauraceae, Malvaceae, Other family, Rubiaceae, Rutaceae*.
  - `richness_regressor`: `RandomForestRegressor(n_estimators=200)` estimating continuous species richness per plot.
  - `shannon_regressor`: `RandomForestRegressor(n_estimators=200)` estimating continuous Shannon-Wiener diversity index $H'$.
  - **Validation Benchmark**: **32.73% Leave-One-Out Cross-Validation (LOOCV) Accuracy** across 7 classes on 55 field survey plots. *(Honest out-of-fold generalization, distinctly differentiated from 100% full-training fit).*

### 2. Sundarbans Biosphere Reserve, West Bengal, India
- **Landscape**: World's largest contiguous tidal mangrove forest and UNESCO World Heritage blue carbon sink.
- **Reference Dataset**: 3,706 stratified points cross-referenced against Global Mangrove Watch (GMW v3) and ESA WorldCover 10m (`dashboard/data/sundarbans_training_table_v4.csv`).
- **Trained Artifact**: `dashboard/models/random_forest_v1.joblib`
  - `model`: `RandomForestClassifier(n_estimators=300, max_features='sqrt')` predicting 4 classes: *Water, Mangrove, Other vegetation, Bare/built*.
  - **Validation Benchmark**: **94.06% Overall Accuracy**, **0.9203 Cohen's Kappa** on 1,112 held-out verification points.

---

## 3. Quick Start: Single Command Launch

To launch the unified production application (FastAPI backend + compiled React frontend on a single port):

```bash
# 1. Install Python dependencies (if not already installed)
pip install -r requirements.txt

# 2. Run the unified launcher
python start.py
```

The application will launch on **`http://localhost:8000`** and automatically open in your default browser.
Interactive OpenAPI docs are available at **`http://localhost:8000/docs`**.

---

## 4. Development Workflow

If you wish to modify the React frontend with Vite hot-module replacement (HMR):

### Option A: Development Mode via `start.py`
```bash
python start.py --dev
```
This concurrently starts:
- FastAPI Backend on `http://127.0.0.1:8000`
- Vite Frontend Dev Server with HMR on `http://localhost:5173` (with `/api` proxying)

### Option B: Manual Execution

#### Terminal 1 — Backend:
```bash
uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

#### Rebuilding Frontend Production Bundle:
```bash
cd frontend
npm run build
```

---

## 5. Directory Structure

```
terratree/
├── src/
│   ├── inference/
│   │   ├── engine.py             # Reusable inference engine loading joblib models
│   │   └── schemas.py            # Pydantic request/response domain models
│   ├── data/
│   │   ├── data_loader.py        # Plot loader & spatial proximity matcher
│   │   └── geo/
│   │       ├── kali_boundary.geojson        # High-precision OSM boundary
│   │       └── sundarbans_boundary.geojson  # High-precision OSM boundary
│   └── api/
│       └── main.py               # FastAPI application with static SPA mounting
├── frontend/                     # Modern React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, Hero, MapViewer, AnalysisPanel, etc.
│   │   ├── services/api.ts       # Typed REST API client
│   │   ├── types/index.ts        # TypeScript domain contracts
│   │   └── App.tsx               # Primary dashboard layout
│   └── dist/                     # Production distribution bundle
├── dashboard/                    # Preserved original Streamlit files & models
│   ├── models/
│   │   ├── kali_models.joblib    # 3-target RF models for Western Ghats
│   │   └── random_forest_v1.joblib # 4-class RF model for Sundarbans
│   ├── data/
│   │   ├── kali_training_table.csv
│   │   └── sundarbans_training_table_v4.csv
│   └── app.py
├── notebooks/                    # Preserved working research notebooks (untouched)
├── data/
│   └── raw/
│       └── KTR_actual_ground_truth.csv  # 2,485 individual field tree records
├── start.py                      # One-click startup script
└── requirements.txt
```

---

## 6. Inference & Fallback / Demo Mode

1. **Exact Feature Ordering**: The inference engine strictly preserves the exact alphabetical and topological column ordering expected by scikit-learn estimators (`['B11', 'B12', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'NDI45', 'NDVI', 'NDVIre', 'NDWI', 'NDre1', 'VH', 'VH_VV_ratio', 'VV']` for Kali).
2. **Transparent Mode Identification**:
   - When a user selects a surveyed plot: the UI displays **`SURVEYED FIELD PLOT`** with precomputed calibrated satellite feature vectors.
   - When arbitrary map coordinates are selected: the UI flags **`PROXIMITY ESTIMATE`**, transparently disclosing the distance to the nearest station and explaining that Google Earth Engine noncommercial compute quota is in restricted tier.
   - **No simulated or fake metrics are ever shown.**

---

## 7. Scientific Limitations & Disclaimer

> **Important**: TerraTree provides model-based estimates and should not be interpreted as a substitute for ecological field surveys.

- Orbital satellite sensors aggregate canopy reflectance over 10m–20m pixel footprints. Sub-canopy saplings, understory shrubs, and rare non-dominant species cannot be directly identified from orbit.
- The Kali Tiger Reserve model was trained on 55 field survey plots ($n=55$). While LOOCV is the statistically rigorous approach for this sample size, predictions for rare plant families carry uncertainty.
- In-situ field surveys conducted by trained botanists remain the indispensable baseline for regional conservation management.
