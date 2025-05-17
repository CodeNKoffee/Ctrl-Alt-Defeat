import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const CertificateSimulator = ({ isOpen, onClose }) => {
  // Implementation of the component
};

const CertificateSimulatorButton = () => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowCertificateModal(true)}
        className="fixed bottom-8 right-8 bg-[#318FA8] text-white rounded-full p-4 shadow-lg hover:bg-[#267a8c] transition"
        title="Simulate Certificate Download"
      >
        <FontAwesomeIcon icon={faDownload} className="w-6 h-6" />
      </button>
      <CertificateSimulator
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
      />
    </>
  );
};

export default CertificateSimulatorButton; 