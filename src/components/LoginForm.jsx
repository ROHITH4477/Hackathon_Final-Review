import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import loginHero from '../assets/login-hero.png';

const LoginForm = ({ onLogin, onShowRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // CAPTCHA State
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Generate random CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'; // Excluded confusing chars like I, l, 1, O, 0
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // CAPTCHA Validation
    if (captchaInput !== captchaValue) {
      alert('❌ Incorrect CAPTCHA. Please try again.');
      generateCaptcha(); // Refresh CAPTCHA for security
      setCaptchaInput('');
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('wellnessUsers') || '[]');

    // Check if user exists
    const user = users.find(u => u.email === formData.email);

    if (!user) {
      alert('❌ No account found with this email address.\n\nPlease register first by clicking "Register here" below!');
      return;
    }

    // Check password
    if (user.password === formData.password) {
      localStorage.setItem('currentWellnessUser', JSON.stringify(user));
      // Sync premium status to localStorage for compatibility
      if (user.isPremium) {
        localStorage.setItem('isPremium', 'true');
      } else {
        localStorage.removeItem('isPremium');
      }

      alert('✅ Login successful! Welcome back!');
      onLogin(user);
      navigate('/dashboard', { replace: true });
    } else {
      alert('❌ Incorrect password. Please try again!');
      generateCaptcha(); // Refresh CAPTCHA on failed login
      setCaptchaInput('');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={loginHero}
          alt="Campus Life"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-900/40 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg text-indigo-100 max-w-md">
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your personalized wellness dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="name@university.edu"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* CAPTCHA Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Check
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-3 text-center font-mono text-xl font-bold tracking-widest text-gray-600 select-none"
                    style={{ backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6), linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}
                  >
                    {captchaValue}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors text-gray-600"
                    title="Refresh CAPTCHA"
                  >
                    🔄
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="Enter the code above"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Sign in
              </button>
            </div>

            <div className="text-center mt-4 space-y-2">
              <div>
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Sign up
                </Link>
              </div>
              <div>
                <Link to="/admin-login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Admin Portal
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;