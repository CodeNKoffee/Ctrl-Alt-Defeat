'use client';

import React from 'react';
import DeleteTileConfirmation from './DeleteTileConfirmation';

const DeleteWorkshopModal = ({ isOpen, onClose, onDelete, workshopTitle }) => {
  // Only render the modal if it's open
  if (!isOpen) return null;

  return (
    <DeleteTileConfirmation
      type={`workshop${workshopTitle ? ` " ${workshopTitle} "` : ''}`}
      onConfirm={onDelete}
      onCancel={onClose}
    />
  );
};

export default DeleteWorkshopModal; 