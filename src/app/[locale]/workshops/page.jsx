"use client";
import WorkshopList from '@/components/WorkshopList';
import { LazyMotion, domAnimation } from "framer-motion";

export default function PublicWorkshops() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#F1F9FB]">
        <WorkshopList />
      </div>
    </LazyMotion>
  );
} 