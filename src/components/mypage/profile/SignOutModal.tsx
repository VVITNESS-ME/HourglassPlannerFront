// components/SignOutModal.tsx
'use client';

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from './button'; 

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onSignOut }) => {
  const handleSignOut = () => {
    console.log('User signed out');
    onSignOut();
    onClose();
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  탈퇴하기
                </Dialog.Title>
                <div className="mt-2">
                  <p>정말로 탈퇴하시겠습니까? 탈퇴 후 모든 기록은 되돌릴 수 없습니다.</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    label="탈퇴"
                    onClick={handleSignOut}
                    isActive={true}
                    width="w-auto"
                    height="h-10"
                    activeColor="bg-red-500"
                    inactiveColor="bg-red-300"
                  />
                  <Button
                    label="취소"
                    onClick={onClose}
                    isActive={false}
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
}

export default SignOutModal;
