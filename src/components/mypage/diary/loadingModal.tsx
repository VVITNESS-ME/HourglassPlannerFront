'use client';

import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-yellow-300 rounded-lg p-8 shadow-lg w-full max-w-4xl relative">
        <img src="/img/137cba92ea963ce489a360b981fe31d7.png" alt="Loading..." />
      </div>
    </div>
  );
};

export default LoadingModal;
