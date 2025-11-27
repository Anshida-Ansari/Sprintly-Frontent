import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SprintlyLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setError('');
    setIsLoading(true);

    // Simulate validation
    setTimeout(() => {
      if (!email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
      } else if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
      } else {
        // Simulate failed login for demo
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl flex items-center justify-between gap-12">
        
        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
          {/* Logo */}
          {/* <div className="flex justify-center mb-6">
            <div className="bg-blue-600 text-white font-bold text-2xl px-5 py-2 rounded-lg">
              Sprintly
            </div>
          </div> */}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back !</h1>
            <p className="text-gray-500 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="admin@sprintly.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
          </div>
        </div>

        {/* Illustration - Hidden on mobile */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <svg viewBox="0 0 400 300" className="w-full h-auto">
              {/* Background Circle */}
              <circle cx="200" cy="150" r="120" fill="#EFF6FF" />
              
              {/* Desk */}
              <rect x="80" y="200" width="240" height="8" rx="4" fill="#3B82F6" />
              
              {/* Laptop */}
              <rect x="140" y="160" width="120" height="80" rx="4" fill="#1E40AF" />
              <rect x="145" y="165" width="110" height="60" rx="2" fill="#60A5FA" />
              <path d="M 120 240 L 280 240 L 270 250 L 130 250 Z" fill="#1E40AF" />
              
              {/* Person */}
              <circle cx="100" cy="140" r="20" fill="#DBEAFE" />
              <path d="M 100 160 Q 100 180 80 200 L 120 200 Q 100 180 100 160" fill="#93C5FD" />
              
              {/* Coffee Cup */}
              <rect x="270" y="190" width="30" height="35" rx="2" fill="#FFF" stroke="#3B82F6" strokeWidth="2" />
              <ellipse cx="285" cy="190" rx="15" ry="4" fill="#3B82F6" />
              <path d="M 300 200 Q 310 200 310 210 Q 310 220 300 220" stroke="#3B82F6" strokeWidth="2" fill="none" />
              
              {/* Checkmarks/Tasks */}
              <circle cx="320" cy="100" r="15" fill="#10B981" opacity="0.9" />
              <path d="M 314 100 L 318 104 L 326 96" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
              
              <circle cx="340" cy="130" r="15" fill="#10B981" opacity="0.9" />
              <path d="M 334 130 L 338 134 L 346 126" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
              
              {/* Decorative Lines */}
              <line x1="60" y1="80" x2="90" y2="80" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              <line x1="60" y1="95" x2="110" y2="95" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            </svg>
            <div className="text-center mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Your Projects</h2>
              <p className="text-gray-600">Track progress, collaborate with teams, and deliver results faster with Sprintly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}