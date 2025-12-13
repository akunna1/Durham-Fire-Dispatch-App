// Run with npx ts-node scripts/convertFireStationsToGeoJSON.ts in VS code terminal

import fs from "fs";
import csv from "csv-parser";

// Input CSV and output GeoJSON paths
const INPUT = "./data/Fire_Stations_Geocoded.csv";
const OUTPUT = "./data/Fire_Stations.geojson";

// Array to hold GeoJSON features
const features: any[] = [];

fs.createReadStream(INPUT)
  .pipe(csv())
  .on("data", (row: any) => {
    const lat = Number(row.lat);
    const lon = Number(row.long);

    if (!isNaN(lat) && !isNaN(lon)) {
      const feature = {
        type: "Feature",
        properties: {
          Station: row.Station,
          Battalion: row.Battalion,
          Address: row["Physical.Location"]
        },
        geometry: {
          type: "Point",
          coordinates: [lon, lat]
        }
      };
      features.push(feature);
    }
  })
  .on("end", () => {
    // Create the final FeatureCollection
    const geojson = {
      type: "FeatureCollection",
      features
    };

    // Write to file
    fs.writeFileSync(OUTPUT, JSON.stringify(geojson, null, 2));
    console.log(`✅ GeoJSON created: ${OUTPUT}`);
  });
