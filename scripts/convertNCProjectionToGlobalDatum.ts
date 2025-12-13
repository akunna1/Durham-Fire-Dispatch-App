// Run with npx ts-node scripts/convertEmergencyIncidents.ts in VS code terminal

import fs from "fs";
import csv from "csv-parser";
import { format } from "@fast-csv/format";
import proj4 from "proj4";

// NC State Plane → WGS84
const statePlaneNC = "+proj=lcc +lat_1=34.33333333333334 +lat_2=36.16666666666666 +lat_0=33.75 +lon_0=-79 +x_0=609601.2192024384 +y_0=0 +datum=NAD83 +units=ft +no_defs";
const wgs84 = proj4.WGS84;

const INPUT = "./data/Emergency_Incidents.csv";
const OUTPUT = "./data/Emergency_Incidents_LatLng.csv";

type IncidentRow = { [key: string]: string; X: string; Y: string; };
const rows: IncidentRow[] = [];

fs.createReadStream(INPUT)
  .pipe(csv())
  .on("data", (row: IncidentRow) => {
    const x = Number(row.X);
    const y = Number(row.Y);
    if (!isNaN(x) && !isNaN(y)) {
      const [lon, lat] = proj4(statePlaneNC, wgs84, [x, y]);
      row.longitude = lon.toFixed(6);
      row.latitude = lat.toFixed(6);
    }
    rows.push(row);
  })
  .on("end", () => {
    const ws = fs.createWriteStream(OUTPUT);
    const csvStream = format({ headers: true });
    csvStream.pipe(ws);

    // Write each row without X and Y
    rows.forEach((r) => {
      const { X, Y, ...rest } = r;
      csvStream.write(rest);
    });

    csvStream.end();
    console.log("✅ Emergency incidents CSV converted to latitude/longitude (X/Y dropped)");
  });