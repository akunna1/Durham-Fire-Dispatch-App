"use client";

import { MapContainer, TileLayer, Marker, CircleMarker } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const center: [number, number] = [35.994, -78.898];

export default function CADMap({ isRunning }: { isRunning: boolean }) {
  const [stations, setStations] = useState<any>(null);
  const [incidents, setIncidents] = useState<any>(null); // Fire incidents state
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // currently active fire incident index
  const [mounted, setMounted] = useState(false); // ensures client-only rendering

  useEffect(() => {
    setMounted(true); // mark component as mounted

    // Fetch Fire Stations GeoJSON
    fetch("/geojson/Fire_Stations.geojson")
      .then((res) => res.json())
      .then(setStations);

    // Fetch Fire Incidents GeoJSON
    fetch("/geojson/Fire_Incidents.geojson")
      .then((res) => res.json())
      .then(setIncidents);
  }, []);

  // CAD loop - show one incident at a time every 4 seconds
  useEffect(() => {
    if (!isRunning || !incidents) {
      setActiveIndex(null); // reset if CAD is stopped
      return;
    }

    let index = 0;
    setActiveIndex(index); // show first incident

    const interval = setInterval(() => {
      index++;
      if (index >= incidents.features.length) {
        index = 0; // loop back to first incident
      }
      setActiveIndex(index);
    }, 4000); // 4 seconds per incident

    // CLEANUP: stop interval when CAD stops
    return () => clearInterval(interval);
  }, [isRunning, incidents]);

  const createStationIcon = (stationNumber: string) =>
    L.divIcon({
      className: "", // removes default Leaflet styles
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      html: `<div style="
        background:red;
        color:white;
        border-radius:50%;
        width:24px;
        height:24px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:12px;
        font-weight:bold;
      ">${stationNumber}</div>`,
    });

  if (!mounted) return null; // prevents server/client mismatch

  return (
    <MapContainer
      {...({} as any)} // spreads empty object as props to bypass TS errors
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      {/* Fire Stations */}
      {stations &&
        stations.features.map((f: any, i: number) => {
          const [lon, lat] = f.geometry.coordinates;
          const num = f.properties.Station.replace("Station ", "");
          return (
            <Marker
              key={i}
              position={[lat, lon]}
              icon={createStationIcon(num)}
            />
          );
        })}

      {/* Active Fire Incident */}
      {isRunning && incidents && activeIndex !== null && (() => {
        const f = incidents.features[activeIndex];
        const [lon, lat] = f.geometry.coordinates;
        return (
          <CircleMarker
            center={[lat, lon]}
            radius={5}
            pathOptions={{
              color: "#000080",     // Navy blue
              fillColor: "#000080",
              fillOpacity: 1,
            }}
          />
        );
      })()}
    </MapContainer>
  );
}
