import React from 'react';
import { Compass, Cpu, Info, ShieldCheck, TreePine, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'analyze' | 'models' | 'about';
  setActiveTab: (tab: 'explore' | 'analyze' | 'models' | 'about') => void;
  selectedRegionId: string;
  telemetryCoords?: { lat: number; lng: number };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRegionId,
  telemetryCoords,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#06090d]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-forest-900/60 border border-forest-500/30 text-forest-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <TreePine className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold tracking-widest text-lg text-white">TERRATREE</span>
              <span className="rounded border border-forest-500/30 bg-forest-950/80 px-1.5 py-0.5 text-[10px] font-mono font-medium text-forest-400 tracking-wider">
                V2.0-RF
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              AI Forest Intelligence
            </p>
          </div>
        </div>

        {/* Telemetry Indicator (Center HUD) */}
        <div className="hidden md:flex items-center space-x-4 px-3 py-1 rounded-full border border-white/[0.05] bg-surface-secondary/60 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-1.5 text-forest-400">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-[11px] font-medium tracking-wider">SYSTEM ONLINE</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-slate-300">
            REGION: <span className="text-forest-300 font-semibold">{selectedRegionId.toUpperCase()}</span>
          </span>
          {telemetryCoords && (
            <>
              <span className="text-white/20">|</span>
              <span className="text-slate-400">
                {telemetryCoords.lat.toFixed(4)}°N, {telemetryCoords.lng.toFixed(4)}°E
              </span>
            </>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'explore'
                ? 'bg-forest-500/10 text-forest-300 border border-forest-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'analyze'
                ? 'bg-forest-500/10 text-forest-300 border border-forest-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Analyze</span>
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'models'
                ? 'bg-forest-500/10 text-forest-300 border border-forest-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Models</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'about'
                ? 'bg-forest-500/10 text-forest-300 border border-forest-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            <span>About</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
