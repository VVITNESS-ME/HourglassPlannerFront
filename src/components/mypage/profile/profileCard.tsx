'use client';

import React from 'react';

interface UserInfo {
  userEmail: string;
  userName: string;
  main_title: bigint;
}

interface Title {
  titleId: bigint;
  name: string;
  description: string;
  color: string;
}

interface ProfileCardProps {
  userInfo: UserInfo | null;
  mainTitle: Title | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userInfo, mainTitle }) => {
  const handleNicknameChange = () => {
    console.log('닉네임 변경');
  };

  const handlePasswordChange = () => {
    console.log('비밀번호 변경');
  };

  const handleSignOut = () => {
    console.log('탈퇴하기');
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative box-border w-[700px] h-[350px] bg-[#EEEEEE] border shadow-lg rounded-lg p-6">
      <div className="absolute left-6 top-4 font-MangoDdobak text-3xl leading-[60px] text-black">
        나의 정보
      </div>
      <div className="absolute w-[650px] h-[250px] left-1/2 transform -translate-x-1/2 top-[75px] bg-[rgba(223,208,179,0.5)] rounded-2xl p-6">
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
    </div>
  );
};

export default ProfileCard;
