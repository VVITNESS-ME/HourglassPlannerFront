'use client';

import React, { useState } from 'react';
import NicknameModal from './NicknameModal';
import PasswordModal from './PasswordModal';
import SignOutModal from './SignOutModal';

interface UserInfo {
  userEmail: string;
  userName: string;
}

interface Title {
  titleId: number;
  name: string;
  description: string;
  color: string;
}

interface ProfileCardProps {
  userInfo: UserInfo | null;
  mainTitle: Title | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userInfo, mainTitle }) => {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleNicknameChange = () => {
    setIsNicknameModalOpen(true);
    console.log('닉네임 변경');
  };

  const handlePasswordChange = () => {
    setIsPasswordModalOpen(true);
    console.log('비밀번호 변경');
  };

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
    console.log('탈퇴하기');
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative box-border flex-1 min-w-[400px] max-w-[700px] bg-[#EEEEEE] border shadow-lg rounded-lg p-6 mb-4">
      <div className="font-MangoDdobak text-3xl leading-[60px] text-black mb-4">
        나의 정보
      </div>
      <div className="w-full bg-[rgba(223,208,179,0.5)] rounded-2xl p-6">
        <div className="font-MangoDdobak text-2xl leading-[40px] text-black mb-4">
          <div className="flex items-center justify-between mb-2">
            <p><strong>닉네임:</strong> {userInfo.userName}</p>
            <button
              onClick={handleNicknameChange}
              className="w-[190px] h-[51px] bg-[#4C6C73] rounded-lg text-white text-2xl font-MangoDdobak flex items-center justify-center"
            >
              닉네임 변경
            </button>
          </div>
          <p className="mb-2"><strong>이메일:</strong> {userInfo.userEmail}</p>
          {mainTitle && (
            <p className="mb-2"><strong>칭호:</strong> {mainTitle.name}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handlePasswordChange}
            className="w-[226px] h-[51px] bg-[#4C6C73] rounded-lg text-white text-2xl font-MangoDdobak flex items-center justify-center"
          >
            비밀번호 변경
          </button>
          <button
            onClick={handleSignOut}
            className="w-[166px] h-[51px] bg-[#D8A039] rounded-lg text-white text-2xl font-MangoDdobak flex items-center justify-center"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      <NicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
      />
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onSignOut={() => console.log('User signed out')}
      />
    </div>
  );
};

export default ProfileCard;
