import React, { useState, useEffect } from 'react';
import ExerciseLibrary from './ExerciseLibrary';
import AISetup from './AISetup';
import AIPlans from './AIPlans';
import FitnessTracker from './FitnessTracker';
import physicalHealth from '../assets/physical-health.jpg';

const PhysicalHealthTab = ({ currentUser }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [showAISetup, setShowAISetup] = useState(false);
  const [showAIPlans, setShowAIPlans] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const allProfiles = JSON.parse(localStorage.getItem('fitnessProfiles') || '{}');
      const userSpecificProfile = allProfiles[currentUser.email];

      if (userSpecificProfile) {
        setUserProfile(userSpecificProfile);
        setShowAIPlans(true);
        setShowAISetup(false);
      } else {
        // Fallback to global if not found (for legacy support)
        const globalProfile = localStorage.getItem('fitnessProfile');
        if (globalProfile) {
          setUserProfile(JSON.parse(globalProfile));
          setShowAIPlans(true);
          setShowAISetup(false);
        } else {
          // No profile found for current user or globally
          setUserProfile(null);
          setShowAISetup(true);
          setShowAIPlans(false);
        }
      }
    } else {
      // If no current user, clear profile and show setup
      setUserProfile(null);
      setShowAISetup(true);
      setShowAIPlans(false);
    }
  }, [currentUser]);

  const handleProfileCreated = (profile) => {
    setUserProfile(profile);
    setShowAISetup(false);
    setShowAIPlans(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Athlete Image - Full Width */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={physicalHealth}
          alt="Elite Performance"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Elite Performance Tracking</h2>
            <p className="text-gray-200 text-xl max-w-2xl">
              "Your body is your most powerful instrument. Tune it to perfection."
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {showAISetup && !userProfile && (
          <AISetup onProfileCreated={handleProfileCreated} currentUser={currentUser} />
        )}

        {showAIPlans && userProfile && (
          <>
            <AIPlans userProfile={userProfile} />

            {/* Exercise Coaching Library */}
            <div className="mt-12">
              <ExerciseLibrary />
            </div>

            <div className="mt-12">
              <FitnessTracker currentUser={currentUser} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhysicalHealthTab;