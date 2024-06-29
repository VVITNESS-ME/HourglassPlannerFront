"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';
import useAuthStore from '../../../../store/authStore';
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export default function Login() {
  const token = Cookies.get("token");
  if (token) redirect('/');

  const {login, error, initialize } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSubmit = async (event: React.FormEvent) => {
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
    <div className="flex flex-col items-center justify-center min-h-20 pt-28">
      <div className="flex flex-col items-center w-full max-w-md p-8 space-y-8 bg-mono-1 border-gray-200 shadow-md rounded-xl">
        <Image src="/img/logo_binary.svg" alt="Hourglass Planner Logo" width={250} height={250} />
        <h1 className="text-2xl font-bold">로 그 인</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-sm border rounded-md bg-sandy-1"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 text-sm border rounded-md bg-sandy-1"
          />

          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-white bg-black rounded-md hover:bg-mono-4"
          >
            {isLoading ? '로그인 중...' : 'Change your life'}
          </button>
        </form>
      </div>
    </div>
  );
}
