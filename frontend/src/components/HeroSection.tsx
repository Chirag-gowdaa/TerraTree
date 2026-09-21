import React from 'react';
import { ArrowRight, Globe, Layers, Sparkles, Database, Shield } from 'lucide-react';

interface HeroSectionProps {
  onSelectRegion: (regionId: string) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectRegion,
  onExploreClick,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#06090d] py-16 sm:py-24">
      {/* Background Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-forest-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-forest-500/30 bg-forest-950/80 px-3.5 py-1 text-xs font-mono text-forest-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-6">
          <Sparkles className="h-3.5 w-3.5 text-forest-400" />
          <span>EARTH OBSERVATION FUSED WITH BOTANICAL GROUND TRUTH</span>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            See the forest. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-300 via-forest-400 to-emerald-200">
              Beyond what satellites show.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
            TerraTree merges Sentinel-1 C-band synthetic aperture radar, Sentinel-2 multi-spectral red-edge imaging, and in-situ field survey plots to predict dominant plant families, species richness, and Shannon diversity across endangered ecosystems.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <button
            onClick={() => {
              onSelectRegion('kali');
              onExploreClick();
            }}
            className="flex items-center space-x-2 rounded-lg bg-forest-600 px-5 py-3 text-sm font-mono font-medium text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-forest-500 transition-all cursor-pointer"
          >
            <span>Explore Kali Tiger Reserve</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              onSelectRegion('sundarbans');
              onExploreClick();
            }}
            className="flex items-center space-x-2 rounded-lg border border-forest-500/40 bg-surface px-5 py-3 text-sm font-mono font-medium text-forest-300 hover:bg-forest-950/60 transition-all cursor-pointer"
          >
            <span>Sundarbans Blue Carbon</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Telemetry Feature Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-panel p-4 rounded-lg tech-bracket-container border-forest-500/20">
            <div className="flex items-center justify-between text-forest-400 mb-2">
              <Database className="h-4 w-4" />
              <span className="text-[10px] font-mono text-slate-400">GROUND PLOTS</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">55 Field Plots</div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              2,485 individually enumerated trees from permanent 50×10m Western Ghats vegetation plots.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-lg tech-bracket-container border-forest-500/20">
            <div className="flex items-center justify-between text-forest-400 mb-2">
              <Layers className="h-4 w-4" />
              <span className="text-[10px] font-mono text-slate-400">FEATURE STACK</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">20 Dual Sensors</div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Sentinel-2 Red-Edge & SWIR bands fused with Sentinel-1 SAR polarimetric volume backscatter.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-lg tech-bracket-container border-forest-500/20">
            <div className="flex items-center justify-between text-forest-400 mb-2">
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-mono text-slate-400">TARGET OUTPUTS</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">Biodiversity & Cover</div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Predicts Dominant Botanical Family, Species Richness, and Shannon Index ($H'$).
            </p>
          </div>

          <div className="glass-panel p-4 rounded-lg tech-bracket-container border-forest-500/20">
            <div className="flex items-center justify-between text-forest-400 mb-2">
              <Shield className="h-4 w-4" />
              <span className="text-[10px] font-mono text-slate-400">SCIENTIFIC RIGOR</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">Honest LOOCV</div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Leave-One-Out cross-validation metrics displayed without inflated or simulated claims.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
