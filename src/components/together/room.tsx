// components/.tsx
'use client';

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { FaShuffle } from 'react-icons/fa6';
import RoomList from './roomList';

const Room: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <RoomList />
      <div className="flex justify-center items-center w-full max-w-4xl mt-4 space-x-20">
        <ArrowPathIcon className="h-10 w-10 cursor-pointer" />
        <PlusIcon className="h-10 w-10 cursor-pointer" />
        <FaShuffle className="h-10 w-10 cursor-pointer" />
      </div>
    </div>
  );
};

export default Room;
