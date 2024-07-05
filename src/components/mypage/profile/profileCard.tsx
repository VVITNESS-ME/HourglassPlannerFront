// components/ProfileCard.tsx
'use client';

import React from 'react';
import CardLayout from '../../cardLayout';
import Button from './button';

const ProfileCard: React.FC = () => {
  const handleNicknameChange = () => {
    console.log('닉네임 변경');
  };

  const handlePasswordChange = () => {
    console.log('비밀번호 변경');
  };

  const handleSignOut = () => {
    console.log('탈퇴하기');
  };

  return (
    <CardLayout title="나의 정보" width="w-full" height="h-auto" color="bg-gray-100">
      <div className="p-4">
        <p className="mb-2"><strong>닉네임:</strong> sandglassMaster</p>
        <p className="mb-4"><strong>이메일:</strong> sand@glass.com</p>
        <div className="flex justify-center">
          <Button
            label="닉네임 변경"
            onClick={handleNicknameChange}
            isActive={false}
            width="w-32"
            height="h-10"
            activeColor="bg-blue-500"
            inactiveColor="bg-blue-300"
            disabledColor="bg-gray-300"
          />
          <Button
            label="비밀번호 변경"
            onClick={handlePasswordChange}
            isActive={false}
            width="w-32"
            height="h-10"
            activeColor="bg-green-500"
            inactiveColor="bg-green-300"
            disabledColor="bg-gray-300"
          />
          <Button
            label="탈퇴하기"
            onClick={handleSignOut}
            isActive={false}
            width="w-32"
            height="h-10"
            activeColor="bg-red-500"
            inactiveColor="bg-red-300"
            disabledColor="bg-gray-300"
          />
        </div>
      </div>
    </CardLayout>
  );
};

export default ProfileCard;
