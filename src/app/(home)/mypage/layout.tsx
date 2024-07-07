'use client';

import React from 'react';
import Sidebar from '../../../components/mypage/sidebar/sidebar';

export default function MypageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col h-screen md:flex-row md:overflow-hidden">
      <div className='flex-none w-full md:w-64'>
        <Sidebar />
      </div>
      <div className="flex-grow p-8">
        {children}
      </div>
    </div>
  );
}