"use client"

import { useState } from 'react';
import Button from '../common/button';

const LogoutConfirmDialog = ({ onConfirm, onCancel }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = () => {
    setIsLoggingOut(true); // Disable buttons before logout
    onConfirm();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
        role="dialog"
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <h2 id="logout-dialog-title" className="text-lg font-semibold text-gray-900">
          Confirm Logout
        </h2>
        <p id="logout-dialog-description" className="mt-2 text-sm text-gray-600">
          Are you sure you want to log out?
        </p>
        <div className="mt-4 flex justify-end space-x-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            size="medium"
            className="text-gray-700"
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="medium"
            className="text-white bg-blue-500 hover:bg-blue-600"
            disabled={isLoggingOut}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmDialog;