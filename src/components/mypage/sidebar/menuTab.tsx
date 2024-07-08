// components/MenuTab.tsx
'use client';

import React from 'react';

interface MenuTabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const MenuTab: React.FC<MenuTabProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer ${
        isActive ? 'bg-gray-200' : ''
      }`}
      onClick={onClick}
    >
      <div className={`mr-4 ${isActive ? 'text-yellow-500' : 'text-gray-600'}`}>
        {icon}
      </div>
      <span className={`hidden md:block ${isActive ? 'font-bold text-black' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
};

export default MenuTab;
