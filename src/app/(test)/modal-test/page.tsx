// pages/index.tsx
'use client';

import React, { useState } from 'react';
import Modal from '../../../components/hourglass/timerModal'

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button className="px-4 py-2 bg-yellow-400 text-white rounded" onClick={openModal}>모달 열기</button>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Home;