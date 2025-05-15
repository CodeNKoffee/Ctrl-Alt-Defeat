"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CustomButton({ variant, onClick, icon, text, fullWidth, disabled = false }) {
  // Base button classes
  const baseClasses = "font-bold py-3 px-4 rounded-full transition-colors flex items-center justify-center";

  // Handle variants
  const variantClasses = {
    primary: "bg-metallica-blue-off-charts text-white hover:bg-metallica-blue-950",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  // Handle width
  const widthClasses = fullWidth ? "w-full" : "";

  // Handle disabled state
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${widthClasses} ${disabledClasses}`}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {text}
    </button>
  );
} 