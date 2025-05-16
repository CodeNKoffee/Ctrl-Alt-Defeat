"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function CustomButton({
  variant,
  onClick,
  icon,
  text,
  fullWidth,
  disabled = false,
  isLoading = false,
  loadingText = "Loading...",
  iconPosition = "left",
  type = "button",
}) {
  // Base button classes
  const baseClasses = "font-bold py-3 px-4 rounded-full transition-all duration-200 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Handle variants
  const variantClasses = {
    primary: "bg-metallica-blue-off-charts text-white hover:bg-metallica-blue-950 focus:ring-metallica-blue-500",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 border border-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  // Handle width
  const widthClasses = fullWidth ? "w-full" : "";

  // Handle disabled state (explicitly or due to loading)
  const isDisabled = disabled || isLoading;
  const disabledClasses = isDisabled ? "opacity-60 cursor-not-allowed" : "";

  const iconMarkup = icon && !isLoading && (
    <FontAwesomeIcon icon={icon} className={`${text && (iconPosition === 'left' ? 'mr-2' : 'ml-2')}`} />
  );

  const loadingIconMarkup = isLoading && (
    <FontAwesomeIcon icon={faSpinner} className={`animate-spin ${text ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}`} />
  );

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${widthClasses} ${disabledClasses}`}
    >
      {iconPosition === 'left' && loadingIconMarkup}
      {iconPosition === 'left' && iconMarkup}
      {isLoading ? loadingText : text}
      {iconPosition === 'right' && iconMarkup}
      {iconPosition === 'right' && loadingIconMarkup}
    </button>
  );
} 