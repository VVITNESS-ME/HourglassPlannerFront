'use client';

import React, { useState, useEffect } from 'react';
import useDiaryStore from '../../../../store/diaryStore';
import Button from '../profile/button';
import LoadingModal from "@/components/mypage/diary/loadingModal";

interface TilModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TilModal: React.FC<TilModalProps> = ({ isOpen, onClose }) => {
  const { selectedDate, hourglasses, til, setTil} = useDiaryStore();
  const [description, setDescription] = useState('');
  const [aiTitle, setAiTitle] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState<boolean>(false);

  const uniqueCategories = Array.from(new Set(hourglasses.map(h => h.categoryName)));

  useEffect(() => {
    if (isOpen) {
      const filteredHourglasses = hourglasses.filter(h => selectedCategories.includes(h.categoryName));
      const content = filteredHourglasses.map(h => `${h.content}`).join('\n');
      setDescription(content);
    }
  }, [selectedCategories, hourglasses, isOpen]);

  useEffect(() => {
    setAiResult('');
    setAiTitle('');
  }, [selectedDate]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
  };

  const conVertTil = async () => {
    try {
      setIsLoadingModalOpen(true);
      const formattedDate = formatDate(selectedDate!);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/today-i-learned/modify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiTitle(data.data.title);
        setAiResult(data.data.content);
      } else {
        console.error('Failed to update TIL');
      }
    } catch (error) {
      console.error('Error updating TIL', error);
    }finally {
      setIsLoadingModalOpen(false);
    }
  };

  const handleSaveButtonClick = async () => {
    try {
      if (!selectedDate || !aiTitle || !aiResult) return;
      const formattedDate = formatDate(selectedDate);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/today-i-learned/${formattedDate}/modified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: aiTitle,
          content: aiResult,
        }),
      });

      if (response.ok) {
        setTil({
          ...til,
          title: aiTitle,
          content: aiResult,
        });
      } else {
        console.error('Failed to update TIL');
      }
    } catch (error) {
      console.error('Error updating TIL', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <LoadingModal isOpen={isLoadingModalOpen} />
      <div className="bg-yellow-300 rounded-lg p-8 shadow-lg w-full max-w-4xl relative">
        <button
          className="absolute top-4 right-4 text-black text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-center text-2xl font-bold mb-4">일지 작성 도우미</h2>
        <div className="text-center mb-4">{new Date().toLocaleDateString()}</div>
        <div className="flex">
          <div className="w-1/4 bg-yellow-400 p-4 rounded-lg mr-4">
            <h3 className="font-bold mb-2">카테고리</h3>
            <ul>
              {uniqueCategories.map(category => (
                <li key={category} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg mr-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded mt-2 h-[200px] overflow-y-scroll"
              placeholder="카테고리를 선택해 주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              label="변환"
              onClick={conVertTil}
              isActive={false}
              activeColor="bg-gray-500"
              inactiveColor="bg-gray-400"
              disabledColor="bg-gray-300"
            />
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              placeholder="제목을 입력해주세요."
              value={aiTitle}
              onChange={(e) => setAiTitle(e.target.value)}
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded mt-2 h-[200px] overflow-y-scroll"
              placeholder="카테고리를 선택해 주세요."
              value={aiResult}
              onChange={(e) => setAiResult(e.target.value)}
            />
            <Button
              label="등록"
              onClick={() => {
                handleSaveButtonClick();
                onClose(); // 함수 호출
              }}
              isActive={false}
              activeColor="bg-yellow-600"
              inactiveColor="bg-yellow-500"
              disabledColor="bg-yellow-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TilModal;
