import os
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from src.inference.schemas import (
    RegionSummary, PlotSummary, PlotDetail, AnalyzeRequest,
    AnalyzeResponse, TechnicalModelDetails
)
from src.inference.engine import inference_engine
from src.data.data_loader import data_loader

app = FastAPI(
    title="TerraTree — AI Forest Intelligence API",
    description="Satellite imagery + ecological ground truth + multi-sensor ML inference service.",
    version="2.0.0"
)

# Enable CORS for local development and Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "TerraTree Geospatial Inference Engine",
        "version": "2.0.0",
        "regions_loaded": ["kali", "sundarbans"]
    }

@app.get("/api/regions", response_model=List[RegionSummary])
def list_regions():
    return inference_engine.get_supported_regions()

@app.get("/api/regions/{region_id}", response_model=RegionSummary)
def get_region(region_id: str):
    region = inference_engine.get_region_summary(region_id)
    if not region:
        raise HTTPException(status_code=404, detail=f"Region '{region_id}' not found.")
    return region

@app.get("/api/regions/{region_id}/boundary")
def get_region_boundary(region_id: str):
    geojson = data_loader.get_boundary_geojson(region_id)
    if not geojson:
        raise HTTPException(status_code=404, detail=f"Boundary GeoJSON for '{region_id}' not found.")
    return geojson

@app.get("/api/regions/{region_id}/plots", response_model=List[PlotSummary])
def get_region_plots(region_id: str):
    plots = data_loader.get_plots(region_id)
    if not plots:
        raise HTTPException(status_code=404, detail=f"No plots found for region '{region_id}'.")
    return plots

@app.get("/api/regions/{region_id}/plots/{plot_id}", response_model=PlotDetail)
def get_plot_detail(region_id: str, plot_id: str):
    plot = data_loader.get_plot_by_id(region_id, plot_id)
    if not plot:
        raise HTTPException(status_code=404, detail=f"Plot '{plot_id}' not found in region '{region_id}'.")
    return plot

@app.post("/api/analyze", response_model=AnalyzeResponse)
def run_analysis(request: AnalyzeRequest):
    try:
        response = inference_engine.analyze(
            region_id=request.region_id,
            plot_id=request.plot_id,
            latitude=request.latitude,
            longitude=request.longitude,
            custom_features=request.custom_features
        )
        return response
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")

@app.get("/api/model-info", response_model=Dict[str, TechnicalModelDetails])
def get_model_technical_info():
    return inference_engine.get_model_info()

# Static distribution mounting for single-command production serving
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True)
