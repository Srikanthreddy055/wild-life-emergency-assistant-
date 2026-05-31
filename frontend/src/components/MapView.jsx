'use client';

import React, { useEffect, useRef } from 'react';

export default function MapView({ 
  height = '350px', 
  center = [34.0522, -118.2437], 
  zoom = 11, 
  markers = [], 
  selectable = false,
  onSelectCoords 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const activeMarkersRef = useRef([]);

  useEffect(() => {
    // Only initialize in client-side environments
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Load Leaflet libraries dynamically if not already loaded globally
    const initMap = () => {
      if (mapInstanceRef.current) return;

      const L = window.L;
      if (!L) return;

      mapInstanceRef.current = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO'
      }).addTo(mapInstanceRef.current);

      if (selectable) {
        const pickerMarker = L.marker(center, { draggable: true }).addTo(mapInstanceRef.current);
        
        pickerMarker.on('dragend', () => {
          const pos = pickerMarker.getLatLng();
          if (onSelectCoords) onSelectCoords(pos.lat, pos.lng);
        });

        mapInstanceRef.current.on('click', (e) => {
          pickerMarker.setLatLng(e.latlng);
          if (onSelectCoords) onSelectCoords(e.latlng.lat, e.latlng.lng);
        });
      }
    };

    if (window.L) {
      initMap();
    } else {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup map instance on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers when data changes
  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    // Remove old active markers
    activeMarkersRef.current.forEach(m => map.removeLayer(m));
    activeMarkersRef.current = [];

    // Plot new markers
    markers.forEach(mark => {
      const pin = L.circleMarker([mark.lat, mark.lng], {
        radius: mark.critical ? 12 : 8,
        fillColor: mark.color || '#10b981',
        color: '#fff',
        weight: 1.5,
        fillOpacity: 0.8
      }).addTo(map);

      if (mark.popup) {
        pin.bindPopup(`<div style="color:#000;font-size:11px;">${mark.popup}</div>`);
      }

      activeMarkersRef.current.push(pin);
    });
  }, [markers]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full rounded-2xl border border-white/10 overflow-hidden relative z-10 bg-navy-dark"
      style={{ height }}
    />
  );
}
