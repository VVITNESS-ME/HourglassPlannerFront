'use client';

import React from 'react';

interface CardLayoutProps {
  title: string;
  children: React.ReactNode;
  width?: string;  // 추가된 width prop
  height?: string; // 추가된 height prop
  color?: string;  // 추가된 color prop
}

const CardLayout: React.FC<CardLayoutProps> = ({ title, children, width = 'w-80', height = 'h-full', color ='bg-[#eeeeee]'}) => {
  return (
    <div className={`p-4 w-full h-full ${color} rounded-lg`}>
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className={`overflow-auto ${height} pr-2`}>  {/* 오른쪽 패딩 추가 */}
        {children}
      </div>
    </div>
  );
};

export default CardLayout;
