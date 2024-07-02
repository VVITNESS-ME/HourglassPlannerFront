// components/button.tsx
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
      className={`w-24 h-12 p-2 m-2 text-black rounded ${disabled ? 'bg-mono-2' : 'hover:bg-sandy-2'} ${isActive ? 'bg-sandy-3' : 'bg-sandy-1'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
