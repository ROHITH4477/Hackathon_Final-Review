import React, { useState } from 'react';
import PsychologyArticles from './PsychologyArticles';
import MentalHealthChatbot from './MentalHealthChatbot';
import MoodTracker from './MoodTracker';
import campusWellness from '../assets/campus-wellness.png';

const MentalHealthTab = () => {
  const [currentFilter, setCurrentFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Full Width */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <img
          src={campusWellness}
          alt="Peaceful Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Mental Resilience & Support</h2>
            <p className="text-indigo-100 text-xl max-w-2xl">
              "Peace comes from within. Do not seek it without."
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">

        {/* AI Psychology Assistant Header */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Psychology Assistant</h3>
              <p className="text-gray-600">Personalized articles based on your needs</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'anxiety', label: 'Anxiety' },
              { id: 'depression', label: 'Depression' },
              { id: 'stress', label: 'Stress' },
              { id: 'relationships', label: 'Relationships' },
              { id: 'self_esteem', label: 'Self-Esteem' },
              { id: 'academic', label: 'Academic Pressure' },
              { id: 'sleep', label: 'Sleep Issues' },
              { id: 'all', label: 'View All' }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setCurrentFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentFilter === category.id
                    ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Display */}
        <PsychologyArticles currentFilter={currentFilter} />

        {/* AI Mental Health Chatbot */}
        <MentalHealthChatbot />

        {/* Additional Mental Health Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Counseling Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              🗣️ Counseling Services
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">Individual Counseling</h4>
                <p className="text-gray-600">One-on-one sessions with licensed counselors</p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-semibold">Group Therapy</h4>
                <p className="text-gray-600">Support groups for various topics</p>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors">
                Schedule Appointment
              </button>
            </div>
          </div>

          {/* Mindfulness Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              🧘‍♀️ Mindfulness & Meditation
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-semibold">Daily Meditation</h4>
                <p className="text-gray-600">Guided sessions every morning at 8 AM</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-semibold">Stress Management</h4>
                <p className="text-gray-600">Workshops on coping strategies</p>
              </div>
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors">
                Start Meditation
              </button>
            </div>
          </div>
        </div>

        {/* Mood Tracker */}
        <MoodTracker />
      </div>
    </div>
  );
};

export default MentalHealthTab;