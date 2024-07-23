'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../mypage/profile/button';
import { useRouter } from 'next/navigation';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose}) => {
  const [title, setTitle] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [limit, setLimit] = useState<number>(4);
  const [secretRoom, setSecretRoom] = useState<boolean>(false);
  const router = useRouter();
  const handleCreateRoom = async () => {
    if (secretRoom&&password==="") return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/together/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: title, isSecretRoom: secretRoom, limit: limit, password: password}),
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        router.push("/together/"+data.data.roomId);
      }
    } catch (error) {
      // alert(error);
      console.error(error);
    }
    // onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={()=>{setTitle("");setLimit(4);setPassword("");setSecretRoom(false);onClose()}}>
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
                  방 생성
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="title"
                    className="w-full p-2 border border-gray-700 rounded mt-2"
                    placeholder="방 제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <Button label='공개' onClick={() => {setPassword("");setSecretRoom(false)}} isActive={!secretRoom} width='w-20' />
                  <Button label='비공개' onClick={() => {setSecretRoom(true)}} isActive={secretRoom} width='w-20' />
                </div>
                <div className="">
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-700 rounded mt-2"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!secretRoom}
                  />
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className='w-20'>제한 인원</div>
                  <Button label='1' onClick={() => {setLimit(1)}} isActive={limit===1} width='w-12' />
                  <Button label='2' onClick={() => {setLimit(2)}} isActive={limit===2} width='w-12' />
                  <Button label='3' onClick={() => {setLimit(3)}} isActive={limit===3} width='w-12' />
                  <Button label='4' onClick={() => {setLimit(4)}} isActive={limit===4} width='w-12' />
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    label="취소"
                    onClick={()=>{setTitle("");setLimit(4);setPassword("");setSecretRoom(false);onClose()}}
                    isActive={false}
                    width="w-20"
                    height="h-10"
                  />
                  <Button
                    label="생성"
                    onClick={title!=''?handleCreateRoom:()=>{}}
                    isActive={true}
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

export default CreateRoomModal;
