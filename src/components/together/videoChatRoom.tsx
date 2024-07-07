// pages/VideoChatRoom.tsx
'use client';

import React from 'react';
import ParticipantList from './ParticipantList';
import VideoChat from './VideoChat';
import ScreenDetectionMessage from './ScreenDetectionMessage';
import Hourglass from '../hourglass/hourglass';

const VideoChatRoom: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 p-4 relative">
      <div className="w-1/4">
        <ParticipantList />
      </div>
      <div className="w-2/4 px-4">
        <VideoChat />
      </div>
      <div className="w-1/4">
        <Hourglass />
      </div>
      <div className="absolute bottom-4 w-full flex justify-center">
        <ScreenDetectionMessage />
      </div>
    </div>
  );
};

export default VideoChatRoom;
