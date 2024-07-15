'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, LockClosedIcon, EyeIcon } from '@heroicons/react/24/outline';
import JoinRoomModal from './joinRoomModal';

interface Room {
  roomId: number;
  title: string;
  isSecretRoom: boolean;
  limit: number
  participants: number;
}

const defaultRooms: Room[] = [
  // try get: /together/list => if response success, JSON.parse(data), else redirect to rootpage
  {roomId: 1,title: '그래프 알고리즘 공부하실분~', isSecretRoom: true, limit: 4, participants: 3},
  {roomId: 2,title: '같이 청소년 상어 푸실실 비법: 문제풀이', isSecretRoom: false, limit: 4, participants: 1},
  {roomId: 3, title: '서로 감시하는 스터디 카페 (결과만 봄)', isSecretRoom: true, limit: 4, participants: 3},
  {roomId: 4, title: '질문/취업 고민 공유방', isSecretRoom: false, limit: 4, participants: 3},
  {roomId: 5, title: 'ALL DAY 공부방', isSecretRoom: true, limit: 4, participants: 2},
  {roomId: 6, title: '마지막까지 남으실분 기프티콘 드려요', isSecretRoom: true, limit: 4, participants: 4},
  {roomId: 7,title: '아무거나 모각코 하는 방', isSecretRoom: true, limit: 4, participants: 1},
  {roomId: 8, title: '추가 방 1', isSecretRoom: false, limit: 4, participants: 3},
  {roomId: 9, title: '추가 방 2', isSecretRoom: true, limit: 4, participants: 2},
  {roomId: 10, title: '추가 방 3', isSecretRoom:false, limit: 4, participants: 3},
  {roomId: 11, title: '추가 방 4', isSecretRoom: true, limit: 4, participants: 3},
  {roomId: 12, title: '추가 방 5', isSecretRoom: false, limit: 3, participants: 3},
];

const RoomList: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>(defaultRooms);
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
  })

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
                      <div className="text-sm text-gray-600">{paginatedRooms[index].participants}/{paginatedRooms[index].limit}</div>
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
    </div>
  );
};

export default RoomList;
