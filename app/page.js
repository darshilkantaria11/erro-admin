'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    // Fetch credentials from environment variables
    const storedUserId = process.env.NEXT_PUBLIC_ADMIN_USERNAME; // Check that this variable is set correctly in Vercel
    const storedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD; // Correct environment variable names

    if (userId === storedUserId && password === storedPassword) {
      localStorage.setItem('token', 'admin-token');
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-g3">
      <div className="w-full max-w-sm p-6 bg-g1 rounded-lg shadow-lg">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <img 
            src="/Logo.svg" 
            alt="Knottin Daycare Logo" 
            className="w-20 mx-auto mb-3" 
          />
          <h2 className="text-3xl font-bold text-g2">Erroneous Gold</h2>
          <p className="text-xl text-black">Admin Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium text-black">User ID</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your User ID"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter your Password"
              required
            />
          </div>

          {/* Display error message if credentials are incorrect */}
          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-g2 text-white rounded-md shadow-lg hover:bg-g4 focus:outline-none focus:ring-2  focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        {/* Footer */}
       
      </div>
    </div>
  );
}
