"use client";

export default function DebugComponent({ text }) {
  return <div>{text || "Debug component rendered successfully"}</div>;
} 