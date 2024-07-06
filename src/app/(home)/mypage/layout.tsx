'use client';

import React from 'react';
import Sidebar from '../../../components/mypage/sidebar/sidebar';

export default function MypageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-grow">
      <Sidebar />
      <div className="ml-64 p-4 w-full ">
        {children}
      </div>
    </div>
  );
}