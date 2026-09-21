import React from 'react';
import { Layers, Radio, Sun, Droplets, Sparkles } from 'lucide-react';

interface TechnicalFeaturesProps {
  features: Record<string, number>;
}

export const TechnicalFeatures: React.FC<TechnicalFeaturesProps> = ({ features }) => {
  const indices = ['NDVI', 'NDVIre', 'NDWI', 'NDI45', 'NDre1'];
  const sar = ['VH', 'VV', 'VH_VV_ratio'];
  const redEdge = ['B5', 'B6', 'B7'];
  const optical = ['B2', 'B3', 'B4', 'B8', 'B8A', 'B11', 'B12', 'B1', 'B9'];

  return (
    <div className="glass-panel p-6 rounded-xl border-white/[0.08] tech-bracket-container animate-fadeIn space-y-6">
      <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-forest-400 uppercase">
            CALIBRATED ORBITAL SENSOR STACK
          </span>
          <h3 className="text-base font-mono font-bold text-white mt-0.5">
            Technical Satellite Observations
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {Object.keys(features).length} Input Channels
        </span>
      </div>

      {/* Section 1: Key Spectral & Red-Edge Indices */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-forest-400 font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>VEGETATION & MOISTURE INDICES (SPECTROSCOPY)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {indices.map((key) => {
            const val = features[key];
            if (val === undefined) return null;
            return (
              <div key={key} className="p-3 rounded-lg border border-white/[0.06] bg-surface-secondary/70">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{key}</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {val.toFixed(3)}
                </div>
                <div className="w-full bg-surface-elevated h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-forest-400"
                    style={{ width: `${Math.min(Math.max((val + 1) * 50, 5), 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Sentinel-1 SAR Radar */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold mb-3">
          <Radio className="h-3.5 w-3.5" />
          <span>SENTINEL-1 C-BAND SAR (STRUCTURAL VOLUME BACKSCATTER)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sar.map((key) => {
            const val = features[key];
            if (val === undefined) return null;
            return (
              <div key={key} className="p-3 rounded-lg border border-white/[0.06] bg-surface-secondary/70">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{key}</div>
                <div className="text-lg font-mono font-bold text-cyan-300 mt-1">
                  {val.toFixed(3)} {key !== 'VH_VV_ratio' ? 'dB' : ''}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-sans">
                  {key === 'VH'
                    ? 'Cross-pol volume scatter'
                    : key === 'VV'
                    ? 'Co-pol surface bounce'
                    : 'Depolarization canopy ratio'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Multi-Spectral Reflectance Bands */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-semibold mb-3">
          <Sun className="h-3.5 w-3.5" />
          <span>SENTINEL-2 MULTI-SPECTRAL BANDS (10M - 20M REFLECTANCE)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {optical.map((key) => {
            const val = features[key];
            if (val === undefined) return null;
            return (
              <div key={key} className="p-2.5 rounded-lg border border-white/[0.04] bg-surface-secondary/50">
                <div className="text-[10px] font-mono text-slate-400">{key}</div>
                <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
                  {val.toFixed(4)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
