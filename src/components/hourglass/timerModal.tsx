'use client';

import React, { useState, useEffect } from 'react';
import Button from './button';
import { useHourglassStore } from '../../../store/hourglassStore';
import './timerModal.css';
import CategoryModal from "@/components/mypage/profile/categoryModal";

interface ModalProps {
  isOpen: boolean;
  userCategories: UserCategory[];
  setUserCategories: React.Dispatch<React.SetStateAction<UserCategory[]>>;
}

interface UserCategory {
  userCategoryId: number;
  categoryName: string;
  color: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, userCategories, setUserCategories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const { tId, setDailyData, closeModal, stopTimer, openResultModal } = useHourglassStore();

  const handleAddCategory = async (category: { categoryName: string; color: string }) => {
    const maxId = userCategories.reduce((max, category) => Math.max(max, category.userCategoryId), 0);
    const newCategoryId = maxId + 1;

    const newCategory: UserCategory = {
      userCategoryId: newCategoryId,
      categoryName: category.categoryName,
      color: category.color,
    };

    setUserCategories((prevCategories) => [...prevCategories, newCategory]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (response.ok) {
        console.log('Category added successfully');
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedActivity('');
      setDescription('');
      setRating(0);
    }
  }, [isOpen]);

  const handleActivityChange = (activity: string) => {
    setSelectedActivity(activity);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    try {
      const result = await stopTimer(selectedActivity, rating, description);
      setDailyData(result);
      openResultModal();
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const isValidInput = tId !== null || !!selectedActivity;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 modal-backdrop">
      <div className="border-4 border-black bg-white rounded overflow-hidden mypage-md w-[500px] h-auto modal-container">
        <div className="p-6">
          <div className='flex w-full justify-between'>
            <div className="text-3xl text-ui-title-text font-bold mb-4">활동을 선택하세요</div>
            <div className='' onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" color='#aaaaaa' viewBox="0 0 24 24" strokeWidth={3}
                   stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </div>
          </div>
          {(tId === null || tId === undefined) && (
            <div className="mb-2 h-[320px] border-4 border-black overflow-y-auto custom-scrollbar">
              {userCategories.map((category) => (
                <button
                  key={category.userCategoryId}
                  className={`h-[80px] text-5xl block p-2 border-b-4 border-black text-left w-full ${
                    selectedActivity === category.categoryName ? 'bg-blue-500 text-black' : 'bg-white text-black'
                  }`}
                  style={{
                    backgroundColor: selectedActivity === category.categoryName ? category.color : '#EEEEEE',
                    color: selectedActivity === category.categoryName ? 'black' : 'gray',
                    fontWeight: "bold"
                  }}
                  onClick={() => handleActivityChange(category.categoryName)}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>
          )}
          <button
            className=" text-3xl text-gray-700 mb-2 font-semibold mt-2"
            onClick={() => setIsModalOpen(true)}
          >
            + 카테고리 추가
          </button>
          <br/>
          <CategoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddCategory={handleAddCategory}
          />
          <div className="mb-4">
            <textarea
              className="w-full text-2xl p-2 border-4 border-black rounded"
              placeholder="코멘트를 입력하세요"
              value={description}
              onChange={handleCommentChange}
              rows={4}
            />
          </div>
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-16 h-16 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => handleRatingChange(star)}
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.362 4.186a1 1 0 00.95.69h4.398c.969 0 1.371 1.24.588 1.81l-3.558 2.582a1 1 0 00-.364 1.118l1.362 4.186c.3.921-.755 1.688-1.54 1.118l-3.558-2.582a1 1 0 00-1.175 0l-3.558 2.582c-.784.57-1.838-.197-1.54-1.118l1.362-4.186a1 1 0 00-.364-1.118L2.049 9.613c-.784-.57-.38-1.81.588-1.81h4.398a1 1 0 00.95-.69l1.362-4.186z"/>
              </svg>
            ))}
          </div>
          <div className="flex justify-center">
            {
              !isValidInput
                ? <button disabled
                          className="px-4 py-2 font-bold text-black bg-gray-500 rounded opacity-50 cursor-not-allowed border-4 border-black ">확인</button>
                : <Button label="확인" onClick={handleSubmit} isActive={true}/>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
