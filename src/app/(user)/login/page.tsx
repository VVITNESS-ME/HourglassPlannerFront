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
    <div className="flex flex-col justify-center items-center">
      <div className="py-10">
        <Image src="/img/logo_binary.svg" alt="Hourglass Logo" width={300} height={300} />
        <div className="flex flex-row">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="email">Email:</label>
              <input
                className="my-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                id="email"
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                className=""
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                required
              />
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              className="login-text px-4 bg-orange-200 rounded"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
