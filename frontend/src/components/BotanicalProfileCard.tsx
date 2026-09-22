import React, { useState } from 'react';
import { BotanicalDiagnosticProfile } from '../types';
import { Sparkles, Compass, ShieldCheck, TreeDeciduous, Info, ZoomIn, X, Radio } from 'lucide-react';

interface BotanicalProfileCardProps {
  profile: BotanicalDiagnosticProfile;
  candidateClasses?: string[];
  selectedClassName?: string;
  onSelectClass?: (className: string) => void;
}

export const BotanicalProfileCard: React.FC<BotanicalProfileCardProps> = ({
  profile,
  candidateClasses,
  selectedClassName,
  onSelectClass,
}) => {
  const [activeTab, setActiveTab] = useState<'morphology' | 'ecology' | 'timber' | 'radar'>('morphology');
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="glass-panel p-5 rounded-xl border-forest-500/25 tech-bracket-container shadow-[0_0_25px_rgba(16,185,129,0.06)] relative">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/[0.06] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-forest-500/10 border border-forest-500/30 text-forest-400">
            <TreeDeciduous className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-forest-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>BOTANICAL DIAGNOSTICS & SPECIES REFERENCE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">HERBARIUM AUDIT</span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight flex items-center gap-2">
              <span>{profile.family_name}</span>
            </h3>
            <div className="text-xs text-slate-300 font-sans italic">
              {profile.common_name}
            </div>
          </div>
        </div>

        {/* Conservation Status Badge */}
        <div className="flex items-center space-x-2 text-[11px] font-mono px-2.5 py-1 rounded border border-forest-500/30 bg-forest-950/40 text-forest-300">
          <ShieldCheck className="h-3.5 w-3.5 text-forest-400" />
          <span>{profile.conservation_status}</span>
        </div>
      </div>

      {/* Candidate Class Quick-Switcher (Interactive Viva Showcase) */}
      {candidateClasses && candidateClasses.length > 0 && onSelectClass && (
        <div className="mb-4 p-2.5 rounded-lg bg-surface-secondary/70 border border-white/[0.04]">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-forest-400 animate-pulse" />
            <span>Switch Candidate Taxa / View Botanical Profile:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidateClasses.map((cls) => {
              const isSelected = selectedClassName ? selectedClassName.toLowerCase() === cls.toLowerCase() : false;
              return (
                <button
                  key={cls}
                  onClick={() => onSelectClass(cls)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-forest-500 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-surface-tertiary text-slate-400 hover:text-white hover:bg-surface-elevated border border-white/[0.05]'
                  }`}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Botanical Plate & Scientific Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Authentic Botanical Illustration */}
        <div className="lg:col-span-5 flex flex-col">
          <div
            onClick={() => setIsZoomed(true)}
            className="relative group rounded-lg overflow-hidden border border-white/[0.1] bg-black/40 cursor-zoom-in aspect-[4/3] flex items-center justify-center shadow-lg"
          >
            <img
              src={profile.image_url}
              alt={profile.family_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback in case of missing asset
                (e.target as HTMLImageElement).src = '/botany/other_family.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity"></div>
            
            <div className="absolute top-2 right-2 p-1.5 rounded bg-surface-elevated/80 border border-white/[0.1] text-slate-300 group-hover:text-white transition-colors">
              <ZoomIn className="h-3.5 w-3.5" />
            </div>

            <div className="absolute bottom-2 left-2 right-2 text-left">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                CALIBRATED SCIENTIFIC BOTANICAL PLATE
              </div>
              <div className="text-xs font-mono text-slate-200 truncate">
                {profile.representative_taxa[0] || profile.family_name}
              </div>
            </div>
          </div>

          {/* Keystone Taxa Tags */}
          <div className="mt-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              KEYSTONE REPRESENTATIVE SPECIES:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.representative_taxa.map((species, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-secondary border border-forest-500/20 text-slate-300"
                >
                  {species}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Diagnostic Features */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          {/* Tabs Header */}
          <div>
            <div className="flex space-x-1 border-b border-white/[0.08] mb-3 pb-1">
              <button
                onClick={() => setActiveTab('morphology')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  activeTab === 'morphology'
                    ? 'bg-forest-500/20 text-forest-300 font-bold border-b-2 border-forest-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Morphology
              </button>
              <button
                onClick={() => setActiveTab('ecology')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  activeTab === 'ecology'
                    ? 'bg-forest-500/20 text-forest-300 font-bold border-b-2 border-forest-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ecology
              </button>
              <button
                onClick={() => setActiveTab('timber')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  activeTab === 'timber'
                    ? 'bg-forest-500/20 text-forest-300 font-bold border-b-2 border-forest-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Timber & Ethnobotany
              </button>
              <button
                onClick={() => setActiveTab('radar')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  activeTab === 'radar'
                    ? 'bg-forest-500/20 text-forest-300 font-bold border-b-2 border-forest-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Radar Profile
              </button>
            </div>

            {/* Tab Content */}
            <div className="text-xs font-sans text-slate-300 space-y-3 min-h-[140px]">
              
              {activeTab === 'morphology' && (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-surface-secondary/70 border border-white/[0.04]">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-1">
                      🌿 FOLIAGE & LEAF VENATION
                    </div>
                    <p className="leading-relaxed">{profile.leaf_morphology}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-secondary/70 border border-white/[0.04]">
                    <div className="text-[10px] font-mono text-amber-400 uppercase font-bold mb-1">
                      🪵 BARK, RHIZOME & STEM ANATOMY
                    </div>
                    <p className="leading-relaxed">{profile.bark_stem_anatomy}</p>
                  </div>
                </div>
              )}

              {activeTab === 'ecology' && (
                <div className="p-3.5 rounded-lg bg-surface-secondary/70 border border-white/[0.04]">
                  <div className="text-[10px] font-mono text-teal-400 uppercase font-bold mb-1.5 flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-teal-400" />
                    <span>FOREST DYNAMICS & KEYSTONE ROLE</span>
                  </div>
                  <p className="leading-relaxed">{profile.ecological_keystone_role}</p>
                </div>
              )}

              {activeTab === 'timber' && (
                <div className="p-3.5 rounded-lg bg-surface-secondary/70 border border-white/[0.04]">
                  <div className="text-[10px] font-mono text-yellow-400 uppercase font-bold mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                    <span>TIMBER GRAIN, PHARMACOPOEIA & MEDICINAL UTILITY</span>
                  </div>
                  <p className="leading-relaxed">{profile.ethnobotany_timber}</p>
                </div>
              )}

              {activeTab === 'radar' && (
                <div className="p-3.5 rounded-lg bg-surface-secondary/70 border border-white/[0.04]">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1.5 flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-cyan-400" />
                    <span>SENTINEL-1 SAR POLARIMETRIC & SPECTRAL RESPONSE</span>
                  </div>
                  <p className="leading-relaxed">{profile.radar_signature}</p>
                </div>
              )}

            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Taxonomic Reference: Western Ghats Ground Truth Flora</span>
            <span className="text-forest-400">Field-Enumerated DBH ≥ 10cm</span>
          </div>

        </div>

      </div>

      {/* Fullscreen Botanical Plate Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={profile.image_url}
              alt={profile.family_name}
              className="max-h-[80vh] w-auto object-contain rounded-lg border border-white/20 shadow-2xl"
            />
            <div className="mt-3 text-center">
              <div className="text-sm font-mono font-bold text-white">{profile.family_name} ({profile.common_name})</div>
              <div className="text-xs text-slate-400 font-sans">High-Resolution Botanical Reference Plate</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
