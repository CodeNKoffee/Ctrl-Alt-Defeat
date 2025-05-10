"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ActionButton({ buttonType, onClick, icon, text, buttonClassName, iconClassName, widthLimiter, style, disabled }) {
  const disabledClasses = disabled
    ? 'opacity-50 !cursor-not-allowed'
    : '';

  return (
    <button
<<<<<<< HEAD
      className={`${buttonType === 'accept' ? 'companydetails-accept-btn' : 'companydetails-reject-btn'} companydetails-action-button button-30 ${buttonClassName} ${widthLimiter ? 'companydetails-width-limiter' : ''} flex items-center justify-center px-4 py-2`}
=======
      className={`${buttonType === 'accept' ? 'companydetails-accept-btn' : 'companydetails-reject-btn'} companydetails-action-button button-30 ${buttonClassName} ${widthLimiter ? 'companydetails-width-limiter' : ''} ${disabledClasses}`}
>>>>>>> origin/module_2
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
<<<<<<< HEAD
      <FontAwesomeIcon icon={icon} className={`companydetails-action-icon ${iconClassName} mr-2`} />
      <span>{text}</span>
=======
      {icon && <FontAwesomeIcon icon={icon} className={`companydetails-action-icon ${iconClassName}`} />} {text}
>>>>>>> origin/module_2
    </button>
  );
}
