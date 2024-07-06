'use client';

import React, { useState } from 'react';
import { UserIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import MenuTab from './menuTab';

const Sidebar: React.FC<{}> = () => {
  const [selectedTab, setSelectedTab] = useState('프로필');
  const [activeTab, setActiveTab] = useState('프로필');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSelectedTab(tab);
  };

  return (
    <div className="fixed top-20 left-0 h-full border-r border-gray-300 w-64 bg-white">
      <MenuTab
        icon={<UserIcon className={`h-6 w-6 ${activeTab === '프로필' ? 'text-yellow-500' : 'text-gray-600'}`} />}
        label="프로필"
        isActive={activeTab === '프로필'}
        onClick={() => handleTabClick('프로필')}
      />
      <MenuTab
        icon={<ChartBarIcon className={`h-6 w-6 ${activeTab === '통계' ? 'text-yellow-500' : 'text-gray-600'}`} />}
        label="통계"
        isActive={activeTab === '통계'}
        onClick={() => handleTabClick('통계')}
      />
      <MenuTab
        icon={<BookOpenIcon className={`h-6 w-6 ${activeTab === '다이어리' ? 'text-yellow-500' : 'text-gray-600'}`} />}
        label="다이어리"
        isActive={activeTab === '다이어리'}
        onClick={() => handleTabClick('다이어리')}
      />
    </div>
  );
};

export default Sidebar;
