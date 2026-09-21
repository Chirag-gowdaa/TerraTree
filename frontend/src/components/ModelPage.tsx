import React, { useEffect, useState } from 'react';
import { fetchModelInfo } from '../services/api';
import { TechnicalModelDetails } from '../types';
import { Cpu, ShieldCheck, Database, Layers, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const ModelPage: React.FC = () => {
  const [models, setModels] = useState<Record<string, TechnicalModelDetails> | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<'kali' | 'sundarbans'>('kali');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelInfo()
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-slate-400">
        <Cpu className="h-8 w-8 animate-spin mx-auto text-forest-400 mb-3" />
        <div>RETRIEVING SCIENTIFIC MODEL REGISTRY...</div>
      </div>
    );
  }

  const activeModel = models ? models[selectedTrack] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 rounded-full border border-forest-500/30 bg-forest-950/80 px-3 py-1 text-xs font-mono text-forest-300 mb-3">
          <ShieldCheck className="h-3.5 w-3.5 text-forest-400" />
          <span>SCIENTIFIC SPECIFICATIONS & AUDIT DISCLOSURE</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Machine Learning Model Architecture
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl font-sans leading-relaxed">
          Comprehensive technical parameters, training datasets, hyperparameter configurations, and validation benchmarks of the scikit-learn models serialized in the TerraTree repository.
        </p>
      </div>

      {/* Track Selector */}
      <div className="flex space-x-3 border-b border-white/[0.08] pb-4">
        <button
          onClick={() => setSelectedTrack('kali')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            selectedTrack === 'kali'
              ? 'bg-forest-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'text-slate-400 hover:text-white bg-surface-secondary'
          }`}
        >
          <span>Kali Tiger Reserve (Botanical Ground Truth)</span>
        </button>

        <button
          onClick={() => setSelectedTrack('sundarbans')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            selectedTrack === 'sundarbans'
              ? 'bg-forest-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'text-slate-400 hover:text-white bg-surface-secondary'
          }`}
        >
          <span>Sundarbans Biosphere (GMW Mangrove Reference)</span>
        </button>
      </div>

      {activeModel && (
        <div className="space-y-8">
          
          {/* Top Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel p-5 rounded-xl border-white/[0.08] tech-bracket-container">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">MODEL ENSEMBLE</div>
              <div className="text-lg font-mono font-bold text-white leading-tight">
                {activeModel.model_family.split('(')[0]}
              </div>
              <div className="text-xs text-forest-400 font-mono mt-2">Scikit-Learn Random Forest</div>
            </div>

            <div className="glass-panel p-5 rounded-xl border-white/[0.08] tech-bracket-container">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">TRAINING DATA UNITS</div>
              <div className="text-2xl font-mono font-bold text-white">
                {activeModel.total_training_units} {selectedTrack === 'kali' ? 'Plots' : 'Samples'}
              </div>
              <div className="text-xs text-slate-400 font-sans mt-1">
                {selectedTrack === 'kali' ? '2,485 Field Surveyed Trees' : 'Stratified Reference Points'}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl border-white/[0.08] tech-bracket-container">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">INPUT DIMENSIONALITY</div>
              <div className="text-2xl font-mono font-bold text-white">
                {activeModel.feature_count} Features
              </div>
              <div className="text-xs text-slate-400 font-sans mt-1">
                Optical + Red-Edge + SAR C-band
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl border-forest-500/30 tech-bracket-container">
              <div className="text-[10px] font-mono text-forest-400 uppercase mb-1">VALIDATION BENCHMARK</div>
              <div className="text-2xl font-mono font-bold text-emerald-300">
                {activeModel.validation_metric_display}
              </div>
              <div className="text-xs text-slate-400 font-sans mt-1">
                {activeModel.validation_methodology}
              </div>
            </div>

          </div>

          {/* Detailed Estimator Breakdown */}
          <div className="glass-panel p-6 rounded-xl border-white/[0.08]">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-forest-400" />
              <span>Serialized Estimator Objects</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(activeModel.estimators).map(([key, config]) => (
                <div key={key} className="p-3 rounded-lg bg-surface-secondary border border-white/[0.06] font-mono text-xs">
                  <div className="text-forest-300 font-bold mb-1">{key}</div>
                  <div className="text-slate-300 overflow-x-auto p-2 bg-[#06090d] rounded border border-white/[0.04]">
                    <code>{config}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Provenance & Target Variables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="glass-panel p-6 rounded-xl border-white/[0.08]">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Database className="h-4 w-4 text-forest-400" />
                <span>Training Dataset Provenance</span>
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeModel.training_data_source}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border-white/[0.08]">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Layers className="h-4 w-4 text-forest-400" />
                <span>Target Variables</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                {activeModel.target_variables.map((v, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-forest-400 shrink-0 mt-0.5" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Full Feature Schema */}
          <div className="glass-panel p-6 rounded-xl border-white/[0.08]">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Layers className="h-4 w-4 text-forest-400" />
              <span>Full Input Feature Schema ({activeModel.feature_count} Channels)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeModel.feature_list.map((feat) => (
                <span
                  key={feat}
                  className="px-2.5 py-1 rounded bg-surface-secondary border border-white/[0.06] text-xs font-mono text-slate-200"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Scientific Limitations & Guardrails */}
          <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Scientific Limitations & Honest Caveats</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
              {activeModel.limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-400 font-mono font-bold">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};
