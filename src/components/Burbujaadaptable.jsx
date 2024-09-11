import React from "react";

export default function BurbujaAdaptable({ id, className = "" }) {
  return (
    <div
      id={id}
      className={`absolute scale-110 start-1/2 -translate-x-1/2 mx-auto flex items-center justify-center rounded-full shadow-amber-100 shadow-lg ${className}`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 opacity-20"></div>

    </div>
  );
}
