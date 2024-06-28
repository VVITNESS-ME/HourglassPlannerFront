// pages/signup.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직 처리
    console.log({
      email,
      name,
      password,
      verifyPassword,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center w-full max-w-md p-8 space-y-8 bg-white border border-gray-200 shadow-md rounded-xl">
        <Image src="/img/logo_binary.svg" alt="Hourglass Planner Logo" width={150} height={150} />
        <h1 className="text-2xl font-bold">회원가입</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-sm border rounded-md bg-yellow-300"
          />
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 text-sm border rounded-md bg-yellow-300"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 text-sm border rounded-md bg-yellow-300"
          />
          <input
            type="password"
            placeholder="verify password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            className="p-2 text-sm border rounded-md bg-yellow-300"
          />
          <button
            type="submit"
            className="p-2 text-white bg-black rounded-md hover:bg-gray-800"
          >
            Change your life
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
