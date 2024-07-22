// components/NicknameModal.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from './button';

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NicknameModal: React.FC<NicknameModalProps> = ({ isOpen, onClose }) => {
  const [nickname, setNickname] = useState('');
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);

  const handleNicknameChange = async () => {
    // 중복 확인 로직 추가
    // 예시로 fetch API 사용
    try {
      const response = await fetch(`/api/check-duplicate-nickname?nickname=${nickname}`);
      const data = await response.json();
      setIsDuplicate(data.isDuplicate);

      if (!data.isDuplicate) {
        console.log('Nickname changed to:', nickname);
        onClose();
      } else {
        console.log('Nickname is duplicated');
      }
    } catch (error) {
      console.error('Error checking duplicate nickname:', error);
      setIsDuplicate(null);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  닉네임 변경
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-700 rounded mt-2"
                    placeholder="새 닉네임을 입력하세요"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setIsDuplicate(null); // 닉네임 변경 시 중복 상태 초기화
                    }}
                  />
                  {isDuplicate !== null && (
                    <div className={`mt-2 ${isDuplicate ? 'text-red-500' : 'text-green-500'}`}>
                      {isDuplicate ? '닉네임이 중복되었습니다.' : '사용 가능한 닉네임입니다.'}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    label="취소"
                    onClick={onClose}
                    isActive={false}
                    width="w-auto"
                    height="h-10"
                  />
                  <Button
                    label="변경"
                    onClick={handleNicknameChange}
                    isActive={true}
                    width="w-auto"
                    height="h-10"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NicknameModal;
