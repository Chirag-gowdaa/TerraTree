import React from 'react';
import { TreePine, Radio, Sun, ShieldAlert, Cpu, Sparkles, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-8">
        <div className="inline-flex items-center space-x-2 rounded-full border border-forest-500/30 bg-forest-950/80 px-3 py-1 text-xs font-mono text-forest-300 mb-4">
          <BookOpen className="h-3.5 w-3.5 text-forest-400" />
          <span>METHODOLOGY & SCIENTIFIC FOUNDATIONS</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
          About TerraTree
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          AI-powered forest intelligence bridging orbital Earth observation, synthetic aperture radar, and botanical ground truth to quantify tropical biodiversity.
        </p>
      </div>

      {/* Section 1: Why Forest Biodiversity Matters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-forest-400">
          <TreePine className="h-6 w-6" />
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            Why Forest Biodiversity Matters
          </h2>
        </div>
        <p className="text-sm text-slate-300 font-sans leading-relaxed">
          Tropical forests harbor more than 50% of terrestrial plant and animal species while acting as planet-scale carbon sinks. However, traditional canopy monitoring relies solely on binary "forest cover" loss indicators, which fail to distinguish a biodiverse, multi-tier virgin rainforest from a monoculture plantation. Species richness and structural diversity determine ecosystem resilience against climate shocks, pathogens, and drought.
        </p>
      </div>

      {/* Section 2: Sensor Fusion - Optical vs Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-xl border-white/[0.08] tech-bracket-container">
          <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-sm mb-3">
            <Sun className="h-5 w-5" />
            <span>Sentinel-2 (Optical Spectroscopy)</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Operates in 13 spectral bands from visible to short-wave infrared (SWIR). Red-edge bands (B5, B6, B7) are especially sensitive to foliar chlorophyll absorption and leaf cellular structure, while SWIR bands (B11, B12) reveal canopy moisture content and lignocellulosic tissue properties across distinct botanical families.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-xl border-white/[0.08] tech-bracket-container">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-sm mb-3">
            <Radio className="h-5 w-5" />
            <span>Sentinel-1 (Synthetic Aperture Radar)</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Active C-band microwave radar penetrates clouds, haze, and upper leaf canopies. Cross-polarized (VH) backscatter measures volume scattering caused by multi-path branch reflections, directly reflecting 3D woody biomass structure that optical sensors cannot penetrate.
          </p>
        </div>

      </div>

      {/* Section 3: Ground Truth Calibration */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-white tracking-wide">
          Ecological Ground Truth Integration
        </h2>
        <p className="text-sm text-slate-300 font-sans leading-relaxed">
          The core innovation of TerraTree is grounding machine learning models in real field surveys rather than simulated synthetic data. In the Kali Tiger Reserve track, models are calibrated using 55 permanent 50×10m vegetation plots comprising 2,485 individually measured and taxonomically verified trees (DBH ≥ 10cm). In the Sundarbans track, models are benchmarked against Global Mangrove Watch (GMW v3) and ESA WorldCover reference labels.
        </p>
      </div>

      {/* Section 4: Inference Pipeline Architecture */}
      <div className="glass-panel p-6 rounded-xl border-white/[0.08]">
        <div className="flex items-center space-x-2 text-forest-400 font-mono font-bold text-sm mb-4">
          <Cpu className="h-5 w-5" />
          <span>The TerraTree Prediction Pipeline</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded bg-surface-secondary border border-white/[0.06]">
            <div className="text-forest-400 font-bold mb-1">01. SENSORS</div>
            <div className="text-slate-300">Sentinel-1/2 multi-temporal composites + cloud masking</div>
          </div>
          <div className="p-3 rounded bg-surface-secondary border border-white/[0.06]">
            <div className="text-forest-400 font-bold mb-1">02. FEATURES</div>
            <div className="text-slate-300">18-20 bands, red-edge indices & SAR polarimetric ratios</div>
          </div>
          <div className="p-3 rounded bg-surface-secondary border border-white/[0.06]">
            <div className="text-forest-400 font-bold mb-1">03. MODELS</div>
            <div className="text-slate-300">Breiman's Random Forest ensembles with balanced class weights</div>
          </div>
          <div className="p-3 rounded bg-surface-secondary border border-white/[0.06]">
            <div className="text-forest-400 font-bold mb-1">04. PROFILE</div>
            <div className="text-slate-300">Dominant family, species richness & Shannon diversity</div>
          </div>
        </div>
      </div>

      {/* Section 5: Mandatory Scientific Limitations Warning */}
      <div className="p-6 rounded-xl border border-emerald-500/30 bg-forest-950/30 space-y-3 tech-bracket-container">
        <div className="flex items-center space-x-2 text-forest-300 font-mono font-bold text-sm">
          <ShieldAlert className="h-5 w-5 text-forest-400" />
          <span>Scientific Disclaimer & Operational Limitations</span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          <strong className="text-white">TerraTree provides model-based estimates and should not be interpreted as a substitute for ecological field surveys.</strong>
        </p>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Satellite-derived estimates capture aggregate canopy reflectance and structure over 10m–20m pixel footprints. Sub-canopy biodiversity, rare endemic shrubs, regeneration saplings, and epiphyte species cannot be directly resolved from orbit. Field surveys conducted by trained botanists remain the gold standard for biodiversity conservation policy.
        </p>
      </div>

    </div>
  );
};
