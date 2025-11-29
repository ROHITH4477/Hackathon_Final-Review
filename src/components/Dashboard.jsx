import React, { useState, useEffect } from 'react';
import PhysicalHealthTab from './PhysicalHealthTab';
import MentalHealthTab from './MentalHealthTab';
import ResourcesTab from './ResourcesTab';
import PremiumTab from './PremiumTab';

import dashboardHero from '../assets/dashboard-hero.png';

import RazorpayHandler from './RazorpayHandler';

const Dashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('physical');
  // Check premium status from currentUser object OR localStorage fallback
  const [isPremium, setIsPremium] = useState(currentUser?.isPremium || localStorage.getItem('isPremium') === 'true');

  // Check for membership expiry
  useEffect(() => {
    if (currentUser?.isPremium && currentUser?.premiumExpiryDate) {
      const expiryDate = new Date(currentUser.premiumExpiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      // If expired
      if (daysUntilExpiry <= 0) {
        // Downgrade user
        const updatedUser = { ...currentUser, isPremium: false };
        localStorage.setItem('currentWellnessUser', JSON.stringify(updatedUser));

        // Update main database
        const allUsers = JSON.parse(localStorage.getItem('wellnessUsers') || '[]');
        const updatedAllUsers = allUsers.map(u =>
          u.email === currentUser.email ? { ...u, isPremium: false } : u
        );
        localStorage.setItem('wellnessUsers', JSON.stringify(updatedAllUsers));
        localStorage.removeItem('isPremium');

        setIsPremium(false);
        alert('⚠️ Your Premium Membership has expired!\n\nYour membership ended on ' + expiryDate.toLocaleDateString() + '.\n\nRenew now to continue accessing AI Personal Trainer and Health Analytics.');
      }
      // If expiring within 7 days
      else if (daysUntilExpiry <= 7) {
        console.log(`⏰ Premium membership expiring in ${daysUntilExpiry} day(s)`);
      }
    }
  }, [currentUser]);

  const handlePaymentSuccess = (paymentId) => {
    // 1. Update Local State & Flag
    localStorage.setItem('isPremium', 'true');
    setIsPremium(true);

    // Calculate expiry date (1 year from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const expiryDateString = expiryDate.toISOString();

    // 2. Update Current User Session
    const updatedUser = {
      ...currentUser,
      isPremium: true,
      premiumExpiryDate: expiryDateString
    };
    localStorage.setItem('currentWellnessUser', JSON.stringify(updatedUser));

    // 3. Update Main Database (wellnessUsers)
    const allUsers = JSON.parse(localStorage.getItem('wellnessUsers') || '[]');
    const updatedAllUsers = allUsers.map(u =>
      u.email === currentUser.email ? {
        ...u,
        isPremium: true,
        premiumExpiryDate: expiryDateString,
        premiumActivatedDate: new Date().toISOString()
      } : u
    );
    localStorage.setItem('wellnessUsers', JSON.stringify(updatedAllUsers));

    // 4. Log Payment
    const newPayment = {
      id: paymentId || `pay_${Date.now()}`,
      userEmail: currentUser.email,
      userName: currentUser.name,
      amount: 499,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      expiryDate: expiryDateString,
      status: 'Success'
    };
    const payments = JSON.parse(localStorage.getItem('wellnessPayments') || '[]');
    localStorage.setItem('wellnessPayments', JSON.stringify([newPayment, ...payments]));

    // 5. Notify System
    window.dispatchEvent(new Event('wellnessDataUpdated'));
    alert(`🎉 Welcome to Premium! Payment ID: ${paymentId}\n\nYour account has been upgraded for 1 YEAR.\nExpires on: ${expiryDate.toLocaleDateString()}\n\nYou now have access to AI Personal Trainer and Health Analytics!`);
  };

  const tabs = [
    { id: 'physical', label: 'Physical Health', icon: '💪' },
    { id: 'mental', label: 'Mental Health', icon: '🧠' },
    { id: 'resources', label: 'Resources', icon: '🏥' },
    { id: 'premium', label: '👑 Premium Features', icon: '💎' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'physical':
        return <PhysicalHealthTab currentUser={currentUser} />;
      case 'mental':
        return <MentalHealthTab />;
      case 'resources':
        return <ResourcesTab />;
      case 'premium':
        return isPremium ? <PremiumTab currentUser={currentUser} /> : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-indigo-100">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Premium Access Required</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Unlock the AI Personal Trainer and advanced Health Analytics by upgrading your membership.</p>
            <div className="w-fit mx-auto">
              <RazorpayHandler onPaymentSuccess={handlePaymentSuccess} />
            </div>
          </div>
        );
      default:
        return <PhysicalHealthTab />;
    }
  };

  return (
    <div className="fade-in bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          src={dashboardHero}
          alt="Wellness Journey"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-900/60 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 shadow-sm">
            Welcome to Your Wellness Journey
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl shadow-sm">
            Your complete guide to physical and mental health on campus
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative -mt-20 z-10">

        {/* Premium Banner */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white mb-12 flex flex-col md:flex-row items-center justify-between transform transition hover:scale-[1.01]">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                💎 Unlock Premium Access
              </h3>
              <p className="text-indigo-100 text-lg max-w-xl">
                Get personalized diet plans, workout routines, and unlimited AI consultations for just ₹499.
              </p>
            </div>
            <div className="w-full md:w-auto min-w-[250px]">
              <RazorpayHandler onPaymentSuccess={handlePaymentSuccess} />
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center card-hover"
            style={{ boxShadow: '0 18px 36px rgba(102,126,234,0.18)' }}
          >
            <div className="text-3xl mb-2">💪</div>
            <h3 className="text-lg font-semibold text-gray-900">Physical Health</h3>
            <p className="text-gray-600">Fitness & Nutrition</p>
          </div>
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center card-hover"
            style={{ boxShadow: '0 18px 36px rgba(118,75,162,0.18)' }}
          >
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="text-lg font-semibold text-gray-900">Mental Health</h3>
            <p className="text-gray-600">Mindfulness & Support</p>
          </div>
          <div
            className="bg-white rounded-lg shadow-md p-6 text-center card-hover"
            style={{ boxShadow: '0 18px 36px rgba(255,109,179,0.18)' }}
          >
            <div className="text-3xl mb-2">🏥</div>
            <h3 className="text-lg font-semibold text-gray-900">Health Services</h3>
            <p className="text-gray-600">Campus Resources</p>
          </div>
        </div>


        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div
            className="bg-white rounded-lg shadow-md p-1 flex flex-wrap justify-center"
            style={{ boxShadow: '0 16px 32px rgba(0,0,0,0.08)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content - Full Width */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;