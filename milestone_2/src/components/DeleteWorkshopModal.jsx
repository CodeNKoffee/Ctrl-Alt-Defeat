'use client';

import React from 'react';
import GenericModal from './GenericModal';

const DeleteWorkshopModal = ({ isOpen, onClose, onDelete, workshopTitle, slideDirection = 'center' }) => {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Workshop"
      slideDirection={slideDirection}
      primaryButton={{
        text: "Delete",
        onClick: onDelete,
        color: "bg-red-500 hover:bg-red-600 text-white"
      }}
      secondaryButton={{
        text: "Cancel",
        onClick: onClose,
        color: "bg-gray-200 hover:bg-gray-300 text-gray-700"
      }}
    >
      <div className="py-4">
        <p className="text-gray-700 mb-2">
          Are you sure you want to delete this workshop? This action cannot be undone.
        </p>
        {workshopTitle && (
          <p className="font-medium text-gray-900 mt-2">
            Workshop: {workshopTitle}
          </p>
        )}
      </div>
    </GenericModal>
  );
};

export default DeleteWorkshopModal; 