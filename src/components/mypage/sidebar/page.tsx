// pages/index.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from './sidebar';
import ProfileContent from './profileContent';
import StatisticsContent from './statisticsContent';
import DiaryContent from './diaryContent';

const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('프로필');

  const renderContent = () => {
    switch (selectedTab) {
      case '프로필':
        return <ProfileContent />;
      case '통계':
        return <StatisticsContent />;
      case '다이어리':
        return <DiaryContent />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onSelect={setSelectedTab} />
      <div className="flex-grow p-8">{renderContent()}</div>
    </div>
  );
};

export default Home;