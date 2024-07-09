'use client';

import React, { useState } from 'react';
import Button from '../profile/button';

interface TilModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TilModal: React.FC<TilModalProps> = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState('알고리즘\n백준 N과M 문제 풀기 완료!\n\n기술스택\n리액트 ZUSTAND 상태관리 대해서 알아봄.');
  const [aiResult, setAiResult] = useState('오늘은 두 가지 중요한 학습을 했다. 먼저, 백준의 N과 M 문제를 풀면서 알고리즘 실력을 쌓았다. 이 문제를 통해 백트래킹 기법을 더 잘 이해하게 되었고, 문제 해결에 성공했다. 또한, 리액트 ZUSTAND 상태관리에 대해 알아보며 상태관리의 중요성을 배웠다.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-yellow-300 rounded-lg p-8 shadow-lg w-full max-w-4xl">
        <h2 className="text-center text-2xl font-bold mb-4">일지 작성 도우미</h2>
        <div className="text-center mb-4">{new Date().toLocaleDateString()} {new Date().toLocaleDateString('ko-KR', { weekday: 'long' })}</div>
        <div className="flex">
          <div className="w-1/4 bg-yellow-400 p-4 rounded-lg mr-4">
            <h3 className="font-bold mb-2">카테고리</h3>
            <ul>
              {['전체', '알고리즘', '기술스택', '운동', '여학', '독서'].map((category) => (
                <li key={category} className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" />
                  <span>{category}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg mr-4">
            <h3 className="text-center font-bold mb-2">Description</h3>
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              label="변환"
              onClick={() => {}}
              isActive={false}
              activeColor="bg-gray-500"
              inactiveColor="bg-gray-400"
              disabledColor="bg-gray-300"
            />
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg">
            <h3 className="text-center font-bold mb-2">AI 취합 결과</h3>
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded"
              value={aiResult}
              readOnly
            />
            <Button
              label="등록"
              onClick={onClose}
              isActive={false}
              activeColor="bg-yellow-600"
              inactiveColor="bg-yellow-500"
              disabledColor="bg-yellow-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TilModal;
