import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '../lib/translationUtils';
import CustomButton from "./shared/CustomButton";

export default function DeleteTileConfirmation({ type, onConfirm, onCancel }) {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-lg text-center w-full max-w-sm relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-gray-100 hover:bg-gray-200/90 transition-colors"
          onClick={onCancel}
          aria-label={safeT('modals.deleteConfirmation.closeModal')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#E8F7FB" />
            <path d="M15.3 8.7L12 12M12 12L8.7 15.3M12 12L15.3 15.3M12 12L8.7 8.7" stroke="#2A5F74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <motion.div
          className="mx-auto mb-5 w-[70px] h-[70px] rounded-full flex items-center justify-center"
          style={{
            background: '#EF4444',
          }}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
        >
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            style={{ fontSize: 36, color: 'white' }}
          />
        </motion.div>

        <div style={{ fontSize: '22px', fontWeight: '600', color: '#2A5F74', marginBottom: '8px' }}>
          {safeT('modals.deleteConfirmation.title')}
        </div>

        <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '24px' }}>
          {ready ? t('modals.deleteConfirmation.message', { type }) : `Are you sure you want to delete this ${type}?`}
        </p>

        <div className={"w-full flex items-center space-x-2 rtl:flex-row-reverse rtl:space-x-reverse"}>
          <CustomButton
            variant="primary"
            text={safeT('modals.deleteConfirmation.cancel')}
            onClick={onCancel}
            width="w-1/2"
          />
          <CustomButton
            variant="danger"
            text={safeT('modals.deleteConfirmation.delete')}
            onClick={onConfirm}
            width="w-1/2"
          />
        </div>
      </motion.div>
    </div>
  );
}
