'use client';

import React, { useState, useEffect } from 'react';
import CardLayout from '../../cardLayout';
import Button from './button';
import useTitleStore from '../../../../store/titleStore';

const TitleList: React.FC = () => {
  const [selectedTitle, setSelectedTitle] = useState<number | null>(null);
  const { achievedTitles, setMainTitle } = useTitleStore();
  const handleSelectTitle = async () => {
    if (selectedTitle !== null) {
      await setMainTitle(achievedTitles[selectedTitle].id);
      setSelectedTitle(null);
    }
  };

  return (
    <div className="border-4 border-black mypage-md rounded">
      <CardLayout title="칭호" width="flex-1 w-full" height="h-[450px]" color="bg-mypage-layout">
        <ul className="p-2 h-[290px]  overflow-y-auto">
          {achievedTitles.map((title, index) => (
            <li
              key={index}
              className={`p-2 border-4 border-black mb-2 text-3xl text-black rounded flex items-center cursor-pointer group ${selectedTitle === index ? 'ring-4 ring-yellow-500' : ''}`}
              style={{ backgroundColor: title.titleColor }}
              onClick={() => setSelectedTitle(index)}
            >
              <div className="flex w-full items-center space-x-2 ">
                <strong className="flex-none w-[300px]">{title.name}</strong>
                <span className="flex-grow truncate">{title.achieveCondition}</span>
              </div>
            </li>
          ))}
        </ul>
        <Button
          label="선택"
          onClick={handleSelectTitle}
          isActive={selectedTitle !== null}
          disabled={selectedTitle === null}
        />
      </CardLayout>
    </div>
  );
};

export default TitleList;
