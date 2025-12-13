# Durham Fire Dispatch App 🚒

**Durham Fire Dispatch App** is a simulation of a real emergency dispatch system for the City of Durham. The app **responds only to Fire incidents**, ignoring Police and EMS calls, and uses pre-existing incident data for processing.

## Features

* Filters Fire incidents from a CSV dataset.
* Converts X/Y coordinates (State Plane) to longitude/latitude for mapping.
* Determines the closest fire stations to each incident and groups them by battalion (Durham has 4 battalions).
* Interactive “game-like” interface where clicking a button triggers incident processing and shows station responses.
* Ready for integration with **GeoJSON** and geospatial analysis using **Turf.js**.

## Tech Stack

* **Next.js** + **TypeScript** for frontend and backend
* **TailwindCSS** for styling
* **Leaflet.js** for map display
* **Turf.js** for geospatial calculations
* CSV and GeoJSON files for incident and station data

## Folder Structure 📁

```
Durham-Dispatch-App/
├── src/              # Next.js app
├── data/             # CSVs and later GeoJSON files
├── scripts/          # Utility scripts (e.g., coordinate conversion)
├── package.json
└── README.md
```

## Notes

* Only Fire incidents are processed; Police and EMS are ignored.
* X/Y columns in the CSV are dropped after conversion to latitude/longitude.
* Focused entirely on Durham, keeping the app lightweight and simple.
