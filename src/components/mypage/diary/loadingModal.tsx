'use client';

import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="flex items-center justify-center w-full max-w-4xl">
        <img src="/img/loadingCat.png" alt="Loading..." className="mx-auto" />
      </div>
    </div>
  );
};

export default LoadingModal;
