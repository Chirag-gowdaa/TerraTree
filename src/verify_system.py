import os
import sys
import re

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from src.api.main import app

def run_verification():
    print("=" * 60)
    print("TERRATREE VERIFICATION SUITE")
    print("=" * 60)

    client = TestClient(app)

    # 1. Health check
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("[PASS] /api/health:", r.json()["status"])

    # 2. Supported regions
    r = client.get("/api/regions")
    assert r.status_code == 200, f"Regions failed: {r.status_code}"
    regions = r.json()
    assert len(regions) == 2, f"Expected 2 regions, got {len(regions)}"
    print(f"[PASS] /api/regions: {len(regions)} regions found {[reg['id'] for reg in regions]}")

    # 3. Kali boundary & plots
    r = client.get("/api/regions/kali/boundary")
    assert r.status_code == 200, "Kali boundary failed"
    boundary = r.json()
    assert boundary["type"] == "FeatureCollection"
    print(f"[PASS] /api/regions/kali/boundary: Valid GeoJSON ({len(boundary['features'])} features)")

    r = client.get("/api/regions/kali/plots")
    assert r.status_code == 200, "Kali plots failed"
    kali_plots = r.json()
    assert len(kali_plots) == 55, f"Expected 55 Kali plots, got {len(kali_plots)}"
    print(f"[PASS] /api/regions/kali/plots: All {len(kali_plots)} field plots verified")

    # 4. Sundarbans boundary & plots
    r = client.get("/api/regions/sundarbans/boundary")
    assert r.status_code == 200, "Sundarbans boundary failed"
    s_boundary = r.json()
    assert s_boundary["type"] == "FeatureCollection"
    print(f"[PASS] /api/regions/sundarbans/boundary: Valid GeoJSON ({len(s_boundary['features'])} features)")

    r = client.get("/api/regions/sundarbans/plots")
    assert r.status_code == 200, "Sundarbans plots failed"
    s_plots = r.json()
    assert len(s_plots) > 0, "No Sundarbans plots found"
    print(f"[PASS] /api/regions/sundarbans/plots: {len(s_plots)} anchor reference stations verified")

    # 5. Model Inference: Kali Plot K1
    r = client.post("/api/analyze", json={"region_id": "kali", "plot_id": "K1"})
    assert r.status_code == 200, f"Analysis failed: {r.text}"
    k_res = r.json()
    assert k_res["prediction"]["dominant_family"] is not None
    assert k_res["prediction"]["species_richness"] is not None
    assert k_res["prediction"]["shannon_diversity"] is not None
    assert len(k_res["top_feature_importances"]) > 0
    print(f"[PASS] /api/analyze (Kali K1): Dominant Family={k_res['prediction']['dominant_family']} (Prob: {k_res['prediction']['dominant_family_probability']:.1%}), Richness={k_res['prediction']['species_richness']}, Shannon={k_res['prediction']['shannon_diversity']}")

    # 6. Model Inference: Sundarbans Plot SB-MG01
    r = client.post("/api/analyze", json={"region_id": "sundarbans", "plot_id": "SB-MG01"})
    assert r.status_code == 200, f"Analysis failed: {r.text}"
    s_res = r.json()
    assert s_res["prediction"]["land_cover_class"] == "Mangrove"
    assert s_res["prediction"]["land_cover_probability"] is not None
    print(f"[PASS] /api/analyze (Sundarbans SB-MG01): Class={s_res['prediction']['land_cover_class']} (Prob: {s_res['prediction']['land_cover_probability']:.1%})")

    # 7. Model Info
    r = client.get("/api/model-info")
    assert r.status_code == 200, "Model info failed"
    info = r.json()
    assert "kali" in info and "sundarbans" in info
    print(f"[PASS] /api/model-info: Valid technical specs for {[k for k in info.keys()]}")

    # 8. Root Frontend HTML & Asset Serving
    r_root = client.get("/")
    assert r_root.status_code == 200, f"Root failed: {r_root.status_code}"
    assert "TerraTree" in r_root.text
    print("[PASS] GET /: Root frontend HTML served with 200 OK")

    assets = re.findall(r'/assets/[a-zA-Z0-9_\-\.]+', r_root.text)
    assert len(assets) >= 2, f"Expected at least 2 assets, found {assets}"
    for asset in assets:
        r_asset = client.get(asset)
        assert r_asset.status_code == 200, f"Asset {asset} failed with {r_asset.status_code}"
        print(f"[PASS] Asset {asset}: 200 OK ({len(r_asset.content):,} bytes)")

    print("=" * 60)
    print("ALL VERIFICATION SUITE CHECKS PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    run_verification()
