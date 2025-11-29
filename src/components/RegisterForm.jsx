import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import registerHero from '../assets/register-hero.png';

const RegisterForm = ({ onShowLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    age: '',
    gender: '',
    address: '',
    height: '',
    weight: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Get existing users safely
      let users = [];
      try {
        const stored = localStorage.getItem('wellnessUsers');
        users = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(users)) users = [];
      } catch (err) {
        console.error('Error parsing users:', err);
        users = [];
      }

      // Check if user already exists
      if (users.find(user => user.email === formData.email)) {
        // alert('An account with this email already exists!'); // Removed alert
        console.warn('User already exists');
        return;
      }

      // Create new user
      const newUser = {
        ...formData,
        id: Date.now()
      };

      // Save user
      users.push(newUser);
      localStorage.setItem('wellnessUsers', JSON.stringify(users));

      console.log('Registration successful');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join the campus wellness community today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                  placeholder="John Doe"
                />
              </div>
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
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                  placeholder="name@university.edu"
                />
              </div>
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                  placeholder="12345678"
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
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                  placeholder="20"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="2"
                required
                value={formData.address}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                placeholder="123 Campus Dr, Dorm A"
              />
            </div>

            <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  required
                  value={formData.height}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                  placeholder="175"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  required
                  value={formData.weight}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all"
                  placeholder="70"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Create Account
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={registerHero}
          alt="Wellness Community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/40 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Join the Community</h2>
          <p className="text-lg text-teal-100 max-w-md">
            "Wellness is not a 'medical fix' but a way of living - a lifestyle sensitive and responsive to all the dimensions of the body, mind, and spirit."
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;