import React from "react";
import Image from "next/image";

export default function WorkshopCard({ workshop, onClick }) {
  return (
    <div 
      onClick={() => onClick(workshop)}
      className="bg-white border-[#86CBDA] rounded-lg shadow-sm transition-shadow duration-300 cursor-pointer overflow-hiddenhover:scale-110 hover:shadow-2xl hover:border-[#3298BA]"
    >
      {/* Workshop Image */}
      <div className="relative h-40">
        <img 
          src={workshop.imageUrl} 
          alt={workshop.title} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category Tag - if you have workshop categories */}
        <span className="text-xs text-blue-600 font-medium mb-2 block">
          {workshop.category || "WORKSHOP"}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2">
          {workshop.title}
        </h3>

        {/* Instructor Info */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <Image
              src={workshop.instructorImage || "/default-avatar.png"}
              alt={workshop.instructor}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {workshop.instructor}
          </p>
        </div>
      </div>
    </div>
  );
}
