'use client';

import React, { useState } from 'react';
import CardLayout from '../../cardLayout';
import CategoryModal from './categoryModal';

interface Category {
  categoryId: number;
  categoryName: string;
  color: string;
}

interface CategorySettingsProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onAddCategory: (category: { categoryName: string; color: string }) => void;
}

const CategorySettings: React.FC<CategorySettingsProps> = ({ categories, setCategories, onAddCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteCategory = async (index: number) => {
    const categoryToDelete = categories[index];
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryToDelete.categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const newCategories = categories.filter((_, i) => i !== index);
        setCategories(newCategories);
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category', error);
    }
  };

  return (
    <div>
      <CardLayout title="카테고리 설정" width="flex-1 min-w-[400px] max-w-[700px]" height="h-[347px]" color="bg-[#EEEEEE]">
        <ul className="p-2 h-[320px] overflow-y-auto">
          {categories.map((category, index) => (
            <li key={index} className="relative p-2 mb-2 text-white rounded flex justify-between items-center group" style={{ backgroundColor: category.color }}>
              {category.categoryName}
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
        onAddCategory={onAddCategory}
      />
    </div>
  );
};

export default CategorySettings;
