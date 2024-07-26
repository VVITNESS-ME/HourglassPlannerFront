// components/button.tsx
'use client';

import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  width?: string;
  height?: string;
  activeColor?: string;
  inactiveColor?: string;
  disabledColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  isActive,
  disabled,
  width = 'w-24',
  height = 'h-auto',
  activeColor = 'bg-sandy-3',
  inactiveColor = 'bg-sandy-1',
  disabledColor = 'bg-gray-400',
}) => {
  return (
    <button
      className={`border-4 border-black ${width} ${height} items-center justify-center p-1 m-1 text-2xl text-black font-semibold border-4 border-black rounded ${
        disabled ? disabledColor : isActive ? activeColor : inactiveColor
      } ${!disabled && !isActive ? 'hover:bg-sandy-2' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
