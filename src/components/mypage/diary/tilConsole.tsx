'use client';

import React, { useState } from 'react';
import useDiaryStore from '../../../../store/diaryStore';

const TilConsole: React.FC = () => {
  const { til, setTil, selectedDate, setSelectedDate } = useDiaryStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newTil, setNewTil] = useState(til);

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleSaveButtonClick = async () => {
    try {
      const response = await fetch('/api/update-til', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: selectedDate, til: newTil }),
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
    const selectedDate = new Date(event.target.value);
    setSelectedDate(selectedDate);
  };

  return (
    <div className="p-4 border rounded shadow-lg min-w-[400px] max-w-[600px]">
      <input
        type="date"
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
        onChange={handleDateChange}
        className="mb-4 w-full p-2 border rounded"
      />
      <div className="text-lg mb-4">
        {selectedDate ? selectedDate.toISOString().split('T')[0] : '날짜를 선택하세요'}
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={newTil}
            onChange={(e) => setNewTil(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows={4}
          />
          <button onClick={handleSaveButtonClick} className="bg-blue-500 text-white py-2 px-4 rounded">
            저장
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">{til || '아직 작성된 TIL이 없습니다'}</p>
          <button onClick={handleEditButtonClick} className="bg-yellow-500 text-white py-2 px-4 rounded">
            일지 작성
          </button>
        </div>
      )}
    </div>
  );
};

export default TilConsole;
