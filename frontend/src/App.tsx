import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MapViewer } from './components/MapViewer';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { TechnicalFeatures } from './components/TechnicalFeatures';
import { FeatureImportance } from './components/FeatureImportance';
import { ModelPage } from './components/ModelPage';
import { AboutPage } from './components/AboutPage';

import {
  fetchRegions,
  fetchBoundary,
  fetchPlots,
  analyzePlot
} from './services/api';

import { RegionSummary, PlotSummary, AnalyzeResponse } from './types';
import { Loader2, Terminal, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'analyze' | 'models' | 'about'>('explore');
  
  const [regions, setRegions] = useState<RegionSummary[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('kali');
  const [boundaryGeoJson, setBoundaryGeoJson] = useState<any>(null);
  const [plots, setPlots] = useState<PlotSummary[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [showTechnical, setShowTechnical] = useState<boolean>(false);
  const [showImportance, setShowImportance] = useState<boolean>(false);

  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const analysisSectionRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Regions
  useEffect(() => {
    fetchRegions()
      .then((data) => {
        setRegions(data);
        if (data.length > 0) {
          setSelectedRegionId(data[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load regions:', err);
        setAnalysisError('Unable to connect to TerraTree backend. Ensure API is running.');
      })
      .finally(() => {
        setLoadingInitial(false);
      });
  }, []);

  // 2. Load Boundary and Plots when Region Changes
  useEffect(() => {
    if (!selectedRegionId) return;

    fetchBoundary(selectedRegionId)
      .then((b) => setBoundaryGeoJson(b))
      .catch((err) => console.warn('Boundary fetch note:', err));

    fetchPlots(selectedRegionId)
      .then((p) => {
        setPlots(p);
        if (p.length > 0) {
          const firstPlotId = p[0].plot_id;
          setSelectedPlotId(firstPlotId);
          setCustomCoords(null);
          // Run initial analysis on first plot so user sees real results immediately
          executeAnalysis(selectedRegionId, firstPlotId);
        }
      })
      .catch((err) => {
        console.error('Failed to load plots:', err);
      });
  }, [selectedRegionId]);

  // Execute Analysis Function
  const executeAnalysis = async (regionId: string, plotId?: string | null, lat?: number, lng?: number) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    // Give minimum 1.6s for the high-tech animation sequence to play cleanly
    const startTime = Date.now();

    try {
      const payload: any = { region_id: regionId };
      if (plotId) {
        payload.plot_id = plotId;
      } else if (lat != null && lng != null) {
        payload.latitude = lat;
        payload.longitude = lng;
      }

      const res = await analyzePlot(payload);
      
      const elapsed = Date.now() - startTime;
      const delayNeeded = Math.max(0, 1600 - elapsed);
      await new Promise((resolve) => setTimeout(resolve, delayNeeded));

      setAnalysisResult(res);
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      const delayNeeded = Math.max(0, 800 - elapsed);
      await new Promise((resolve) => setTimeout(resolve, delayNeeded));
      setAnalysisError(err.message || 'Inference execution failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPlot = (plotId: string) => {
    setSelectedPlotId(plotId);
    setCustomCoords(null);
    executeAnalysis(selectedRegionId, plotId);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setCustomCoords({ lat, lng });
    setSelectedPlotId(null);
    executeAnalysis(selectedRegionId, undefined, lat, lng);
  };

  const handleRunAnalysis = async () => {
    if (selectedPlotId) {
      await executeAnalysis(selectedRegionId, selectedPlotId);
    } else if (customCoords) {
      await executeAnalysis(selectedRegionId, undefined, customCoords.lat, customCoords.lng);
    } else if (plots.length > 0) {
      await executeAnalysis(selectedRegionId, plots[0].plot_id);
    }
  };

  const activeRegion = regions.find((r) => r.id === selectedRegionId) || {
    id: 'kali',
    name: 'Kali Tiger Reserve',
    tagline: 'Western Ghats Biodiversity Hotspot',
    description: '',
    state: 'Karnataka',
    country: 'India',
    ecosystem_type: 'Moist Deciduous & Semi-Evergreen',
    center: { lat: 15.1157, lng: 74.4397 },
    default_zoom: 11,
    total_plots: 55,
    model_type: 'Multi-target Random Forest',
    outputs_supported: ['Dominant Plant Family', 'Species Richness', 'Shannon Diversity'],
    has_boundary: true,
    status: 'active',
  };

  if (loadingInitial) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#06090d] text-forest-400 font-mono">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <div className="text-sm tracking-widest uppercase">INITIALIZING TERRATREE CORE...</div>
        <div className="text-xs text-slate-400 mt-2">Loading trained model weights & orbital telemetry</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090d] text-slate-100 flex flex-col font-sans selection:bg-forest-500/30 selection:text-forest-300">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegionId={selectedRegionId}
        telemetryCoords={
          analysisResult
            ? analysisResult.coordinates
            : selectedPlotId
            ? {
                lat: plots.find((p) => p.plot_id === selectedPlotId)?.latitude || activeRegion.center.lat,
                lng: plots.find((p) => p.plot_id === selectedPlotId)?.longitude || activeRegion.center.lng,
              }
            : undefined
        }
      />

      {/* Main Content Area based on activeTab */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <div>
            <HeroSection
              onSelectRegion={(rId) => {
                setSelectedRegionId(rId);
                analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreClick={() => {
                analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Analysis Workspace Anchor */}
            <div ref={analysisSectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
              
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-forest-400 tracking-wider uppercase">
                    INTERACTIVE GEOSPATIAL WORKSPACE
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mt-0.5">
                    {activeRegion.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    {activeRegion.tagline} • {activeRegion.state}, {activeRegion.country}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-surface-secondary border border-white/[0.06] text-slate-300">
                    SENSORS: S2 (OPTICAL) + S1 (SAR)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-surface-secondary border border-white/[0.06] text-forest-400">
                    RF ENSEMBLE ACTIVE
                  </span>
                </div>
              </div>

              {/* Grid Layout: Map (Left) + Controller & Results (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Map Viewport */}
                <div className="lg:col-span-7 h-[520px] lg:h-[680px]">
                  <MapViewer
                    region={activeRegion}
                    boundaryGeoJson={boundaryGeoJson}
                    plots={plots}
                    selectedPlotId={selectedPlotId}
                    onSelectPlot={handleSelectPlot}
                    onMapClick={handleMapClick}
                  />
                </div>

                {/* Controller & Analysis Side Panel */}
                <div className="lg:col-span-5 space-y-6">
                  <AnalysisPanel
                    regions={regions}
                    selectedRegionId={selectedRegionId}
                    onSelectRegion={(id) => setSelectedRegionId(id)}
                    plots={plots}
                    selectedPlotId={selectedPlotId}
                    onSelectPlot={handleSelectPlot}
                    customCoords={customCoords}
                    onRunAnalysis={handleRunAnalysis}
                    isAnalyzing={isAnalyzing}
                    analysisError={analysisError}
                  />
                </div>

              </div>

              {/* Analysis Results Dashboard Below */}
              {analysisResult && (
                <div className="mt-10 space-y-6">
                  <ResultsDashboard
                    result={analysisResult}
                    onToggleTechnical={() => setShowTechnical(!showTechnical)}
                    showTechnical={showTechnical}
                    onToggleImportance={() => setShowImportance(!showImportance)}
                    showImportance={showImportance}
                  />

                  {/* Expandable Technical Satellite Bands Inspector */}
                  {showTechnical && (
                    <TechnicalFeatures features={analysisResult.features} />
                  )}

                  {/* Expandable Model Feature Importance Chart */}
                  {showImportance && (
                    <FeatureImportance
                      importances={analysisResult.top_feature_importances}
                      regionId={selectedRegionId}
                    />
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono text-forest-400 tracking-wider uppercase">
                TARGETED INFERENCE MODE
              </span>
              <h1 className="text-3xl font-display font-bold text-white mt-1">
                Plot Analysis & Spectral Profile
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <AnalysisPanel
                  regions={regions}
                  selectedRegionId={selectedRegionId}
                  onSelectRegion={(id) => setSelectedRegionId(id)}
                  plots={plots}
                  selectedPlotId={selectedPlotId}
                  onSelectPlot={handleSelectPlot}
                  customCoords={customCoords}
                  onRunAnalysis={handleRunAnalysis}
                  isAnalyzing={isAnalyzing}
                  analysisError={analysisError}
                />
              </div>

              <div className="lg:col-span-7">
                {analysisResult ? (
                  <ResultsDashboard
                    result={analysisResult}
                    onToggleTechnical={() => setShowTechnical(!showTechnical)}
                    showTechnical={showTechnical}
                    onToggleImportance={() => setShowImportance(!showImportance)}
                    showImportance={showImportance}
                  />
                ) : (
                  <div className="glass-panel p-10 rounded-xl text-center font-mono text-slate-400">
                    Select a plot or coordinates on the left and click "Run Inference Pipeline".
                  </div>
                )}
              </div>
            </div>

            {analysisResult && showTechnical && (
              <TechnicalFeatures features={analysisResult.features} />
            )}

            {analysisResult && showImportance && (
              <FeatureImportance
                importances={analysisResult.top_feature_importances}
                regionId={selectedRegionId}
              />
            )}
          </div>
        )}

        {activeTab === 'models' && <ModelPage />}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#040608] py-8 text-xs font-mono text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold font-display">TERRATREE</span>
            <span>—</span>
            <span>AI-Powered Forest Intelligence</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Sentinel-1/2 Multi-Sensor Fusion</span>
            <span>•</span>
            <span>Western Ghats Ground Truth (KTR)</span>
            <span>•</span>
            <span>Sundarbans Blue Carbon (GMW)</span>
          </div>

          <div className="text-[10px] text-slate-400">
            Model Estimates • Not a substitute for ecological field surveys
          </div>
        </div>
      </footer>

    </div>
  );
};
