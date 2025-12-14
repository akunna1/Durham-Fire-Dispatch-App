"use client";

export default function Navbar() {
  return (
    <nav className="w-full py-5 flex items-center justify-end px-6 border-b border-gray-800">
      <button className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded-md text-sm font-bold">
        Add Incident
      </button>
    </nav>
  );
}
