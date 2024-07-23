'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../mypage/profile/button';
import { useRouter } from 'next/navigation';
import useRoomStore from '../../../store/roomStore';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  roomId: number;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose, roomName, roomId }) => {
  const [password, setPassword] = useState('');
  const { setPw } = useRoomStore(state => ({setPw: state.setPw}));
  const router = useRouter();
  const handleJoinRoom = async () => {
    console.log(`Joining room ${roomName} with password: ${password}`);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/together/join/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: password}),
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setPw(password);
        router.push("/together/"+roomId);
      }
    } catch (error) {
      // alert(error);
      console.error(error);
    }
    // onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {setPassword("");onClose()}}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  입장
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-700 rounded mt-2"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    label="취소"
                    onClick={()=>{setPassword("");onClose()}}
                    isActive={false}
                    width="w-20"
                    height="h-10"
                  />
                  <Button
                    label="입장"
                    onClick={handleJoinRoom}
                    isActive={true}
                    disabled={password===''}
                    width="w-20"
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

export default JoinRoomModal;
