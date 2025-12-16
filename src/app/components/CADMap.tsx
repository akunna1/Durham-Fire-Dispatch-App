"use client";

import { MapContainer, TileLayer, Marker, CircleMarker } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
import { FeatureCollection, Point } from "geojson";

/**
 * Fire Station properties
 */
type StationProperties = {
  Station: string;
};

/**
 * Fire Incident properties (empty for now)
 */
type IncidentProperties = {};

const center: [number, number] = [35.994, -78.898];

export default function CADMap({ isRunning }: { isRunning: boolean }) {
  const [stations, setStations] =
    useState<FeatureCollection<Point, StationProperties> | null>(null);

  const [incidents, setIncidents] =
    useState<FeatureCollection<Point, IncidentProperties> | null>(null);

  // Which fire incident is currently active
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Which station is closest to the active incident
  const [activeStationIndex, setActiveStationIndex] =
    useState<number | null>(null);

  const [mounted, setMounted] = useState(false);

  /**
   * Load GeoJSON data
   */
  useEffect(() => {
    setMounted(true);

    fetch("/geojson/Fire_Stations.geojson")
      .then((res) => res.json())
      .then(setStations);

    fetch("/geojson/Fire_Incidents.geojson")
      .then((res) => res.json())
      .then(setIncidents);
  }, []);

  /**
   * CAD loop:
   * - Show one incident every 4 seconds
   * - Find the nearest station for that incident
   */
  useEffect(() => {
    if (!isRunning || !incidents || !stations) {
      setActiveIndex(null);
      setActiveStationIndex(null);
      return;
    }

    let index = 0;
    let timeoutId: NodeJS.Timeout;

    const runStep = () => {
      // Show the fire incident immediately
      setActiveIndex(index);

      // Clear previously highlighted station
      setActiveStationIndex(null);

      const incident = incidents.features[index];
      const incidentPoint = turf.point(
        incident.geometry.coordinates
      );

      // Wait 1 second before dispatching a station
      timeoutId = setTimeout(() => {
        let closestStationIndex = 0;
        let shortestDistance = Infinity;

        stations.features.forEach((station, i) => {
          const stationPoint = turf.point(
            station.geometry.coordinates
          );

          const distance = turf.distance(
            incidentPoint,
            stationPoint,
            { units: "kilometers" }
          );

          if (distance < shortestDistance) {
            shortestDistance = distance;
            closestStationIndex = i;
          }
        });

        // Highlight closest station AFTER 1 second
        setActiveStationIndex(closestStationIndex);
      }, 1000); //

      // Move to next incident
      index++;
      if (index >= incidents.features.length) {
        index = 0;
      }
    };

    // Run immediately, then every 4 seconds
    runStep();
    const interval = setInterval(runStep, 4000);

    // CLEANUP
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [isRunning, incidents, stations]);

  /**
   * Station icon
   * Turns ORANGE if it's the closest station
   */
  const createStationIcon = (
    stationNumber: string,
    isActive: boolean
  ) =>
    L.divIcon({
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      html: `<div style="
        background:${isActive ? "orange" : "red"};
        color:${isActive ? "black" : "white"};
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

  if (!mounted) return null;

  return (
    <MapContainer
      {...({} as any)}
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      {/* Fire Stations */}
      {stations &&
        stations.features.map((f, i) => {
          const [lon, lat] = f.geometry.coordinates;
          const stationNumber = f.properties.Station.replace("Station ", "");

          return (
            <Marker
              key={i}
              position={[lat, lon]}
              icon={createStationIcon(
                stationNumber,
                i === activeStationIndex // <-- highlight logic
              )}
            />
          );
        })}

      {/* Active Fire Incident */}
      {isRunning &&
        incidents &&
        activeIndex !== null &&
        (() => {
          const f = incidents.features[activeIndex];
          const [lon, lat] = f.geometry.coordinates;

          return (
            <CircleMarker
              center={[lat, lon]}
              radius={5}
              pathOptions={{
                color: "#000080",
                fillColor: "#000080",
                fillOpacity: 1,
              }}
            />
          );
        })()}
    </MapContainer>
  );
}
