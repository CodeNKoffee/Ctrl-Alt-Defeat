"use client";
import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function DatePicker({ selectedDate, onDateChange }) {
  const parsedDate = typeof selectedDate === 'string' 
    ? parse(selectedDate, 'yyyy-MM-dd', new Date())
    : selectedDate;

  const handleDateSelect = (date) => {
    onDateChange(date ? format(date, 'yyyy-MM-dd') : null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center
            ${
              parsedDate
                ? "bg-[#D9F0F4] text-[#2a5f74] border-2 border-[#3298BA]"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>
            {parsedDate ? format(parsedDate, "MMM d, yyyy") : "Filter by date"}
          </span>
          {parsedDate && (
            <X 
              className="ml-2 h-4 w-4 text-gray-500 hover:text-[#2a5f74]"
              onClick={(e) => {
                e.stopPropagation();
                onDateChange(null);
              }}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-4 bg-[#F0F9FB] rounded-md shadow-md border-2 border-[#3298BA]">
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={handleDateSelect}
          initialFocus
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
        />
      </PopoverContent>
    </Popover>
  );
}