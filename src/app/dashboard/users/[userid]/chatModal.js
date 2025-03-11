// components/Modal.js
import React from 'react';
import { Button } from '@/components/ui/button';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">{title}</h2>
        <div className="mb-4">
          {children}
        </div>
        <div className="flex justify-between">
          <Button onClick={onClose} className="bg-gray-500 text-white">Cancel</Button>
          <Button onClick={onConfirm} className="bg-blue-500 text-white">Confirm</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
