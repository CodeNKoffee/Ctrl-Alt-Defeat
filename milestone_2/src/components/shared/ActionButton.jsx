"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ActionButton({ buttonType, onClick, icon, text, buttonClassName, iconClassName, widthLimiter }) {
  return (
    <button
      className={`${buttonType === 'accept' ? 'companydetails-accept-btn' : 'companydetails-reject-btn'} companydetails-action-button button-30 ${buttonClassName} ${widthLimiter ? 'companydetails-width-limiter' : ''} flex items-center justify-center px-4 py-2`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className={`companydetails-action-icon ${iconClassName} mr-2`} />
      <span>{text}</span>
    </button>
  );
}
