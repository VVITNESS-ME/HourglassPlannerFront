'use client';

import React, { useState, useEffect } from 'react';
import useDiaryStore from '../../../../store/diaryStore';
import TilModal from "@/components/mypage/diary/tilModal";
import LoadingModal from "@/components/mypage/diary/loadingModal";
import TilContentModal from "@/components/mypage/diary/tilContentModal"; // 새로운 TilContentModal 컴포넌트 import

interface Til {
  title: string | null;
  content: string | null;
}

const TilConsole: React.FC = () => {
  const { til, fetchTil, setTil, selectedDate, setSelectedDate } = useDiaryStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newTil, setNewTil] = useState<Til | null>(til);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTilContentModalOpen, setIsTilContentModalOpen] = useState(false); // til 내용을 위한 모달 상태 추가

  useEffect(() => {
    fetchTil();
  }, [selectedDate]);

  useEffect(() => {
    setNewTil(til);
  }, [til]);

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

  const openTilContentModal = () => {
    setIsTilContentModalOpen(true);
  };

  const closeTilContentModal = () => {
    setIsTilContentModalOpen(false);
  };

  return (
    <div className="p-4 bg-mypage-layout border rounded shadow-lg w-full h-full">
      <input
        type="date"
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
        onChange={handleDateChange}
        className="mb-4 w-full p-2 border bg-mypage-active-1 rounded"
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
        <div className="text-lg mb-4" onClick={openTilContentModal}>
          {til?.title || '아직 작성된 TIL이 없습니다'}
        </div>
      )}
      {isEditing ? (
        <div className="">
          <textarea
            value={newTil?.content || ''}
            onChange={handleContentChange}
            className="w-full h-[220px] p-2 border rounded mb-4"
            rows={4}
          />
          <button onClick={handleSaveButtonClick} className="bg-sandy-3 text-white py-2 px-4 rounded">
            저장
          </button>
          <button onClick={openModal} className="bg-green-500 text-white py-2 px-4 rounded ml-2">
            일지 작성 도우미 열기
          </button>
        </div>
      ) : (
        <div>
          <div className="overflow-scroll h-[200px]">
            <p className="text-gray-600 mb-4 h-full"
               onClick={openTilContentModal}>{til?.content || '아직 작성된 TIL이 없습니다'}</p>
          </div>
          <div className="pt-4">
            <button onClick={handleEditButtonClick} className="bg-sandy-3 text-white py-2 px-4 rounded">
              일지 작성
            </button>
            <button onClick={openModal} className="bg-green-500 text-white py-2 px-4 rounded ml-2">
              일지 작성 도우미 열기
            </button>
          </div>
        </div>
          )}
          <TilModal isOpen={isModalOpen} onClose={closeModal}/>
          <TilContentModal isOpen={isTilContentModalOpen} onClose={closeTilContentModal} til={til}/> {/* 새로운 모달 추가 */}
        </div>
      );
      };

      export default TilConsole;
