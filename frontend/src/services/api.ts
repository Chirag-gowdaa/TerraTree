import type {
  RegionSummary, PlotSummary, PlotDetail, AnalyzeResponse, TechnicalModelDetails
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchRegions(): Promise<RegionSummary[]> {
  const res = await fetch(`${API_BASE}/regions`);
  if (!res.ok) throw new Error(`Failed to fetch regions: ${res.statusText}`);
  return res.json();
}

export async function fetchRegion(regionId: string): Promise<RegionSummary> {
  const res = await fetch(`${API_BASE}/regions/${regionId}`);
  if (!res.ok) throw new Error(`Failed to fetch region '${regionId}': ${res.statusText}`);
  return res.json();
}

export async function fetchBoundary(regionId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/regions/${regionId}/boundary`);
  if (!res.ok) throw new Error(`Failed to fetch boundary for '${regionId}': ${res.statusText}`);
  return res.json();
}

export async function fetchPlots(regionId: string): Promise<PlotSummary[]> {
  const res = await fetch(`${API_BASE}/regions/${regionId}/plots`);
  if (!res.ok) throw new Error(`Failed to fetch plots for '${regionId}': ${res.statusText}`);
  return res.json();
}

export async function fetchPlotDetail(regionId: string, plotId: string): Promise<PlotDetail> {
  const res = await fetch(`${API_BASE}/regions/${regionId}/plots/${plotId}`);
  if (!res.ok) throw new Error(`Failed to fetch plot '${plotId}': ${res.statusText}`);
  return res.json();
}

export async function analyzePlot(payload: {
  region_id: string;
  plot_id?: string;
  latitude?: number;
  longitude?: number;
  custom_features?: Record<string, number>;
}): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Inference error: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchModelInfo(): Promise<Record<string, TechnicalModelDetails>> {
  const res = await fetch(`${API_BASE}/model-info`);
  if (!res.ok) throw new Error(`Failed to fetch model technical info: ${res.statusText}`);
  return res.json();
}
