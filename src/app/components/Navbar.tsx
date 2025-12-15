"use client";
import { useState } from "react";

type Props = {
  onToggle?: (state: boolean) => void; // optional callback
};

export default function Navbar({ onToggle }: Props) {
  const [isRunning, setIsRunning] = useState(false);

  const handleClick = () => {
    setIsRunning(!isRunning);
    if (onToggle) onToggle(!isRunning); // tell CADMap
  };

  return (
    <nav className="w-full py-5 flex items-center justify-end px-6 border-b border-gray-800">
      <button
        onClick={handleClick}
        className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded-md text-sm font-bold transition-transform duration-200 hover:-translate-y-1"
      >
        {isRunning ? "End CAD" : "Run CAD"}
      </button>
    </nav>
  );
}
