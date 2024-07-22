'use client';

import React, { useState } from 'react';
import NicknameModal from './NicknameModal';
import PasswordModal from './PasswordModal';
import SignOutModal from './SignOutModal';
import useAuthStore from '../../../../store/(auth)/authStore';
import { redirect, useRouter } from 'next/navigation';

interface UserInfo {
  userEmail: string;
  userName: string;
}

interface Title {
  id: number;
  name: string;
  achieveCondition: string;
  titleColor: string;
}

interface ProfileCardProps {
  mainTitle: Title | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({mainTitle }) => {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const {username, email} = useAuthStore();
  const router = useRouter()
  const handleLogout = () => {
    logout();
    router.push("/")
  }

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

  return (
    <div className="relative box-border flex-1 w-full bg-[#EEEEEE] border shadow-lg rounded-lg p-6 mb-4">
      <div className=''>
        <div className="flex flex-wrap w-full justify-between text-3xl leading-[60px] text-black mb-4">
          나의 정보
        <button
          onClick={handleLogout}
          className="w-[150px] h-[51px] bg-red-500 rounded-lg text-white text-2xl flex items-center justify-center"
        >
          로그아웃
        </button>
        </div>
      </div>
      <div className="w-full bg-[rgba(223,208,179,0.5)] rounded-2xl p-6">
        <div className="text-2xl leading-[40px] text-black mb-4">
          <div className="flex items-center justify-between mb-2">
            <p><strong>닉네임:</strong> {username}</p>
            <button
              onClick={handleNicknameChange}
              className="w-[70px] h-[38px] bg-[#4C6C73] rounded-lg text-white text-xl flex items-center justify-center"
            >
              변경
            </button>
          </div>
          <p className="mb-2"><strong>이메일:</strong> {email}</p>
          {mainTitle && (
            <p className="mb-2"><strong>칭호:</strong> {mainTitle.name}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handlePasswordChange}
            className="w-[150px] h-[38px] bg-[#4C6C73] rounded-lg text-white text-xl flex items-center justify-center"
          >
            비밀번호 변경
          </button>
          <button
            onClick={handleSignOut}
            className="w-[150px] h-[38px] bg-[#D8A039] rounded-lg text-white text-xl flex items-center justify-center"
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
