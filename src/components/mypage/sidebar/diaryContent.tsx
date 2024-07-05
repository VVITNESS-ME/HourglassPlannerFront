// components/DiaryContent.tsx
'use client';
import React, { useState } from 'react';
import TilModal from '../diary/tilModal';
import Button from '../profile/button';

const DiaryContent: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <div className="min-h-screen flex items-center justify-center">
        <Button
          label="모달 열기"
          onClick={openModal}
          isActive={false}
          activeColor="bg-blue-600"
          inactiveColor="bg-blue-500"
          disabledColor="bg-gray-400"
        />
        <TilModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
      );
};

export default DiaryContent;
