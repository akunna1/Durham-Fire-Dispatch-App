"use client";

import Navbar from "./components/Navbar";
import dynamic from "next/dynamic";

// Dynamic import for CADMap (Leaflet requires browser)
const CADMap = dynamic(() => import("./components/CADMap"), { ssr: false });

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1">
        <CADMap />
      </div>
    </div>
  );
}
