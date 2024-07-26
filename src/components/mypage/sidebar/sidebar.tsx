'use client';

import React, { useEffect, useState } from 'react';
import { UserIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import MenuTab from './menuTab';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Hourglass from '@/components/hourglass/hourglass';

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes('/mypage/profile')) {
      setActiveTab('프로필');
    } else if (pathname.includes('/mypage/statistics')) {
      setActiveTab('통계');
    } else if (pathname.includes('/mypage/diary')) {
      setActiveTab('다이어리');
    }
  }, [pathname]);

  return (
    <div className=' h-auto border-4 border-black'>
      <div
        className="flex flex-row justify-between space-x-2 grow md:flex-col md:space-x-0 md:space-y-2 top-20 left-0 bg-wallpaper rounded-sm ">
        <Link href="/mypage/profile" legacyBehavior passHref>
          <a>
            <MenuTab
              icon={<UserIcon className={`h-6 w-6 ${activeTab === '프로필' ? 'text-yellow-500' : 'text-gray-600'}`}/>}
              label="프로필"
              isActive={activeTab === '프로필'}
              onClick={() => {
              }}
            />
          </a>
        </Link>
        <Link href="/mypage/statistics" legacyBehavior passHref>
          <a>
            <MenuTab
              icon={<ChartBarIcon className={`h-6 w-6 ${activeTab === '통계' ? 'text-yellow-500' : 'text-gray-600'}`}/>}
              label="통계"
              isActive={activeTab === '통계'}
              onClick={() => {
              }}
            />
          </a>
        </Link>
        <Link href="/mypage/diary" legacyBehavior passHref>
          <a>
            <MenuTab
              icon={<BookOpenIcon className={`h-6 w-6 ${activeTab === '다이어리' ? 'text-yellow-500' : 'text-gray-600'}`}/>}
              label="다이어리"
              isActive={activeTab === '다이어리'}
              onClick={() => {
              }}
            />
          </a>
        </Link>
        <div className='hidden grow bg-console-layout md:block md:h-auto md:rounded'></div>
      </div>
      <div className="border-t-4 border-black bg-console-layout ">
        <Hourglass width={123}/>
      </div>
    </div>
  );
};

export default Sidebar;
