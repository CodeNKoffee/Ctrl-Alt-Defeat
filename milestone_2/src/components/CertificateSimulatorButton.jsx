import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faAward } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { createSafeT } from "@/lib/translationUtils";

export default function CertificateSimulatorButton({ isOpen, onClose }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  if (!isOpen) return null;

  const handleDownloadCertificate = () => {
    toast.success(safeT('toast.certificateDownloaded'), {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">{safeT('student.dashboard.workshopFeedback.certificateSimulator.title')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>
        <div className="text-center mb-8">
          <FontAwesomeIcon icon={faAward} className="h-20 w-20 text-yellow-500 mb-4" />
          <p className="text-gray-700 text-lg">
            {safeT('student.dashboard.workshopFeedback.certificateSimulator.message')}
          </p>
        </div>
        <button
          onClick={() => {
            // Create a link element
            const link = document.createElement('a');
            link.href = '/docs/CS50 Cybersecurity Certificate.pdf';
            link.download = 'CS50 Cybersecurity Certificate.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            handleDownloadCertificate();
          }}
          className="w-full bg-metallica-blue-600 hover:bg-metallica-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-metallica-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in-out"
        >
          {safeT('student.dashboard.workshopFeedback.certificateSimulator.download')}
        </button>
      </div>
    </div>
  );
} 