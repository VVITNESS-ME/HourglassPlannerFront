// components/ParticipantList.tsx
'use client';

import React from 'react';
import VideoChat from './VideoChat';

const participants = [
  { name: '원펀맨', time: '04:32', color: 'bg-blue-500' },
  { name: '시작이 반', time: '04:32', color: 'bg-green-500' },
  { name: '망부석', time: '89:32', color: 'bg-yellow-500' },
];

const ParticipantList: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      {participants.map((participant, index) => (
        <div key={index} className={`flex items-center p-2 rounded-lg ${participant.color} text-white`}>
          <VideoChat />
          <div className="ml-2 flex flex-col">
            <span>{participant.name}</span>
            <span>{participant.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantList;
