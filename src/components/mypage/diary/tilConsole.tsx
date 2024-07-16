'use client';

import React, { useState, useEffect } from 'react';
import useDiaryStore from '../../../../store/diaryStore';
import TilModal from "@/components/mypage/diary/tilModal";

interface Til {
  title: string | null;
  content: string | null;
}

const TilConsole: React.FC = () => {
  const { til, setTil, selectedDate, setSelectedDate } = useDiaryStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newTil, setNewTil] = useState<Til | null>(til);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchTil();
    }
  }, [selectedDate]);

  const fetchTil = async () => {
    try {
      if (!selectedDate) return;

      const formattedDate = formatDate(selectedDate);
      const response = await fetch(`/api/today-i-learned/${formattedDate}/original`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const fetchedTil = {
          title: data.data.title,
          content: data.data.content,
        };
        setTil(fetchedTil);
        setNewTil(fetchedTil);
        setIsEditing(false);
      } else {
        console.error('Failed to fetch TIL');
      }
    } catch (error) {
      console.error('Error fetching TIL', error);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
  };

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleSaveButtonClick = async () => {
    try {
      if (!selectedDate || !newTil) return;

      const formattedDate = formatDate(selectedDate);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/today-i-learned/${formattedDate}/modified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTil.title,
          content: newTil.content,
        }),
      });

      if (response.ok) {
        setTil(newTil);
        setIsEditing(false);
      } else {
        console.error('Failed to update TIL');
      }
    } catch (error) {
      console.error('Error updating TIL', error);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedDate = new Date(event.target.value);
    setSelectedDate(newSelectedDate);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (newTil) {
      setNewTil({ ...newTil, content: event.target.value });
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (newTil) {
      setNewTil({ ...newTil, title: event.target.value });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 border rounded shadow-lg min-w-[400px] max-w-[600px]">
      <input
        type="date"
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
        onChange={handleDateChange}
        className="mb-4 w-full p-2 border rounded"
      />
      {isEditing ? (
        <div className="text-lg mb-4">
          <input
            type="text"
            value={newTil?.title || ''}
            onChange={handleTitleChange}
            className="w-full p-2 border rounded h-[45px]"
          />
        </div>
      ) : (
        <div className="text-lg mb-4">
          {til?.title || '아직 작성된 TIL이 없습니다'}
        </div>
      )}
      {isEditing ? (
        <div>
          <textarea
            value={newTil?.content || ''}
            onChange={handleContentChange}
            className="w-full p-2 border rounded mb-4"
            rows={4}
          />
          <button onClick={handleSaveButtonClick} className="bg-blue-500 text-white py-2 px-4 rounded">
            저장
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">{til?.content || '아직 작성된 TIL이 없습니다'}</p>
          <button onClick={handleEditButtonClick} className="bg-yellow-500 text-white py-2 px-4 rounded">
            일지 작성
          </button>
        </div>
      )}
      <button onClick={openModal} className="bg-green-500 text-white py-2 px-4 rounded">
        일지 작성 도우미 열기
      </button>
      <TilModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default TilConsole;
