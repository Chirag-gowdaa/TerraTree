import React from 'react';
import { FeatureImportanceItem } from '../types';
import { BarChart3, HelpCircle } from 'lucide-react';

interface FeatureImportanceProps {
  importances: FeatureImportanceItem[];
  regionId: string;
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ importances, regionId }) => {
  const maxImportance = Math.max(...importances.map((i) => i.importance), 0.01);

  return (
    <div className="glass-panel p-6 rounded-xl border-white/[0.08] tech-bracket-container animate-fadeIn space-y-5">
      
      <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-forest-400 uppercase">
            SCIKIT-LEARN GINI IMPORTANCE WEIGHTS
          </span>
          <h3 className="text-base font-mono font-bold text-white mt-0.5">
            Which Satellite Signals Matter Most?
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Source: Random Forest Classifier
        </span>
      </div>

      <p className="text-xs text-slate-300 font-sans leading-relaxed">
        These weights represent the true impurity-based feature importances (<code className="text-forest-400">feature_importances_</code>) computed across all decision trees in the trained ensemble. No values are simulated or approximated.
      </p>

      <div className="space-y-3.5 pt-1">
        {importances.map((item, idx) => {
          const pctOfMax = (item.importance / maxImportance) * 100;
          return (
            <div key={item.feature} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="text-forest-400 font-bold w-5">{idx + 1}.</span>
                  <span className="text-white font-bold text-sm">{item.feature}</span>
                  <span className="rounded bg-surface-elevated px-2 py-0.5 text-[10px] text-slate-300 border border-white/[0.06]">
                    {item.category}
                  </span>
                </div>
                <div className="text-slate-200 font-bold">
                  {(item.importance * 100).toFixed(2)}%
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden border border-white/[0.04]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forest-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-700"
                  style={{ width: `${pctOfMax}%` }}
                ></div>
              </div>

              {/* Physical description */}
              <div className="text-[11px] text-slate-400 font-sans pl-7">
                {item.description}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-lg border border-white/[0.06] bg-surface-secondary/50 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Model Evaluation Track: {regionId.toUpperCase()}</span>
        <span>Algorithm: Breiman's Random Forest</span>
      </div>

    </div>
  );
};
