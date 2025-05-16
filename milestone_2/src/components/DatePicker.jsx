"use client";
import * as React from "react";
import { format, parse, isValid, setHours, setMinutes, setSeconds, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function DatePicker({ selectedDate, onDateChange, disabled, className }) {
  const [internalDate, setInternalDate] = React.useState(null);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  // Parse incoming selectedDate prop
  React.useEffect(() => {
    let parsed = null;
    if (selectedDate) {
      try {
        if (selectedDate instanceof Date && isValid(selectedDate)) {
          parsed = selectedDate;
        } else if (typeof selectedDate === 'string') {
          parsed = new Date(selectedDate); // Try parsing ISO string or other valid date strings
          if (!isValid(parsed)) parsed = null;
        }
      } catch (error) {
        console.error("DatePicker: Error parsing selectedDate prop:", error);
        parsed = null;
      }
    }
    // Ensure time is reset to start of day
    if (parsed) {
      parsed = startOfDay(parsed);
    }
    setInternalDate(parsed);
  }, [selectedDate]);

  const handleDateSelect = (day) => {
    if (!day) {
      setInternalDate(null);
      onDateChange(null); // Pass null up
      setPopoverOpen(false); // Close popover after selection or clearing
      return;
    }

    // We only care about the date part, ensure time is start of day
    const dateAtStartOfDay = startOfDay(day);

    setInternalDate(dateAtStartOfDay);
    onDateChange(dateAtStartOfDay); // Pass Date object up immediately
    setPopoverOpen(false); // Close popover after selection
  };

  // Handle final date change when popover closes
  const handlePopoverChange = (open) => {
    // We now update onDateChange immediately in handleDateSelect
    setPopoverOpen(open);
  }

  const displayFormat = "MMM d, yyyy";

  return (
    <Popover open={popoverOpen} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`rounded-full text-sm font-medium transition-colors flex items-center justify-between w-full sm:w-auto 
            ${className ? className : 'px-4 py-3 min-w-[180px] h-[46px]'}
            ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
              internalDate
                ? "bg-white/90 backdrop-blur-sm text-[#1a3f54] border-2 border-[#B8E1E9] hover:border-[#5DB2C7]"
                : "bg-white/90 backdrop-blur-sm text-[#1a3f54] border-2 border-[#B8E1E9] hover:border-[#5DB2C7]"
            } shadow-md focus:outline-none focus:ring-2 focus:ring-[#5DB2C7] focus:border-[#5DB2C7] transition-all duration-300`}
        >
          <div className="flex items-center">
            <CalendarIcon className={`text-[#5DB2C7] ${className ? 'h-3 w-3 mr-1.5' : 'h-4 w-4 mr-2'}`} />
            <span className={internalDate ? 'text-[#1a3f54]' : 'text-gray-500'}>
              {internalDate && isValid(internalDate)
                ? format(internalDate, displayFormat)
                : "Select a date"
              }
            </span>
          </div>
          {internalDate && !disabled && (
            <X
              className={`text-[#5DB2C7] hover:text-[#2a5f74] ${className ? 'h-3 w-3 ml-1.5' : 'h-4 w-4 ml-2'}`}
              onClick={(e) => {
                e.stopPropagation();
                setInternalDate(null);
                onDateChange(null);
                setPopoverOpen(false);
              }}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        <Calendar
          mode="single"
          selected={internalDate ? startOfDay(internalDate) : undefined}
          onSelect={handleDateSelect}
          initialFocus
          disabled={disabled}
          className="p-3 border-b border-gray-100"
          classNames={{
            day_selected: "bg-metallica-blue-500 text-white hover:bg-metallica-blue-600 focus:bg-metallica-blue-600",
            day_today: "text-metallica-blue-600 font-bold",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}