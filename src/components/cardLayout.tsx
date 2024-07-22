'use client';

import React from 'react';

interface CardLayoutProps {
  title: string;
  children: React.ReactNode;
  width?: string;  // 추가된 width prop
  height?: string; // 추가된 height prop
  color?: string;  // 추가된 color prop
}

const CardLayout: React.FC<CardLayoutProps> = ({ title, children, width = 'w-full', height = 'h-full', color ='bg-console-layout'}) => {
  return (
    <div className={`p-4 ${width} ${height} ${color} rounded-lg`}>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <div className={`overflow-auto ${height} pr-2`}>  {/* 오른쪽 패딩 추가 */}
        {children}
      </div>
    </div>
  );
};

export default CardLayout;
