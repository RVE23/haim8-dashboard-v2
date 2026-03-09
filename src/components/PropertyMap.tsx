'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Director } from '@/lib/data';

// Fix Leaflet marker icon issue
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const REGION_COORDS: Record<string, [number, number]> = {
    'London': [51.5074, -0.1278],
    'South East': [51.25, 0.5],
    'South West': [50.75, -3.5],
    'East of England': [52.2, 0.5],
    'West Midlands': [52.48, -1.89],
    'East Midlands': [52.95, -1.13],
    'North West': [53.48, -2.24],
    'Yorkshire': [53.8, -1.5],
    'North East': [54.97, -1.61],
    'Scotland': [56.49, -4.2],
    'Wales': [52.13, -3.78],
    'Northern Ireland': [54.6, -6.6],
};

interface PropertyMapProps {
    directors: Director[];
}

function MapUpdater({ directors }: { directors: Director[] }) {
    const map = useMap();
    useEffect(() => {
        if (directors.length > 0) {
            const bounds = L.latLngBounds(directors.map(d => {
                const coords = REGION_COORDS[d.region] || REGION_COORDS['London'];
                return L.latLng(coords[0], coords[1]);
            }));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [directors, map]);
    return null;
}

export default function PropertyMap({ directors }: PropertyMapProps) {
    // Simple jitter to avoid overlapping markers in the same region
    const getJitteredCoords = (region: string, index: number): [number, number] => {
        const base = REGION_COORDS[region] || REGION_COORDS['London'];
        const jitterFactor = 0.05;
        const offsetX = (Math.sin(index) * jitterFactor);
        const offsetY = (Math.cos(index) * jitterFactor);
        return [base[0] + offsetX, base[1] + offsetY];
    };

    return (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <MapContainer
                center={[54.5, -3.5]}
                zoom={6}
                scrollWheelZoom={true}
                className="h-full w-full grayscale contrast-125 invert-[0.9] hue-rotate-180" // Dark mode map hack
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {directors.map((d, i) => {
                    const coords = getJitteredCoords(d.region, i);
                    return (
                        <Marker key={d.id} position={coords}>
                            <Popup className="custom-popup">
                                <div className="p-2 min-w-[200px] bg-slate-900 text-white rounded-lg">
                                    <h4 className="font-bold text-sm mb-1">{d.name}</h4>
                                    <p className="text-xs text-slate-400 mb-2 truncate">{d.company_name}</p>
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                        <span className={d.phone || d.email ? 'text-emerald-400' : 'text-slate-500'}>
                                            {d.phone || d.email ? 'Fully Enriched' : 'Enrichment Pending'}
                                        </span>
                                        <span className="text-blue-400">{d.region}</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
                <MapUpdater directors={directors} />
            </MapContainer>

            <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .leaflet-container {
          background: #020617 !important;
        }
      `}</style>
        </div>
    );
}
