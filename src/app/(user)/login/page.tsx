"use client";
import Image from "next/image";
import { useState } from 'react';
import useAuthStore from '../../../../store/authStore';

export default function Login() {
  const { login, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }

    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <div className="flex flex-col items-center w-full max-w-md p-8 space-y-8 bg-white border border-gray-200 shadow-md rounded-xl">
      <Image src="/img/logo_binary.png" alt="Hourglass Planner Logo" width={150} height={150} />
      <h1 className="text-2xl font-bold">로그인</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 text-sm border rounded-md bg-yellow-300"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 text-sm border rounded-md bg-yellow-300"
        />

        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="p-2 text-white bg-black rounded-md hover:bg-gray-800"
        >
           {isLoading ? '로그인 중...' : 'Change your life'}
        </button>
      </form>
      <div className="flex items-center w-full mt-4">
        <hr className="w-full border-t border-gray-300" />
        <span className="px-2 text-gray-500">or continue with</span>
        <hr className="w-full border-t border-gray-300" />
      </div>
      <button className="flex items-center justify-center w-full p-2 mt-4 text-sm text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300">
        <Image src="/img/logo_binary.png" alt="Google Logo" width={20} height={20} className="mr-2" />
        Google
      </button>

      <p className="mt-4 text-xs text-gray-500">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
      </p>
    </div>
  </div>
);}
