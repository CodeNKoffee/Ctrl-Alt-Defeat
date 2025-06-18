import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "./shared/CustomButton";

export default function DeleteTileConfirmation({ type, onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-lg text-center w-full max-w-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
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
            Confirm Delete
          </div>
          
          <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '24px' }}>
            Are you sure you want to delete this {type}?
          </p>
          
          <div className="w-full flex items-center space-x-2">
            <CustomButton
              variant="primary"
              text="Cancel"
              onClick={onCancel}
              width="w-1/2"
            />
            <CustomButton
              variant="danger"
              text="Delete"
              onClick={onConfirm}
              width="w-1/2"
            />
          </div>
        </motion.div>
      </div>  
    );
  }
