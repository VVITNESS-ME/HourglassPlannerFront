'use client';

import React, { useState, useEffect } from 'react';
import useDiaryStore from '../../../../store/diaryStore';
import styles from './hourglassDetail.module.css';

const HourglassDetail: React.FC = () => {
  const { selectedHourglass, description, setDescription, updateHourglass } = useDiaryStore();
  const [text, setText] = useState(description);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedHourglass) {
      setDescription(selectedHourglass.content);
    }
  }, [selectedHourglass, setDescription]);

  const handleSave = async () => {
    if (selectedHourglass) {
      const content = text;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary/hourglass/${selectedHourglass.hid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }), // JSON 객체로 전송
        });

        if (response.ok) {
          const updatedHourglass = { ...selectedHourglass, content };
          updateHourglass(updatedHourglass);
          setText(content);
          setIsEditing(false);
        } else {
          console.error('Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task', error);
      }
    }
  };

  useEffect(() => {
    setText(description);
  }, [description]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setText(description);
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full">
      <div className="p-4 box-border border bg-mypage-layout rounded mypage-md">
        <div className=" text-2xl font-bold pb-2 pl-2 pr-2">
          <h3>작업 기록</h3>
        </div>
        {isEditing ? (
          <div className=' bg-mypage-layout '>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`${styles.textarea} text-2xl bg-mypage-active-1`}
            />
            <div className={`${styles.buttonContainer} h-12 text-xl font-semibold`}>
              <button onClick={handleSave} className={styles.saveButton}>저장</button>
              <button onClick={handleCancelClick} className={styles.cancelButton}>취소</button>
            </div>
          </div>
        ) : (
          <div className=' bg-mypage-layout '>
            <p className={`${styles.textDisplay} text-2xl bg-mypage-active-1`}>{text}</p>
            <button onClick={handleEditClick} className={`${styles.editButton} h-10 font-bold`}>수정</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HourglassDetail;
