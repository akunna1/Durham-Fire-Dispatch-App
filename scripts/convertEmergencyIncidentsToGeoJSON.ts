// Run with npx ts-node scripts/convertEmergencyIncidentsToGeoJSON.ts in VS code terminal


import fs from "fs";
import csv from "csv-parser";

// Input CSV and output GeoJSON paths
const INPUT = "./data/Emergency_Incidents_LatLng.csv";
const OUTPUT = "./data/Emergency_Incidents.geojson";

// Array to hold GeoJSON features
const features: any[] = [];

fs.createReadStream(INPUT)
  .pipe(csv())
  .on("data", (row: any) => {
    const lat = Number(row.latitude);
    const lon = Number(row.longitude);

    if (!isNaN(lat) && !isNaN(lon)) {
      const feature = {
        type: "Feature",
        properties: {
          Incident: row["Incident #"],
          Complaint: row["Chief Complaint"],
          DeterminantCode: row["Determinant Code"],
          Priority: row["Priority Level"],
          ResponseType: row["Response Type"],
          WhoToSend: row["Who to Send"]
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
    // Wrap all features in a FeatureCollection
    const geojson = {
      type: "FeatureCollection",
      features
    };

    // Write GeoJSON to file
    fs.writeFileSync(OUTPUT, JSON.stringify(geojson, null, 2));
    console.log(`✅ Emergency incidents GeoJSON created: ${OUTPUT}`);
  });
