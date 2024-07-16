// components/.tsx
'use client';

import React, {useEffect} from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { FaShuffle } from 'react-icons/fa6';
import RoomList from './roomList';
import useRoomStore from '../../../store/roomStore';
import { useRouter, useParams } from 'next/navigation';

const Room: React.FC = () => {
  const params = useParams();
  const roomId = params?.room_id;
  const {roomPassword} = useRoomStore(pw => ({roomPassword: pw.roomPassword}));
  const router = useRouter();
  const checkValid = async (roomPassword:string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/together/join/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: roomPassword}),
        credentials: 'include',
      });
      const data = response.json();
      console.log(data);
      if (response.ok) {
        console.log("입장 확인")
        // 이후 소켓 연결
      } else {router.push("/together")}
    }
    catch (error) {
      router.push("/together");
    }
  }

  useEffect(()=>{checkValid(roomPassword)},[])

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <RoomList />
      <div className="flex justify-center items-center w-full max-w-4xl mt-4 space-x-20">
        <ArrowPathIcon className="h-10 w-10 cursor-pointer" />
        <PlusIcon className="h-10 w-10 cursor-pointer" />
        <FaShuffle className="h-10 w-10 cursor-pointer" />
      </div>
    </div>
  );
};

export default Room;
