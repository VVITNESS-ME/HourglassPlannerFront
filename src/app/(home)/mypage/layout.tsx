'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/mypage/sidebar/sidebar';

export default function MypageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex">
      <div
        className="fixed left-0 h-full w-full md:w-64 pt-[30px] bg-white z-10"
        style={{left: `${(windowSize.width)/2-500 - 140}px`}}
      >
        <Sidebar />
      </div>
      <div className="flex-1 pt-8 pr-8 pl-8 md:ml-[calc(16rem)]">
        {children}
      </div>
    </div>
  );
}
