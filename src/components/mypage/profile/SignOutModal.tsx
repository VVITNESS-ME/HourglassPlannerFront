// components/SignOutModal.tsx
'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from './button';
import useAuthStore from "../../../../store/(auth)/authStore";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void; // Add onSignOut to props
}

const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onSignOut }) => {
  const { logout } = useAuthStore();

  const signout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/delete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "탈퇴에 실패하였습니다.");
      }
      // Successful sign out
      onSignOut();
    } catch (error) {
      alert("회원 탈퇴에 실패하였습니다.");
    }
  };

  const handleSignOut = () => {
    console.log('User signed out');
    signout();
    logout();
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
              <Dialog.Panel className="transform overflow-hidden rounded-sm border-4 border-black bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-4xl font-medium leading-6 text-gray-900">
                  탈퇴하기
                </Dialog.Title>
                <div className="text-3xl mt-2">
                  <p>정말로 탈퇴하시겠습니까? <br/> 탈퇴 후 모든 기록은 되돌릴 수 없습니다.</p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    label="탈퇴"
                    onClick={handleSignOut}
                    isActive={true}
                    width="w-auto"
                    height="h-auto"
                    activeColor="bg-red-500"
                    inactiveColor="bg-red-300"
                  />
                  <Button
                    label="취소"
                    onClick={onClose}
                    isActive={false}
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

export default SignOutModal;
