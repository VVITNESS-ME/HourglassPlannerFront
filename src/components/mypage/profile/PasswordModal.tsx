// components/PasswordModal.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from './button'

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handlePasswordChange = () => {
    if (newPassword === confirmNewPassword) {
      // 실제 비밀번호 변경 로직을 여기에 추가
      console.log('Current Password:', currentPassword);
      console.log('New Password:', newPassword);
      onClose();
    } else {
      console.log('Passwords do not match');
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
                  비밀번호 변경
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-700 rounded mt-2"
                    placeholder="현재 비밀번호를 입력하세요"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-700 rounded mt-2"
                    placeholder="새 비밀번호를 입력하세요"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-700 rounded mt-2"
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
                    height="h-10"
                  />
                  <Button
                    label="변경"
                    onClick={handlePasswordChange}
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

export default PasswordModal;
