'use client';

import React, { useState } from 'react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: { categoryName: string; color: string }) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');

  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
    '#FF8C33', '#33FFF0', '#FF5733', '#33FF57', '#FFC300',
  ];

  const handleAddCategory = async () => {
    if (categoryName.trim() && selectedColor) {
      onAddCategory({ categoryName, color: selectedColor });
      setCategoryName('');
      setSelectedColor('#000000');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-bold mb-4">카테고리 추가</h2>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-4 w-full"
          placeholder="카테고리 이름"
        />
        <div className="mb-4">
          <label className="block mb-2">색상 선택:</label>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full cursor-pointer ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddCategory}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
