'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const GenericModal = ({
  isOpen,
  onClose,
  title,
  children,
  primaryButton = null,  // { text, onClick, color }
  secondaryButton = null, // { text, onClick, color }
  width = 'max-w-md', // default width, can be overridden
  slideDirection = 'center', // 'center' (default) or 'left'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <AnimatePresence>
        {/* Overlay */}
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content Wrapper */}
        <div className={`flex items-center justify-center min-h-screen px-4 py-8 text-center sm:p-0 ${slideDirection === 'left' ? 'justify-start' : ''}`}>
          <motion.div
            key="modal-content"
            initial={slideDirection === 'left'
              ? { opacity: 0, x: -300 }
              : { opacity: 0, scale: 0.95 }
            }
            animate={slideDirection === 'left'
              ? { opacity: 1, x: 0 }
              : { opacity: 1, scale: 1 }
            }
            exit={slideDirection === 'left'
              ? { opacity: 0, x: -300 }
              : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.3 }}
            className={`relative w-full ${width} bg-metallica-blue-50 rounded-2xl overflow-hidden shadow-2xl transform sm:my-8 text-left ${slideDirection === 'left' ? 'sm:ml-8' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 z-20 flex items-center justify-center w-7 h-7 rounded-full shadow-sm bg-gray-200/70 hover:bg-gray-300/90 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500 font-normal" />
            </button>

            {/* Header Tab */}
            {title && (
              <div className="relative z-10">
                <div className="inline-block bg-metallica-blue-600 text-white px-6 py-3 rounded-tl-2xl rounded-br-xl shadow-md">
                  <h3 className="text-xl font-young-serif font-medium">{title}</h3>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="p-6">
              {children}

              {/* Action Buttons */}
              {(primaryButton || secondaryButton) && (
                <div className="mt-6 flex justify-end space-x-3">
                  {secondaryButton && (
                    <button
                      onClick={secondaryButton.onClick}
                      className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${secondaryButton.color || 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                      {secondaryButton.text}
                    </button>
                  )}

                  {primaryButton && (
                    <button
                      onClick={primaryButton.onClick}
                      className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${primaryButton.color || 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                    >
                      {primaryButton.text}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default GenericModal; 