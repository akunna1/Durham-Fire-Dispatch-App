"use client";
import Navbar from "./components/Navbar";
import dynamic from "next/dynamic";
import { useState } from "react";

// To ensure the map only loads on the client side
const CADMap = dynamic(() => import("./components/CADMap"), { ssr: false });

export default function HomePage() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* pass only serializable state (boolean) via callback */}
      <Navbar onToggle={setIsRunning} />
      <div className="flex-1">
        <CADMap isRunning={isRunning} />
      </div>
    </div>
  );
}
