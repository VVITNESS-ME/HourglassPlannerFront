'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, LockClosedIcon, EyeIcon } from '@heroicons/react/24/outline';
import JoinRoomModal from './joinRoomModal';

interface Room {
  roomId: BigInt;
  title: string;
  status: string;
  participants: string;
  path: string;
}

const rooms: Room[] = [
  { roomId: BigInt(1),title: '그래프 알고리즘 공부하실분~', status: 'locked', participants: '3/4', path: '/rooms/graph-algorithm' },
  { roomId: BigInt(2),title: '같이 청소년 상어 푸실실 비법: 문제풀이', status: 'open', participants: '3/4', path: '/rooms/youth-study' },
  {roomId: BigInt(3), title: '서로 감시하는 스터디 카페 (결과만 봄)', status: 'locked', participants: '3/4', path: '/rooms/study-cafe' },
  {roomId: BigInt(4), title: '질문/취업 고민 공유방', status: 'open', participants: '3/4', path: '/rooms/job-discussion' },
  {roomId: BigInt(5), title: 'ALL DAY 공부방', status: 'locked', participants: '3/4', path: '/rooms/all-day-study' },
  {roomId: BigInt(6), title: '마지막까지 남으실분 기프티콘 드려요', status: 'open', participants: '3/4', path: '/rooms/gifticon' },
  { roomId: BigInt(7),title: '아무거나 모각코 하는 방', status: 'locked', participants: '3/4', path: '/rooms/anything' },
  {roomId: BigInt(8), title: '추가 방 1', status: 'open', participants: '3/4', path: '/rooms/additional-room-1' },
  {roomId: BigInt(9), title: '추가 방 2', status: 'locked', participants: '3/4', path: '/rooms/additional-room-2' },
  {roomId: BigInt(10), title: '추가 방 3', status: 'open', participants: '3/4', path: '/rooms/additional-room-3' },
  {roomId: BigInt(11), title: '추가 방 4', status: 'locked', participants: '3/4', path: '/rooms/additional-room-4' },
  {roomId: BigInt(12), title: '추가 방 5', status: 'open', participants: '3/4', path: '/together/12' },
];

const RoomList: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const roomsPerPage = 10;

  const handleRoomClick = (room: Room) => {
    if (room.status === 'locked') {
      setSelectedRoom(room);
      setIsJoinModalOpen(true);
    } else {
      router.push(room.path);
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
              onClick={() => paginatedRooms[index] && handleRoomClick(paginatedRooms[index])}
            >
              {paginatedRooms[index] && (
                <>
                  <div className="flex items-center">
                    <EyeIcon className="h-6 w-6 mr-2" />
                    <div>
                      <div>{paginatedRooms[index].title}</div>
                      <div className="text-sm text-gray-600">{paginatedRooms[index].participants}</div>
                    </div>
                  </div>
                  {paginatedRooms[index].status === 'locked' && <LockClosedIcon className="h-6 w-6 text-gray-600" />}
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
        />
      )}
    </div>
  );
};

export default RoomList;
