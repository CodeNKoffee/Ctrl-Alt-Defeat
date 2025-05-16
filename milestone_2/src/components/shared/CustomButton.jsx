"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function CustomButton({
  variant,
  onClick,
  icon,
  text,
  width = "w-full",
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
    primary: "flex-1 px-4 py-3 mt-4 text-white bg-[#318FA8] rounded-full font-semibold hover:bg-[#2a5c67] transition-all text-sm border border-[#5DB2C7] shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    secondary: "text-[#318FA8] bg-[#daedf0] border border-[#5DB2C7] hover:bg-[#D9F0F4] hover:-translate-y-0.5",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 transform hover:-translate-y-0.5",
  };

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
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${width} ${disabledClasses}`}
    >
      {iconPosition === 'left' && loadingIconMarkup}
      {iconPosition === 'left' && iconMarkup}
      {isLoading ? loadingText : text}
      {iconPosition === 'right' && iconMarkup}
      {iconPosition === 'right' && loadingIconMarkup}
    </button>
  );
} 