import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLoginForm = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        // Hardcoded Admin Credentials
        if (formData.email === 'admin@campus.edu' && formData.password === 'admin123') {
            const adminUser = {
                name: 'System Admin',
                email: 'admin@campus.edu',
                id: 'admin',
                role: 'admin',
                isPremium: true // Admin is always premium
            };
            localStorage.setItem('currentWellnessUser', JSON.stringify(adminUser));
            onLogin(adminUser);
            // Small delay to allow App state to update before routing
            setTimeout(() => {
                navigate('/admin', { replace: true });
            }, 100);
        } else {
            alert('Invalid Admin Credentials');
        }
    };

    const handleQuickLogin = () => {
        setFormData({ email: 'admin@campus.edu', password: 'admin123' });
        // We can't immediately submit because state update is async, 
        // so we'll just call the logic directly with the hardcoded values
        const adminUser = {
            name: 'System Admin',
            email: 'admin@campus.edu',
            id: 'admin',
            role: 'admin',
            isPremium: true
        };
        localStorage.setItem('currentWellnessUser', JSON.stringify(adminUser));
        onLogin(adminUser);
        setTimeout(() => {
            navigate('/admin', { replace: true });
        }, 100);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-xl shadow-2xl border border-slate-700">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center text-2xl">
                        🛡️
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Authorized personnel only
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-500 text-white bg-slate-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Admin Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-500 text-white bg-slate-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Access Dashboard
                        </button>
                    </div>
                </form>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleQuickLogin}
                        className="w-full flex justify-center py-2 px-4 border border-indigo-500 text-sm font-medium rounded-md text-indigo-400 hover:bg-slate-700 transition-colors"
                    >
                        ⚡ Quick Dev Login
                    </button>
                </div>

                <div className="text-center mt-4">
                    <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                        ← Back to Student Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginForm;
