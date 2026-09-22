import React, { useState } from 'react';
import { CarbonBiomassEstimate } from '../types';
import { Leaf, DollarSign, CloudRain, Cpu, ChevronDown, ChevronUp, ShieldAlert, Award } from 'lucide-react';

interface CarbonBiomassCardProps {
  biomass: CarbonBiomassEstimate;
  regionId: string;
}

export const CarbonBiomassCard: React.FC<CarbonBiomassCardProps> = ({ biomass, regionId }) => {
  const [showFormula, setShowFormula] = useState(false);
  const isMangrove = regionId === 'sundarbans';

  // Gauge percentage (max ~320 Mg/ha for tropical climax)
  const agbPct = Math.min(100, Math.max(5, Math.round((biomass.aboveground_biomass_mgha / 300) * 100)));

  return (
    <div className="glass-panel p-5 rounded-xl border-emerald-500/20 tech-bracket-container shadow-[0_0_25px_rgba(16,185,129,0.06)] relative overflow-hidden">
      
      {/* Background radial gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-white/[0.06] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <span>{isMangrove ? 'Blue Carbon & Biomass Intelligence' : 'Forest Carbon Stock & Biomass Estimator'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono">
                ESG / VCM
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              {biomass.biomass_category}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400/90 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/20">
          <Award className="h-3.5 w-3.5 text-emerald-400" />
          <span>{biomass.ipcc_tier_alignment}</span>
        </div>
      </div>

      {/* 4-Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        
        {/* Metric 1: Aboveground Biomass */}
        <div className="p-3.5 rounded-lg bg-surface-secondary/80 border border-white/[0.06]">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            ABOVEGROUND BIOMASS (AGB)
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            {biomass.aboveground_biomass_mgha.toFixed(1)}
            <span className="text-xs font-normal text-emerald-400 ml-1">Mg/ha</span>
          </div>
          
          {/* Gauge Bar */}
          <div className="mt-2 w-full h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              style={{ width: `${agbPct}%` }}
            ></div>
          </div>
          <div className="mt-1 text-[10px] text-slate-400 flex justify-between font-mono">
            <span>Root (BGB): {biomass.belowground_biomass_mgha.toFixed(1)}</span>
            <span>Total: {biomass.total_biomass_mgha.toFixed(1)}</span>
          </div>
        </div>

        {/* Metric 2: Elemental Carbon Stock */}
        <div className="p-3.5 rounded-lg bg-surface-secondary/80 border border-white/[0.06]">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            CARBON STOCK DENSITY
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-300">
            {biomass.carbon_stock_tcha.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-1">tC / ha</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-sans">
            Elemental carbon store in woody stems, branches, and root biomass.
          </div>
        </div>

        {/* Metric 3: Sequestered CO2 Equivalent */}
        <div className="p-3.5 rounded-lg bg-surface-secondary/80 border border-white/[0.06]">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            SEQUESTERED CO₂ EQUIV
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300">
            {biomass.co2_equivalent_tco2eha.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-1">tCO₂e / ha</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-sans">
            Equivalent atmospheric CO₂ locked inside this canopy stand.
          </div>
        </div>

        {/* Metric 4: Carbon Credit Market Valuation */}
        <div className="p-3.5 rounded-lg bg-gradient-to-br from-emerald-950/40 to-surface-secondary/90 border border-emerald-500/30">
          <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>EST. VCM VALUATION</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            ${biomass.vcm_valuation_usdha.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            <span className="text-xs font-normal text-emerald-400 ml-1">/ ha</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-sans">
            Voluntary Carbon Market standard credit index ($18.50 - $24.00/tCO₂e).
          </div>
        </div>

      </div>

      {/* Multi-Sensor Allometric Derivation Telemetry */}
      <div className="p-3 rounded-lg bg-surface-tertiary/60 border border-white/[0.04] text-xs font-mono space-y-1.5">
        <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-forest-400" />
          <span>Orbital Sensor Fusion Drivers:</span>
        </div>
        <div className="text-slate-400 text-[11px] flex items-start gap-2">
          <span className="text-teal-400 font-bold">• Sentinel-1 SAR:</span>
          <span>{biomass.sar_derivation_note}</span>
        </div>
        <div className="text-slate-400 text-[11px] flex items-start gap-2">
          <span className="text-emerald-400 font-bold">• Sentinel-2 MSI:</span>
          <span>{biomass.optical_derivation_note}</span>
        </div>
      </div>

      {/* Expandable Scientific Formula Accordion */}
      <div className="mt-3">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="text-[11px] font-mono text-slate-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
        >
          {showFormula ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          <span>{showFormula ? 'Hide Allometric Formula Details' : 'View Scientific Allometric Formulas (IPCC Tier-2)'}</span>
        </button>

        {showFormula && (
          <div className="mt-2.5 p-3 rounded-lg bg-black/40 border border-white/[0.08] text-[11px] font-mono text-slate-300 space-y-2">
            <div>
              <span className="text-emerald-400 font-bold">1. Aboveground Biomass (AGB): </span>
              <span className="text-slate-200">AGB = a · (σ°_VH)^b · (NDVI)^c</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                SAR cross-polarization backscatter σ°_VH (converted from dB to linear power) measures volume scattering through the 3D woody branch architecture, while optical NDVI scales canopy foliage density.
              </p>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">2. Carbon Stock (tC/ha): </span>
              <span className="text-slate-200">C = (AGB + BGB) × CF</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                Carbon Fraction (CF = 0.475) per IPCC Good Practice Guidance. Belowground Biomass (BGB) estimated via allometric root-to-shoot ratio (R = 0.24 for tropical moist forest, R = 0.38 for mangroves).
              </p>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">3. Atmospheric CO₂ Sequestration: </span>
              <span className="text-slate-200">tCO₂e = Carbon Stock × (44 / 12) = Carbon Stock × 3.667</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
