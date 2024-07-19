'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, LockClosedIcon, EyeIcon } from '@heroicons/react/24/outline';
import JoinRoomModal from './joinRoomModal';
import Button from '../general/button';
import CreateRoomModal from './roomCreateModal';
import Image from 'next/image';

interface Room {
  roomId: number;
  title: string;
  isSecretRoom: boolean;
  limit: number
  participants: number;
}

const RoomList: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const roomsPerPage = 10;

  // 서버에 방 리스트 요청
  const getRoomList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/together/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setRooms(data.data.rooms);
      }
    } catch (error) {
      console.error('Error fetching room list', error);
    }
  };

  useEffect(()=>{
    getRoomList();
  },[])

  const handleRoomClick = (room: Room) => {
    if (room.isSecretRoom) {
      setSelectedRoom(room);
      setIsJoinModalOpen(true);
    } else {
      router.push("/together/"+room.roomId);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(rooms.length / roomsPerPage) - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const paginatedRooms = rooms.slice(currentPage * roomsPerPage, (currentPage + 1) * roomsPerPage);

  return (
    <div className="flex flex-col items-center w-full relative">
      <div className='flex justify-end w-full max-w-3xl mt-2 mb-2 relative' >
        <button className='w-6 h-6 relative' onClick={getRoomList}>
          <Image src="/img/videochat/cycle.png" alt="refresh" fill />
        </button>
      </div>
      <div className="flex justify-center items-center w-full max-w-4xl">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="flex justify-center items-center h-10 w-10 mr-2"
        >
          <ChevronLeftIcon className="h-10 w-10 cursor-pointer" />
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-200 p-4 rounded-lg shadow-lg w-full h-[520px] overflow-hidden relative">
          {Array.from({ length: roomsPerPage }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 bg-yellow-300 rounded-lg shadow-lg cursor-pointer h-20 ${!paginatedRooms[index] ? 'invisible' : ''}`}
              onClick={() => paginatedRooms[index].participants !== paginatedRooms[index].limit && handleRoomClick(paginatedRooms[index])}
            >
              {paginatedRooms[index] && (
                <>
                  <div className="flex items-center">
                    <EyeIcon className="h-6 w-6 mr-2" />
                    <div>
                      <div>{paginatedRooms[index].title}</div>
                      {paginatedRooms[index].participants !== paginatedRooms[index].limit?<div className="text-sm text-gray-600">{paginatedRooms[index].participants}/{paginatedRooms[index].limit}</div>
                      :<div className="text-sm text-red-600">{paginatedRooms[index].participants}/{paginatedRooms[index].limit}</div>}
                    </div>
                  </div>
                  {paginatedRooms[index].isSecretRoom && <LockClosedIcon className="h-6 w-6 text-gray-600" />}
                </>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= Math.ceil(rooms.length / roomsPerPage) - 1}
          className="flex justify-center items-center h-10 w-10 ml-2"
        >
          <ChevronRightIcon className="h-10 w-10 cursor-pointer" />
        </button>
      </div>
      {selectedRoom && (
        <JoinRoomModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          roomName={selectedRoom.title}
          roomId={selectedRoom.roomId}
        />
      )}
      <div className='mt-4'>
        <Button label='방 생성' isActive onClick={() => setIsCreateModalOpen(true)} />
      </div>
      <CreateRoomModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default RoomList;
