'use client';

import React, { useState, useEffect } from 'react';
import Button from './button';
import { useHourglassStore } from '../../../store/hourglassStore';
import './timerModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCategories: UserCategory[];
}

interface UserCategory {
  userCategoryId: number;
  categoryName: string;
  color: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, userCategories }) => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const { closeModal, stopTimer } = useHourglassStore();

  useEffect(() => {
    if (isOpen) {
      setSelectedActivity('');
      setComment('');
      setRating(0);
    }
  }, [isOpen]);

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedActivity(e.target.value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    stopTimer(selectedActivity, rating, comment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-96">
        <div className="p-6">
          <div className='flex w-full justify-between'>
            <div className="text-lg font-bold mb-4">활동을 선택하세요</div>
            <div className='' onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" color='#aaaaaa' viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="mb-4 max-h-[220px] overflow-y-auto custom-scrollbar">
            {userCategories.map((category) => (
              <label key={category.userCategoryId} className="block p-2 border-b border-gray-300">
                <input
                  type="radio"
                  name="activity"
                  value={category.categoryName}
                  checked={selectedActivity === category.categoryName}
                  onChange={handleActivityChange}
                  className="mr-2"
                />
                {category.categoryName}
              </label>
            ))}
          </div>
          <div className="mb-4">
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="코멘트를 입력하세요"
              value={comment}
              onChange={handleCommentChange}
              rows={4}
            />
          </div>
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-8 h-8 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => handleRatingChange(star)}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.362 4.186a1 1 0 00.95.69h4.398c.969 0 1.371 1.24.588 1.81l-3.558 2.582a1 1 0 00-.364 1.118l1.362 4.186c.3.921-.755 1.688-1.54 1.118l-3.558-2.582a1 1 0 00-1.175 0l-3.558 2.582c-.784.57-1.838-.197-1.54-1.118l1.362-4.186a1 1 0 00-.364-1.118L2.049 9.613c-.784-.57-.38-1.81.588-1.81h4.398a1 1 0 00.95-.69l1.362-4.186z"/>
              </svg>
            ))}
          </div>
          <div className="flex justify-center">
            <Button label="확인" onClick={handleSubmit} isActive={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
