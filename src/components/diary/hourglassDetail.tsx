'use client';

import React, { useState, useEffect } from 'react';
import useDiaryState from '../../../store/diaryStore';
import styles from './hourglassDetail.module.css';

const HourglassDetail: React.FC = () => {
  const { selectedHourglass, description, setDescription, updateHourglass } = useDiaryState();
  const [text, setText] = useState(description);

  useEffect(() => {
    if (selectedHourglass) {
      setDescription(selectedHourglass.description);
    }
  }, [selectedHourglass, setDescription]);

  const handleSave = async () => {
    if (selectedHourglass) {
      const updatedHourglass = {
        ...selectedHourglass,
        description,
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedHourglass),
        });

        if (response.ok) {
          updateHourglass(updatedHourglass);
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

  return (
    <div className={styles.hourglassDetail}>
      <h3>작업 기록</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.textarea}
      />
      <button onClick={handleSave} className={styles.saveButton}>수정</button>
    </div>
  );
};

export default HourglassDetail;
