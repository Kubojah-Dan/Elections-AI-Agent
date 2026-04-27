import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Expanded mock polling stations for demonstration
const MOCK_STATIONS = [
  { id: 1, state: 'Delhi', name: "Primary School Booth #12", position: { lat: 28.6139, lng: 77.2090 }, address: "New Delhi, Delhi 110001" },
  { id: 2, state: 'Maharashtra', name: "Mumbai Central High School", position: { lat: 19.0760, lng: 72.8777 }, address: "Mumbai, Maharashtra 400001" },
  { id: 3, state: 'Karnataka', name: "Bangalore Civic Center", position: { lat: 12.9716, lng: 77.5946 }, address: "Bengaluru, Karnataka 560001" },
  { id: 4, state: 'Tamil Nadu', name: "Chennai Port Trust School", position: { lat: 13.0827, lng: 80.2707 }, address: "Chennai, Tamil Nadu 600001" },
  { id: 5, state: 'West Bengal', name: "Kolkata City Hall Booth", position: { lat: 22.5726, lng: 88.3639 }, address: "Kolkata, West Bengal 700001" },
  { id: 6, state: 'Uttar Pradesh', name: "Lucknow Vidhan Sabha Booth", position: { lat: 26.8467, lng: 80.9462 }, address: "Lucknow, UP 226001" },
];

const STATE_CENTERS = {
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Maharashtra': { lat: 19.0760, lng: 72.8777 },
  'Karnataka': { lat: 12.9716, lng: 77.5946 },
  'Tamil Nadu': { lat: 13.0827, lng: 80.2707 },
  'West Bengal': { lat: 22.5726, lng: 88.3639 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
};

export default function PollingMap({ selectedState = 'Delhi' }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);

  // Filter stations based on state
  const filteredStations = MOCK_STATIONS.filter(s => s.state === selectedState);
  const center = STATE_CENTERS[selectedState] || STATE_CENTERS['Delhi'];

  // Pan to center when state changes
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [selectedState, map]);

  if (!isLoaded) return <div className="h-[400px] bg-light-gray animate-pulse rounded-2xl flex items-center justify-center">Loading Map...</div>;

  return (
    <div className="rounded-2xl overflow-hidden border border-light-gray shadow-inner">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={map => setMap(map)}
      >
        {filteredStations.map(station => (
          <Marker 
            key={station.id}
            position={station.position}
            onClick={() => setSelected(station)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={selected.position}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-2">
              <h4 className="font-bold text-india-navy text-sm">{selected.name}</h4>
              <p className="text-xs text-mid-gray mt-1">{selected.address}</p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selected.position.lat},${selected.position.lng}`, '_blank')}
                className="mt-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider"
              >
                Get Directions ↗
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
