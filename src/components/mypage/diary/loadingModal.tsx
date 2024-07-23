'use client';

import React from 'react';
import Image from "next/image";

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="flex items-center justify-center  max-w-4xl">
        <Image src="/img/typingCat.webp" alt="Loading..." width={500} height={500} className="mx-auto" />
      </div>
    </div>
  );
};

export default LoadingModal;
