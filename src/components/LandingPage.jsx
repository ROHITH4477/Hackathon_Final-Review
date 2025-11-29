import React from 'react';
import { Link } from 'react-router-dom';
import heroAthlete from '../assets/hero-athlete.png';
import physicalHealth from '../assets/physical-health.jpg';
import campusWellness from '../assets/campus-wellness.png';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Full Screen Background Image */}
            <div className="absolute inset-0">
                <img
                    className="w-full h-full object-cover"
                    src={heroAthlete}
                    alt="Professional Athlete"
                />
                {/* Dramatic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            </div>

            {/* Content Container - Centered Vertically */}
            <div className="relative z-10 h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24">
                <div className="max-w-4xl animate-fade-in-up">
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6">
                        UNLEASH <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            YOUR POTENTIAL
                        </span>
                    </h1>

                    <p className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-2xl font-light leading-relaxed">
                        Master your mind and body with the ultimate campus wellness platform.
                        Designed for champions, built for you.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/register"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:scale-105 shadow-lg shadow-indigo-500/30"
                        >
                            Start Your Journey
                            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 backdrop-blur-sm hover:scale-105"
                        >
                            Member Login
                        </Link>
                    </div>
                </div>

                {/* Bottom Features Indicator */}
                <div className="absolute bottom-12 left-0 right-0 px-6 sm:px-12 lg:px-24 flex gap-8 text-white/60 text-sm font-medium tracking-wider uppercase">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Physical Tracking
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        Mental Resilience
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Campus Resources
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
