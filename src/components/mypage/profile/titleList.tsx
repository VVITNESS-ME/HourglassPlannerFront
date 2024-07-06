'use client';

import React, { useState } from 'react';
import CardLayout from '../../cardLayout';
import Button from './button';

interface Title {
  titleId: bigint;
  name: string;
  description: string;
  color: string;
}

interface UserInfo {
  userEmail: string;
  userName: string;
  main_title: bigint;
}

interface TitleListProps {
  titles: Title[];
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

const TitleList: React.FC<TitleListProps> = ({ titles, setUserInfo }) => {
  const [selectedTitle, setSelectedTitle] = useState<number | null>(null);

  const handleSelectTitle = async () => {
    if (selectedTitle === null) return;

    const selectedTitleId = titles[selectedTitle].titleId;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/select-title/?title-id=${selectedTitleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUserInfo(prevUserInfo => {
          if (prevUserInfo) {
            return { ...prevUserInfo, main_title: selectedTitleId };
          }
          return prevUserInfo;
        });
      } else {
        console.error('Failed to select title');
      }
    } catch (error) {
      console.error('Error selecting title', error);
    }
  };

  return (
    <CardLayout title="칭호" width="flex-1 min-w-[400px] max-w-[700px]" height="h-auto" color="bg-[#EEEEEE]">
      <ul className="p-2 max-h-80 overflow-y-auto">
        {titles.map((title, index) => (
          <li
            key={index}
            className={`p-2 mb-2 text-white rounded flex items-center cursor-pointer group ${selectedTitle === index ? 'ring-4 ring-yellow-500' : ''}`}
            style={{ backgroundColor: title.color }}
            onClick={() => setSelectedTitle(index)}
          >
            <div className="flex w-full items-center space-x-2 ">
              <strong className="flex-none w-[200px]">{title.name}</strong>
              <span className="flex-grow truncate">{title.description}</span>
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
  );
};

export default TitleList;