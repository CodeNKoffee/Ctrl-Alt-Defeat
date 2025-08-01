"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { MutatingDots } from 'react-loader-spinner';

export default function CustomButton({
  variant = "primary",
  onClick,
  icon,
  text,
  width = "w-fit",
  disabled = false,
  isLoading = false,
  loadingText = "Loading...",
  iconPosition = "left",
  type = "button",
  showIconOnLoading = false,
  useAnimatedDots = false,
  extraClasses = "",
}) {
  // Classes based on variant
  const variantStyles = {
    primary: "bg-[#318FA8] text-white hover:bg-[#2a5c67] border-[#5DB2C7]",
    secondary: "bg-[#daedf0] text-[#318FA8] hover:bg-[#cee5e9] border-[#5DB2C7]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    pre: "bg-amber-200 text-amber-800 hover:bg-amber-300 focus:ring-amber-500",
    upcoming: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  return (
    <button
      type={type}
      onClick={!disabled && !isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      className={`
        ${extraClasses}
        font-bold py-3 px-4 rounded-full transition-all duration-200 
        flex items-center justify-center focus:outline-none focus:ring-2
        ${variantStyles[variant] || variantStyles.primary}
        ${width}
        ${(disabled || isLoading) ? "opacity-60 cursor-not-allowed" : "cursor-pointer transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"}
        border
      `}
    >
      {isLoading && useAnimatedDots ? (
        <div className="flex items-center space-x-2">
          <MutatingDots
            height={20}
            width={20}
            color="currentColor"
            secondaryColor="currentColor"
            radius={2}
            ariaLabel="mutating-dots-loading"
            visible={true}
          />
          <span>{loadingText}</span>
        </div>
      ) : (
        <>
          {isLoading && iconPosition === 'left' && showIconOnLoading && (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
          )}

          {!isLoading && icon && iconPosition === 'left' && (
            <FontAwesomeIcon icon={icon} className="mr-2" />
          )}

          {isLoading ? loadingText : text}

          {!isLoading && icon && iconPosition === 'right' && (
            <FontAwesomeIcon icon={icon} className="ml-2" />
          )}

          {isLoading && iconPosition === 'right' && showIconOnLoading && (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin ml-2" />
          )}
        </>
      )}
    </button>
  );
} 