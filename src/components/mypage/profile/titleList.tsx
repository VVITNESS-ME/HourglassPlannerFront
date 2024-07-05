// components/TitleList.tsx
'use client';

import React, { useState } from 'react';
import CardLayout from '../../cardLayout';

const TitleList: React.FC = () => {
  const [selectedTitle, setSelectedTitle] = useState<number | null>(null);
  const titles = [
    { name: '망부석', description: '3시간 동안 자리이탈/졸음 없음', color: '#228B22' },
    { name: '원펀맨', description: '운동 카테고리 100시간 달성', color: '#1E90FF' },
    { name: '전 집중 호흡', description: '1시간 동안 자리이탈/졸음 없음', color: '#8A2BE2' },
    { name: '시작이 반', description: '10분 모래시계 완료', color: '#FFD700' },
    { name: '그건 제 잔상입니다만', description: '30분 이내 10회 이상 자리이탈/졸음', color: '#FF69B4' },
  ];

  const handleSelectTitle = (index: number) => {
    setSelectedTitle(index);
  };

  return (
    <CardLayout title="칭호" width="w-96" height="h-auto" color="bg-white">
      <ul className='p-2'>
        {titles.map((title, index) => (
          <li
            key={index}
            className={`p-2 mb-2 text-white rounded flex justify-between items-center cursor-pointer group ${selectedTitle === index ? 'ring-4 ring-yellow-500' : ''}`}
            style={{ backgroundColor: title.color }}
            onClick={() => handleSelectTitle(index)}
          >
            <div>
              <strong>{title.name}</strong> - {title.description}
            </div>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
};

export default TitleList;
