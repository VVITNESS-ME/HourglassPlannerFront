'use client';

import React, {useState, useEffect} from 'react';
import Sidebar from '../../../components/mypage/sidebar/sidebar';
import Hourglass from '@/components/hourglass/hourglass';

export default function MypageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col md:flex-row md:overflow-hidden">
      <div className='flex-none w-full md:w-64'>
        <Sidebar  />
      </div>
      <div className="flex p-8">
        {children}
      </div>
    </div>
  );
}