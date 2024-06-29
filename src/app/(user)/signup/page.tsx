'use client';

import Image from 'next/image';
import { useState } from 'react';
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const SignUp = () => {
  const token = Cookies.get("token");
  if (token) redirect('/');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== verifyPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }

      setSuccess('Sign up successful!');
      setEmail('');
      setName('');
      setPassword('');
      setVerifyPassword('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Sign up failed');
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-20 pt-28">
      <div className="flex flex-col items-center w-full max-w-md p-8 space-y-8 bg-mono-1 border border-gray-200 shadow-md rounded-xl">
        <Image src="/img/logo_binary.svg" alt="Hourglass Planner Logo" width={250} height={250} />
        <h1 className="text-2xl font-bold">회 원 가 입</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-sm border rounded-md bg-sandy-1"
          />
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 text-sm border rounded-md bg-sandy-1"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 text-sm border rounded-md bg-sandy-1"
          />
          <input
            type="password"
            placeholder="verify password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            className="p-2 text-sm border rounded-md bg-sandy-1"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-white bg-black rounded-md hover:bg-mono-4"
          >
            {isLoading ? 'Signing up...' : 'Change your life'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
