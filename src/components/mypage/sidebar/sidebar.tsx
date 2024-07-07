'use client';

import React, { useState } from 'react';
import { UserIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import MenuTab from './menuTab';
import Link from 'next/link';

const Sidebar: React.FC<{}> = () => {
  const [activeTab, setActiveTab] = useState('프로필');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-row justify-between space-x-2 grow md:flex-col md:space-x-0 md:space-y-2 top-20 left-0 h-full border-r border-gray-300 bg-white">
      <Link href="/mypage/profile" legacyBehavior>
        <a onClick={() => handleTabClick('프로필')}>
          <MenuTab
            icon={<UserIcon className={`h-6 w-6 ${activeTab === '프로필' ? 'text-yellow-500' : 'text-gray-600'}`} />}
            label="프로필"
            isActive={activeTab === '프로필'}
            onClick={() => handleTabClick('프로필')}
          />
        </a>
      </Link>
      <Link href="/mypage/statistics" legacyBehavior>
        <a onClick={() => handleTabClick('통계')}>
          <MenuTab
            icon={<ChartBarIcon className={`h-6 w-6 ${activeTab === '통계' ? 'text-yellow-500' : 'text-gray-600'}`} />}
            label="통계"
            isActive={activeTab === '통계'}
            onClick={() => handleTabClick('통계')}
          />
        </a>
      </Link>
      <Link href="/mypage/diary" legacyBehavior>
        <a onClick={() => handleTabClick('다이어리')}>
          <MenuTab
            icon={<BookOpenIcon className={`h-6 w-6 ${activeTab === '다이어리' ? 'text-yellow-500' : 'text-gray-600'}`} />}
            label="다이어리"
            isActive={activeTab === '다이어리'}
            onClick={() => handleTabClick('다이어리')}
          />
        </a>
      </Link>
      <div className='hidden grow bg-white md:block md:h-auto md:rounded-md'></div>
    </div>
  );
};

export default Sidebar;
