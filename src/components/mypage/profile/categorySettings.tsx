// components/CategorySettings.tsx
'use client';

import React, { useState } from 'react';
import CardLayout from '../../cardLayout';
import CategoryModal from './categoryModal';

const CategorySettings: React.FC = () => {
  const [categories, setCategories] = useState([
    { name: 'Spring', color: '#228B22' },
    { name: 'MySQL', color: '#1E90FF' },
    { name: '독서', color: '#8A2BE2' },
    { name: '운동', color: '#FFD700' },
    { name: '코딩', color: '#FF69B4' },
    { name: '핀토스', color: '#FF4500' },
    { name: '알고리즘', color: '#808080' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategory = (category: { name: string; color: string }) => {
    setCategories([...categories, { name: category.name, color: category.color }]);
  };

  const handleDeleteCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  return (
    <div>
      <CardLayout title="카테고리 설정" width="w-96" height="h-72" color="bg-white"> {/* 높이와 너비 수정 */}
        <ul className="max-h-60 overflow-y-auto pr-4">
          {categories.map((category, index) => (
            <li key={index} className="relative p-2 mb-2 text-white rounded flex justify-between items-center group" style={{ backgroundColor: category.color }}>
              {category.name}
              <button
                className="absolute right-2 top-2 p-1 text-black rounded-full bg-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteCategory(index)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
        <button
          className="text-gray-500 mt-2"
          onClick={() => setIsModalOpen(true)}
        >
          + 카테고리 추가
        </button>
      </CardLayout>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
};

export default CategorySettings;
