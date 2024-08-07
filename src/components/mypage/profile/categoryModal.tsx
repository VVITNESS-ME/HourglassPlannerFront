'use client';

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: { categoryName: string; color: string }) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');

  const colors = [
    '#EAC7D1', '#EBD5C4', '#D6E9B9', '#CCBDE6', '#ABCFD1',
    '#CFC9A7', '#B4EBB9', '#D1C0B7', '#B4EBB9', '#AED1C1',
  ];

  const handleAddCategory = async () => {
    if (categoryName.trim() && selectedColor) {
      onAddCategory({ categoryName, color: selectedColor });
      setCategoryName('');
      setSelectedColor('#000000');
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}> {/* z-index 설정 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle border-4 border-black shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-4xl font-medium leading-6 text-gray-900">
                  카테고리 추가
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="p-2 border-4 border-black text-3xl rounded mb-4 w-full"
                    placeholder="카테고리 이름"
                  />
                  <div className="mb-4">
                    <label className="block text-3xl mb-2">색상 선택:</label>
                    <div className="grid grid-cols-5 gap-2">
                      {colors.map((color) => (
                        <div
                          key={color}
                          className={`w-16 h-8 border-4 border-black rounded cursor-pointer ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold text-3xl py-2 px-4 border-4 border-black rounded mr-2"
                      onClick={onClose}
                    >
                      취소
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-black font-bold text-3xl py-2 px-4 border-4 border-black rounded"
                      onClick={handleAddCategory}
                    >
                      추가
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CategoryModal;
