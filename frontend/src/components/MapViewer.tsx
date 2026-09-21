import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PlotSummary, RegionSummary } from '../types';
import { Layers, MapPin, Eye } from 'lucide-react';

interface MapViewerProps {
  region: RegionSummary;
  boundaryGeoJson?: any;
  plots: PlotSummary[];
  selectedPlotId?: string | null;
  onSelectPlot: (plotId: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  region,
  boundaryGeoJson,
  plots,
  selectedPlotId,
  onSelectPlot,
  onMapClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [basemap, setBasemap] = useState<'dark' | 'satellite'>('dark');

  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const satTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [region.center.lat, region.center.lng],
      zoom: region.default_zoom,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const initialTiles = L.tileLayer(darkTileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = initialTiles;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const url = basemap === 'dark' ? darkTileUrl : satTileUrl;
    const attr = basemap === 'dark'
      ? '&copy; <a href="https://carto.com/">CARTO</a>'
      : '&copy; Esri World Imagery';
    tileLayerRef.current.setUrl(url);
  }, [basemap]);

  // Update Center when Region Changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([region.center.lat, region.center.lng], region.default_zoom, {
      duration: 1.5,
    });
  }, [region]);

  // Render Boundary GeoJSON
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (boundaryLayerRef.current) {
      mapInstanceRef.current.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }

    if (boundaryGeoJson) {
      try {
        const geoLayer = L.geoJSON(boundaryGeoJson, {
          style: {
            color: '#10b981',
            weight: 2,
            opacity: 0.8,
            fillColor: '#059669',
            fillOpacity: 0.12,
            dashArray: '4, 6',
          },
        }).addTo(mapInstanceRef.current);

        boundaryLayerRef.current = geoLayer;
      } catch (err) {
        console.error('Error rendering boundary GeoJSON:', err);
      }
    }
  }, [boundaryGeoJson]);

  // Render Plot Markers
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    plots.forEach((plot) => {
      const isSelected = plot.plot_id === selectedPlotId;

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer ${isSelected ? 'pulse-marker' : ''}">
          <div class="w-4 h-4 rounded-full ${isSelected ? 'bg-forest-400 border-2 border-white' : 'bg-forest-600/80 border border-forest-300/60'} shadow-[0_0_12px_rgba(16,185,129,0.7)] flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-forest-200'}"></div>
          </div>
          ${
            isSelected
              ? `<div class="absolute -bottom-6 whitespace-nowrap px-1.5 py-0.5 rounded bg-surface-elevated/90 border border-forest-500/40 text-[10px] font-mono text-forest-300 font-bold shadow-lg">
                  ${plot.plot_id}
                </div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-plot-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([plot.latitude, plot.longitude], { icon: customIcon });

      const popupContent = `
        <div class="font-sans text-xs p-1">
          <div class="font-mono font-bold text-forest-400 text-sm mb-1">${plot.plot_id}</div>
          <div class="text-slate-300 mb-1">
            <span class="text-slate-400">Coords:</span> ${plot.latitude.toFixed(4)}°N, ${plot.longitude.toFixed(4)}°E
          </div>
          ${
            plot.observed_dominant_family
              ? `<div class="text-slate-300 mb-1">
                  <span class="text-slate-400">Observed:</span> 
                  <span class="font-semibold text-white">${plot.observed_dominant_family}</span>
                </div>`
              : ''
          }
          ${
            plot.observed_species_richness != null
              ? `<div class="text-slate-300">
                  <span class="text-slate-400">Richness:</span> ${plot.observed_species_richness} sp.
                </div>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectPlot(plot.plot_id);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [plots, selectedPlotId]);

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[580px] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl bg-surface">
      
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Retro HUD Overlay - Top Left */}
      <div className="absolute top-3 left-3 z-10 glass-panel px-3 py-2 rounded-lg border-forest-500/30 text-xs font-mono">
        <div className="flex items-center space-x-2 text-forest-400 font-bold">
          <MapPin className="h-3.5 w-3.5" />
          <span>{region.name.toUpperCase()}</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          {plots.length} survey plots mapped • {region.ecosystem_type}
        </div>
      </div>

      {/* Layer Switcher - Top Right */}
      <div className="absolute top-3 right-3 z-10 flex space-x-1 glass-panel p-1 rounded-lg border-white/10 text-xs font-mono">
        <button
          onClick={() => setBasemap('dark')}
          className={`px-2.5 py-1 rounded text-[11px] transition-all ${
            basemap === 'dark'
              ? 'bg-forest-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dark Map
        </button>
        <button
          onClick={() => setBasemap('satellite')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] transition-all ${
            basemap === 'satellite'
              ? 'bg-forest-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="h-3 w-3" />
          <span>Satellite</span>
        </button>
      </div>

      {/* Interactive Helper Hint - Bottom Left */}
      <div className="absolute bottom-3 left-3 z-10 glass-panel px-3 py-1.5 rounded-lg border-white/10 text-[11px] font-mono text-slate-300 flex items-center space-x-2">
        <Eye className="h-3.5 w-3.5 text-forest-400" />
        <span>Click any plot marker or map coordinate to target</span>
      </div>

    </div>
  );
};
