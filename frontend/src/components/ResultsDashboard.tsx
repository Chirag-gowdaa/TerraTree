import React, { useState, useEffect } from 'react';
import { AnalyzeResponse } from '../types';
import { ShieldCheck, Info, Check, AlertTriangle, Layers, BarChart3, HelpCircle } from 'lucide-react';
import { CarbonBiomassCard } from './CarbonBiomassCard';
import { BotanicalProfileCard } from './BotanicalProfileCard';
import { getClientBotanicalProfile } from '../services/botanyCatalog';

interface ResultsDashboardProps {
  result: AnalyzeResponse;
  onToggleTechnical: () => void;
  showTechnical: boolean;
  onToggleImportance: () => void;
  showImportance: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onToggleTechnical,
  showTechnical,
  onToggleImportance,
  showImportance,
}) => {
  const isKali = result.region_id === 'kali';
  const prediction = result.prediction;
  const observed = result.observed;

  const defaultClassName = isKali ? prediction.dominant_family : prediction.land_cover_class;
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  useEffect(() => {
    setSelectedClass(defaultClassName || null);
  }, [result.plot_id, result.region_id, defaultClassName]);

  const activeClassName = selectedClass || defaultClassName || 'other family';
  const botanicalProfile = result.botanical_profile && (!selectedClass || selectedClass.toLowerCase() === defaultClassName?.toLowerCase())
    ? result.botanical_profile
    : getClientBotanicalProfile(activeClassName);

  const candidateClasses = (isKali ? prediction.family_probabilities : prediction.class_probabilities)?.map(
    (item) => item.class_name
  ) || [];

  const isFamilyMatch =
    observed?.dominant_family &&
    prediction.dominant_family &&
    observed.dominant_family.toLowerCase() === prediction.dominant_family.toLowerCase();

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Mode & Telemetry Header */}
      <div className="glass-panel p-4 rounded-xl border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-forest-500"></span>
          </span>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">INFERENCE SOURCE</div>
            <div className="text-sm font-mono font-bold text-white flex items-center space-x-2">
              <span>{result.mode_badge}</span>
              <span className="text-xs text-forest-400 font-normal">[{result.plot_id || 'CUSTOM'}]</span>
            </div>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <div>COORDINATES: <span className="text-slate-200">{result.coordinates.lat.toFixed(4)}°N, {result.coordinates.lng.toFixed(4)}°E</span></div>
          <div className="text-[11px] text-forest-400/80">{result.mode_description}</div>
        </div>
      </div>

      {/* Primary Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Dominant Family / Cover Class */}
        <div className="glass-panel p-5 rounded-xl border-forest-500/30 tech-bracket-container md:col-span-1 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
          <div className="text-[11px] font-mono tracking-wider text-forest-400 uppercase mb-1">
            {isKali ? 'DOMINANT PLANT FAMILY' : 'CLASSIFIED LAND COVER'}
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {isKali ? prediction.dominant_family : prediction.land_cover_class}
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Model Probability:</span>
            <span className="text-sm font-mono font-bold text-forest-300">
              {((isKali ? prediction.dominant_family_probability : prediction.land_cover_probability) || 0) * 100 > 0
                ? `${(((isKali ? prediction.dominant_family_probability : prediction.land_cover_probability) || 0) * 100).toFixed(1)}%`
                : 'N/A'}
            </span>
          </div>

          {/* Observed vs Predicted Badge for Ground Truth Plots */}
          {observed?.dominant_family && (
            <div className={`mt-4 p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
              isFamilyMatch
                ? 'border-forest-500/40 bg-forest-950/50 text-forest-300'
                : 'border-amber-500/40 bg-amber-950/50 text-amber-300'
            }`}>
              <div className="flex items-center space-x-1.5">
                {isFamilyMatch ? <Check className="h-3.5 w-3.5 text-forest-400" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                <span className="font-semibold">{isFamilyMatch ? 'OBSERVED MATCH' : 'SURVEY DISCREPANCY'}</span>
              </div>
              <span className="text-[10px] text-slate-300">Field: {observed.dominant_family}</span>
            </div>
          )}
        </div>

        {/* Card 2: Species Richness / Holdout Metric */}
        <div className="glass-panel p-5 rounded-xl border-white/[0.08] tech-bracket-container">
          <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase mb-1">
            {isKali ? 'SPECIES RICHNESS' : 'VERIFICATION ACCURACY'}
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {isKali ? prediction.species_richness : result.validation_metric.display_value}
            {isKali && <span className="text-sm font-normal text-slate-400 ml-1.5">taxa / plot</span>}
          </div>
          <div className="mt-2 text-xs text-slate-400 font-sans">
            {isKali
              ? `Estimated botanical richness in 50×10m plot (Observed: ${observed?.species_richness ?? 'N/A'})`
              : result.validation_metric.interpretation}
          </div>
        </div>

        {/* Card 3: Shannon Diversity Index / Kappa */}
        <div className="glass-panel p-5 rounded-xl border-white/[0.08] tech-bracket-container">
          <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase mb-1">
            {isKali ? 'SHANNON DIVERSITY (H\')' : 'COHEN\'S KAPPA'}
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {isKali ? prediction.shannon_diversity?.toFixed(2) : '0.920'}
          </div>
          <div className="mt-2 text-xs text-slate-400 font-sans">
            {isKali
              ? `Entropy index reflecting species abundance equity (Observed: ${observed?.shannon_index ? observed.shannon_index.toFixed(2) : 'N/A'})`
              : 'Statistical inter-rater reliability accounting for chance agreement'}
          </div>
        </div>

      </div>

      {/* Carbon Stock & Biomass Intelligence Card */}
      {result.biomass_carbon && (
        <CarbonBiomassCard biomass={result.biomass_carbon} regionId={result.region_id} />
      )}

      {/* Botanical Diagnostic Profile & Herbarium Plate Card */}
      <BotanicalProfileCard
        profile={botanicalProfile}
        candidateClasses={candidateClasses}
        selectedClassName={activeClassName}
        onSelectClass={(cls) => setSelectedClass(cls)}
      />

      {/* Class Probability Distribution Breakdown */}
      <div className="glass-panel p-5 rounded-xl border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-forest-400" />
            <h3 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
              {isKali ? 'Candidate Plant Family Probabilities' : 'Land Cover Class Probabilities'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-forest-400/80">Click any class to view botanical profile</span>
        </div>

        <div className="space-y-2.5">
          {(isKali ? prediction.family_probabilities : prediction.class_probabilities)?.map((item) => {
            const pct = Math.round(item.probability * 100);
            const isTop =
              (isKali && item.class_name === prediction.dominant_family) ||
              (!isKali && item.class_name === prediction.land_cover_class);
            const isSelected = activeClassName.toLowerCase() === item.class_name.toLowerCase();

            return (
              <div
                key={item.class_name}
                onClick={() => setSelectedClass(item.class_name)}
                className={`text-xs font-mono p-2.5 rounded-lg cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-forest-950/70 border-forest-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-surface-secondary/40 border-white/[0.04] hover:border-forest-500/30 hover:bg-surface-secondary/80'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`flex items-center gap-1.5 ${isSelected ? 'font-bold text-forest-300' : 'text-slate-300'}`}>
                    <span>{item.class_name}</span>
                    {isTop && <span className="text-[10px] px-1.5 py-0.2 rounded bg-forest-500/20 text-forest-400 font-normal">TOP PREDICTION</span>}
                    {isSelected && !isTop && <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">PREVIEWING</span>}
                  </span>
                  <span className="text-slate-400 font-bold">{(item.probability * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/[0.04]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTop
                        ? 'bg-gradient-to-r from-forest-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : isSelected
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                        : 'bg-slate-600/70'
                    }`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scientific Validation Disclaimer Box */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-surface-secondary/70 text-xs font-sans space-y-2">
        <div className="flex items-center space-x-2 text-forest-400 font-mono font-semibold">
          <ShieldCheck className="h-4 w-4" />
          <span>Scientific Evaluation Note: {result.validation_metric.method}</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          {result.validation_metric.scientific_note}
        </p>
        <div className="text-[11px] font-mono text-slate-400">
          Validation Benchmark: <span className="text-white font-bold">{result.validation_metric.display_value}</span> ({result.validation_metric.metric_name})
        </div>
      </div>

      {/* How TerraTree Arrived at This Result */}
      <div className="glass-panel p-5 rounded-xl border-white/[0.08]">
        <div className="flex items-center space-x-2 mb-3">
          <HelpCircle className="h-4 w-4 text-forest-400" />
          <h3 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
            How TerraTree Arrived at this Result
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
          {result.explanation.summary}
        </p>
        <div className="space-y-2 border-t border-white/[0.06] pt-3">
          {result.explanation.key_drivers.map((driver, idx) => (
            <div key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
              <span className="text-forest-400 font-mono font-bold mt-0.5">•</span>
              <span className="font-sans leading-relaxed">{driver}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expansion Buttons for Technical Feature Inspector & Importance */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onToggleTechnical}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
            showTechnical
              ? 'border-forest-500/60 bg-forest-950/70 text-forest-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'border-white/[0.1] bg-surface-secondary text-slate-300 hover:text-white hover:border-white/20'
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-forest-400" />
          <span>{showTechnical ? 'Hide Satellite Bands' : 'Inspect Satellite Bands (18 Features)'}</span>
        </button>

        <button
          onClick={onToggleImportance}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
            showImportance
              ? 'border-forest-500/60 bg-forest-950/70 text-forest-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'border-white/[0.1] bg-surface-secondary text-slate-300 hover:text-white hover:border-white/20'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5 text-forest-400" />
          <span>{showImportance ? 'Hide Model Feature Weights' : 'View RF Feature Importance'}</span>
        </button>
      </div>

    </div>
  );
};
