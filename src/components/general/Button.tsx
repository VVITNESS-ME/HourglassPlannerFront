// components/Button.tsx
'use client';

import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, isActive, disabled }) => {
  return (
    <button
      className={`w-24 h-12 p-2 m-2 text-black rounded ${isActive ? 'bg-sandy-3' : 'bg-sandy-1'} ${disabled ? 'bg-gray-400' : 'hover:bg-sandy-2'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
