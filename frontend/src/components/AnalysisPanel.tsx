import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Loader2, Sparkles, MapPin, Sliders, AlertCircle } from 'lucide-react';
import { RegionSummary, PlotSummary } from '../types';

interface AnalysisPanelProps {
  regions: RegionSummary[];
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  plots: PlotSummary[];
  selectedPlotId: string | null;
  onSelectPlot: (plotId: string) => void;
  customCoords: { lat: number; lng: number } | null;
  onRunAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
  analysisError: string | null;
}

const ANALYSIS_STEPS = [
  { step: '01', title: 'CONNECTING TO ORBITAL TELEMETRY', sub: 'Synchronizing Sentinel-1 & Sentinel-2 constellations' },
  { step: '02', title: 'LOADING SATELLITE FEATURE STACK', sub: 'Calibrating 10m-20m surface reflectance bands' },
  { step: '03', title: 'COMPUTING VEGETATION & RED-EDGE INDICES', sub: 'Calculating NDVI, NDVIre, NDre1, NDWI, NDI45' },
  { step: '04', title: 'ANALYZING DUAL-POL SAR RADAR BACKSCATTER', sub: 'Assessing VH/VV volume scattering & canopy structure' },
  { step: '05', title: 'EXECUTING RANDOM FOREST INFERENCE', sub: 'Passing 18-band feature matrix through trained estimators' },
  { step: '06', title: 'GENERATING ECOLOGICAL PROFILE', sub: 'Compiling dominant family, richness, and Shannon diversity' },
];

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  plots,
  selectedPlotId,
  onSelectPlot,
  customCoords,
  onRunAnalysis,
  isAnalyzing,
  analysisError,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Progressive Step Timer during isAnalyzing
  useEffect(() => {
    if (!isAnalyzing) {
      setActiveStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedPlot = plots.find((p) => p.plot_id === selectedPlotId);

  return (
    <div className="glass-panel p-5 rounded-xl border-white/[0.08] flex flex-col space-y-5">
      
      {/* Panel Header */}
      <div className="border-b border-white/[0.06] pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-forest-400 uppercase">
            GEOSPATIAL INFERENCE CONTROLLER
          </span>
          <span className="text-[10px] font-mono text-slate-400">READY</span>
        </div>
        <h2 className="text-xl font-display font-bold text-white mt-1">Forest Analysis</h2>
      </div>

      {/* Region Selector Tabs */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-2">TARGET STUDY AREA</label>
        <div className="grid grid-cols-2 gap-2">
          {regions.map((reg) => {
            const isSelected = reg.id === selectedRegionId;
            return (
              <button
                key={reg.id}
                onClick={() => onSelectRegion(reg.id)}
                disabled={isAnalyzing}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-forest-500/60 bg-forest-950/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'border-white/[0.06] bg-surface-secondary/50 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="text-xs font-bold font-mono tracking-wide">{reg.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{reg.state}, {reg.country}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plot Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono text-slate-400">SURVEY PLOT LOCATION</label>
          <span className="text-[10px] font-mono text-forest-400">{plots.length} Available</span>
        </div>

        <select
          value={selectedPlotId || ''}
          onChange={(e) => onSelectPlot(e.target.value)}
          disabled={isAnalyzing}
          className="w-full rounded-lg border border-white/[0.1] bg-surface-secondary px-3 py-2 text-xs font-mono text-white focus:border-forest-500 focus:outline-none"
        >
          {plots.map((p) => (
            <option key={p.plot_id} value={p.plot_id}>
              {p.plot_id} {p.observed_dominant_family ? `(${p.observed_dominant_family})` : ''} - [{p.latitude.toFixed(3)}°N, {p.longitude.toFixed(3)}°E]
            </option>
          ))}
        </select>
      </div>

      {/* Selected Location Summary Card */}
      <div className="p-3 rounded-lg border border-white/[0.06] bg-surface-secondary/60 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <div className="flex items-center space-x-1.5 text-forest-300 font-semibold">
            <MapPin className="h-3.5 w-3.5" />
            <span>{selectedPlot ? selectedPlot.plot_id : 'Custom Target'}</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {selectedPlot?.has_ground_truth ? 'CALIBRATED GROUND TRUTH' : 'INTERPOLATED'}
          </span>
        </div>
        <div className="text-[11px] text-slate-300">
          Latitude: <span className="text-white font-mono">{selectedPlot?.latitude.toFixed(5) || customCoords?.lat.toFixed(5) || 'N/A'}°N</span>
        </div>
        <div className="text-[11px] text-slate-300">
          Longitude: <span className="text-white font-mono">{selectedPlot?.longitude.toFixed(5) || customCoords?.lng.toFixed(5) || 'N/A'}°E</span>
        </div>
        {selectedPlot?.observed_dominant_family && (
          <div className="mt-1.5 pt-1.5 border-t border-white/[0.06] text-[11px] text-slate-300 flex justify-between">
            <span className="text-slate-400">Observed in field:</span>
            <span className="text-forest-400 font-bold">{selectedPlot.observed_dominant_family}</span>
          </div>
        )}
      </div>

      {/* Action: Run Analysis */}
      <button
        onClick={onRunAnalysis}
        disabled={isAnalyzing}
        className={`relative w-full overflow-hidden rounded-lg py-3.5 px-4 text-sm font-mono font-bold tracking-wider uppercase transition-all shadow-lg cursor-pointer ${
          isAnalyzing
            ? 'bg-forest-950 border border-forest-500/40 text-forest-300 cursor-wait'
            : 'bg-gradient-to-r from-forest-600 to-emerald-500 hover:from-forest-500 hover:to-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.35)]'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-forest-400" />
              <span>PROCESSING SATELLITE TELEMETRY...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>RUN INFERENCE PIPELINE</span>
            </>
          )}
        </div>
      </button>

      {/* Error Message if any */}
      {analysisError && (
        <div className="flex items-start space-x-2 p-3 rounded-lg border border-red-500/30 bg-red-950/40 text-red-300 text-xs font-mono">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <span>{analysisError}</span>
        </div>
      )}

      {/* Multi-Step Analysis Progress Animation */}
      {isAnalyzing && (
        <div className="p-4 rounded-lg border border-forest-500/30 bg-surface-secondary/90 tech-bracket-container animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono mb-3">
            <span className="text-forest-400 font-semibold flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>INFERENCE PIPELINE ACTIVE</span>
            </span>
            <span className="text-slate-400">
              {Math.round(((activeStepIndex + 1) / ANALYSIS_STEPS.length) * 100)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-forest-500 to-telemetry-cyan transition-all duration-300 ease-out"
              style={{ width: `${((activeStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            ></div>
          </div>

          {/* Active Step Details */}
          <div className="space-y-2">
            {ANALYSIS_STEPS.map((step, idx) => {
              const isPassed = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              return (
                <div
                  key={step.step}
                  className={`flex items-start space-x-2.5 transition-opacity ${
                    isCurrent
                      ? 'opacity-100'
                      : isPassed
                      ? 'opacity-60'
                      : 'opacity-20'
                  }`}
                >
                  <div className="mt-0.5">
                    {isPassed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-forest-400" />
                    ) : isCurrent ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-telemetry-cyan" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-mono font-bold text-white leading-none">
                      {step.step} / {step.title}
                    </div>
                    {isCurrent && (
                      <div className="text-[10px] text-forest-300 mt-1 font-sans">
                        {step.sub}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
