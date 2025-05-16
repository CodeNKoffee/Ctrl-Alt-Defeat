"use client";
import { LazyMotion, domAnimation } from "framer-motion";

export default function SCADWorkshopsLayout({ children }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
} 