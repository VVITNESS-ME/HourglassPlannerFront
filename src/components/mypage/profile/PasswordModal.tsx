// components/PasswordModal.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from './button';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword === confirmNewPassword) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '비밀번호 변경에 실패하였습니다.');
        }

        // 비밀번호 변경 성공
        console.log('비밀번호가 성공적으로 변경되었습니다.');
        onClose();
      } catch (error) {
        console.error('비밀번호 변경 중 오류 발생:', error);
        alert('비밀번호 변경에 실패하였습니다.');
      }
    } else {
      alert('새 비밀번호가 일치하지 않습니다.');
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
          <div className="fixed inset-0 bg-black bg-opacity-70" />
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
              <Dialog.Panel className="w-[500px] text-3xl transform overflow-hidden rounded-sm bg-white p-6 text-left border-4 border-black align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-4xl font-medium leading-6 text-gray-900">
                  비밀번호 변경
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="password"
                    className="w-full border-4 border-black p-2 rounded mt-2"
                    placeholder="현재 비밀번호를 입력하세요"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full border-4 border-black p-2 rounded mt-2"
                    placeholder="새 비밀번호를 입력하세요"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full border-4 border-black p-2 rounded mt-2"
                    placeholder="새 비밀번호 확인"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    label="취소"
                    onClick={onClose}
                    isActive={false}
                    width="w-auto"
                    height="h-auto"
                  />
                  <Button
                    label="변경"
                    onClick={handlePasswordChange}
                    isActive={true}
                    width="w-auto"
                    height="h-auto"
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

export default PasswordModal;
