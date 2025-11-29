import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview'); // overview, users, programs, payments
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [programs, setPrograms] = useState([]); // New state for programs
    const [payments, setPayments] = useState([]); // New state for payments
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeToday: 0,
        totalLogs: 0,
        totalPrograms: 0,
        totalRevenue: 0
    });

    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', studentId: '', isPremium: false });

    // Program Editing State
    const [editingProgram, setEditingProgram] = useState(null); // null = creating new
    const [showProgramModal, setShowProgramModal] = useState(false);
    const [programForm, setProgramForm] = useState({ title: '', exercises: '', note: '' });

    const loadData = () => {
        // Fetch data from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('wellnessUsers') || '[]');
        const storedLogs = JSON.parse(localStorage.getItem('fitnessTrackerLogs') || '[]');
        let storedPrograms = JSON.parse(localStorage.getItem('wellnessPrograms') || '[]');
        const storedPayments = JSON.parse(localStorage.getItem('wellnessPayments') || '[]');

        // Seed initial programs if empty
        if (storedPrograms.length === 0) {
            storedPrograms = [
                { id: 1, title: 'Push (Chest/Shoulders/Triceps) 🔥', exercises: ['Bench Press 4x8-10', 'Overhead Press 3x10', 'Incline DB Press 3x12', 'Lateral Raises 3x15', 'Triceps Pushdowns 3x12'], note: 'Focus on form.' },
                { id: 2, title: 'Pull (Back/Biceps) 💪', exercises: ['Deadlift 3x5', 'Lat Pulldown 4x10', 'Seated Row 3x12', 'Face Pulls 3x15', 'Hammer Curls 3x12'], note: 'Control the eccentric.' },
                { id: 3, title: 'Legs (Quads/Hamstrings/Glutes) 🦵', exercises: ['Squats 4x8', 'Romanian Deadlift 3x10', 'Lunges 3x12/leg', 'Leg Press 3x12', 'Calf Raises 4x15'], note: 'Go deep!' }
            ];
            localStorage.setItem('wellnessPrograms', JSON.stringify(storedPrograms));
        }

        setUsers(storedUsers);
        setPrograms(storedPrograms);
        setPayments(storedPayments);

        // Handle both old object format and new array format for backward compatibility
        let logsArray = [];
        if (Array.isArray(storedLogs)) {
            logsArray = storedLogs;
        } else {
            logsArray = Object.values(storedLogs);
        }

        // Sort logs by date/timestamp descending
        logsArray.sort((a, b) => {
            const dateA = a.timestamp || a.date;
            const dateB = b.timestamp || b.date;
            return dateB > dateA ? -1 : (dateB < dateA ? 1 : 0); // Sort descending
        });

        setLogs(logsArray);

        // Calculate stats
        const today = new Date().toISOString().slice(0, 10);
        const todayLogs = logsArray.filter(log => log.date === today);
        const totalRevenue = storedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        setStats({
            totalUsers: storedUsers.length,
            activeToday: todayLogs.length > 0 ? 'High' : 'Low',
            totalLogs: logsArray.length,
            totalPrograms: storedPrograms.length,
            totalRevenue: totalRevenue
        });
    };

    useEffect(() => {
        loadData();

        // Listen for storage changes (real-time updates across tabs)
        const handleStorageChange = (e) => {
            if (e.key === 'wellnessUsers' || e.key === 'fitnessTrackerLogs' || e.key === 'wellnessPrograms' || e.key === 'wellnessPayments') {
                loadData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Custom event for same-tab updates
        window.addEventListener('wellnessDataUpdated', loadData);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('wellnessDataUpdated', loadData);
        };
    }, []);

    const handleDeleteUser = (email) => {
        if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
            const updatedUsers = users.filter(u => u.email !== email);
            localStorage.setItem('wellnessUsers', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
            setStats(prev => ({ ...prev, totalUsers: updatedUsers.length }));
            window.dispatchEvent(new Event('wellnessDataUpdated'));
        }
    };

    const startEditing = (user) => {
        setEditingUser(user);
        // Check premium status from localStorage key 'isPremium' is per-browser, 
        // but for admin management we should ideally store it in the user object.
        // For now, let's assume we are migrating to storing it in the user object.
        setEditForm({
            name: user.name,
            email: user.email,
            studentId: user.studentId,
            isPremium: user.isPremium || false
        });
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        const updatedUsers = users.map(u =>
            u.email === editingUser.email ? { ...u, ...editForm } : u
        );

        localStorage.setItem('wellnessUsers', JSON.stringify(updatedUsers));

        // Also update the current session if editing self (edge case)
        // And update the separate 'isPremium' key if this user is currently logged in on this browser?
        // No, we can't easily touch other browsers' localStorage. 
        // BUT, the Dashboard checks 'isPremium' from localStorage. 
        // We should update the Dashboard to check the USER object instead.

        setUsers(updatedUsers);
        setEditingUser(null); // Close modal
        alert('User updated successfully!');
        window.dispatchEvent(new Event('wellnessDataUpdated'));
    };

    // Program Management Functions
    const handleSaveProgram = (e) => {
        e.preventDefault();
        const exercisesArray = programForm.exercises.split(',').map(e => e.trim()).filter(e => e);

        let updatedPrograms;
        if (editingProgram) {
            // Update existing
            updatedPrograms = programs.map(p =>
                p.id === editingProgram.id
                    ? { ...p, title: programForm.title, exercises: exercisesArray, note: programForm.note }
                    : p
            );
        } else {
            // Create new
            const newProgram = {
                id: Date.now(),
                title: programForm.title,
                exercises: exercisesArray,
                note: programForm.note
            };
            updatedPrograms = [...programs, newProgram];
        }

        localStorage.setItem('wellnessPrograms', JSON.stringify(updatedPrograms));
        setPrograms(updatedPrograms);
        setShowProgramModal(false);
        setEditingProgram(null);
        setProgramForm({ title: '', exercises: '', note: '' });
        window.dispatchEvent(new Event('wellnessDataUpdated'));
    };

    const handleDeleteProgram = (id) => {
        if (window.confirm('Delete this program?')) {
            const updatedPrograms = programs.filter(p => p.id !== id);
            localStorage.setItem('wellnessPrograms', JSON.stringify(updatedPrograms));
            setPrograms(updatedPrograms);
            window.dispatchEvent(new Event('wellnessDataUpdated'));
        }
    };

    const openProgramModal = (program = null) => {
        if (program) {
            setEditingProgram(program);
            setProgramForm({
                title: program.title,
                exercises: program.exercises.join(', '),
                note: program.note || ''
            });
        } else {
            setEditingProgram(null);
            setProgramForm({ title: '', exercises: '', note: '' });
        }
        setShowProgramModal(true);
    };

    const [viewingUser, setViewingUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const handleViewDetails = (user) => {
        const allProfiles = JSON.parse(localStorage.getItem('fitnessProfiles') || '{}');
        const profile = allProfiles[user.email];
        setViewingUser(user);
        setUserProfile(profile || null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-slate-800 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        🛡️ Admin<span className="text-teal-400">Panel</span>
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                    >
                        📊 Dashboard Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                    >
                        👥 User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('programs')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'programs' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                    >
                        💪 Manage Programs
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                    >
                        💸 Payments
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto relative">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {activeTab === 'overview' && 'System Overview'}
                        {activeTab === 'users' && 'User Management'}
                        {activeTab === 'programs' && 'Workout Programs'}
                        {activeTab === 'payments' && 'Payment History'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            ● System Online
                        </span>
                        <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Stats Grid - Always Visible or only on Overview? Let's keep it on Overview */}
                {activeTab === 'overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-gray-500 text-sm font-medium uppercase mb-2">Total Users</div>
                                <div className="text-4xl font-bold text-slate-800">{stats.totalUsers}</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-gray-500 text-sm font-medium uppercase mb-2">Active Today</div>
                                <div className="text-4xl font-bold text-slate-800">{stats.activeToday}</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-gray-500 text-sm font-medium uppercase mb-2">Total Revenue</div>
                                <div className="text-4xl font-bold text-green-600">₹{stats.totalRevenue}</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-gray-500 text-sm font-medium uppercase mb-2">Programs</div>
                                <div className="text-4xl font-bold text-slate-800">{stats.totalPrograms}</div>
                            </div>
                        </div>

                        {/* Expiring Memberships Alert */}
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                                ⏰ Membership Expiry Alerts
                            </h3>
                            <div className="space-y-2">
                                {users
                                    .filter(u => u.isPremium && u.premiumExpiryDate)
                                    .map(u => {
                                        const expiryDate = new Date(u.premiumExpiryDate);
                                        const today = new Date();
                                        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                                        return { ...u, daysUntilExpiry, expiryDate };
                                    })
                                    .filter(u => u.daysUntilExpiry <= 30)
                                    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
                                    .map((user, index) => (
                                        <div key={index} className={`p-3 rounded-lg border ${user.daysUntilExpiry <= 0 ? 'bg-red-100 border-red-300' : user.daysUntilExpiry <= 7 ? 'bg-orange-100 border-orange-300' : 'bg-yellow-50 border-yellow-200'}`}>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="font-semibold text-gray-900">{user.name}</span>
                                                    <span className="text-gray-600 text-sm ml-2">({user.email})</span>
                                                </div>
                                                <div className="text-right">
                                                    {user.daysUntilExpiry <= 0 ? (
                                                        <span className="text-red-700 font-bold text-sm">❌ EXPIRED</span>
                                                    ) : (
                                                        <span className={`font-semibold text-sm ${user.daysUntilExpiry <= 7 ? 'text-orange-700' : 'text-yellow-700'}`}>
                                                            {user.daysUntilExpiry} day{user.daysUntilExpiry !== 1 ? 's' : ''} left
                                                        </span>
                                                    )}
                                                    <div className="text-xs text-gray-500 mt-1">Expires: {user.expiryDate.toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                {users.filter(u => u.isPremium && u.premiumExpiryDate && Math.ceil((new Date(u.premiumExpiryDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 30).length === 0 && (
                                    <div className="text-center py-4 text-gray-500">
                                        ✅ No memberships expiring in the next 30 days
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Users Table */}
                {(activeTab === 'overview' || activeTab === 'users') && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Registered Users</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Name</th>
                                        <th className="px-6 py-3 font-medium">Email</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Membership</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.length > 0 ? (
                                        users.map((user, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.isPremium ? (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center w-fit gap-1">
                                                            <span>👑</span> Premium
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                                            Standard
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => handleViewDetails(user)} className="text-teal-600 hover:text-teal-900 font-medium">Details</button>
                                                    <button onClick={() => startEditing(user)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                                    <button onClick={() => handleDeleteUser(user.email)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Programs Management Tab */}
                {activeTab === 'programs' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Workout Programs</h3>
                            <button
                                onClick={() => openProgramModal()}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                                + Add Program
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {programs.map(program => (
                                <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group">
                                    <h4 className="font-bold text-lg text-gray-900 mb-2 pr-8">{program.title}</h4>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => openProgramModal(program)} className="text-indigo-600 hover:text-indigo-800">✏️</button>
                                        <button onClick={() => handleDeleteProgram(program.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                                    </div>
                                    <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                        {program.exercises.slice(0, 3).map((ex, i) => (
                                            <li key={i}>• {ex}</li>
                                        ))}
                                        {program.exercises.length > 3 && <li className="text-xs text-gray-400">+{program.exercises.length - 3} more...</li>}
                                    </ul>
                                    {program.note && <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">Note: {program.note}</p>}
                                </div>
                            ))}
                            {programs.length === 0 && (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    No programs found. Create one to get started!
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Payment History</h3>
                            <div className="text-sm text-gray-500">Total Revenue: <span className="font-bold text-green-600">₹{stats.totalRevenue}</span></div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">User</th>
                                        <th className="px-6 py-3 font-medium">Email</th>
                                        <th className="px-6 py-3 font-medium">Amount</th>
                                        <th className="px-6 py-3 font-medium">Payment ID</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {payments.length > 0 ? (
                                        payments.map((payment, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-gray-600">{payment.date}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{payment.userName}</td>
                                                <td className="px-6 py-4 text-gray-600">{payment.userEmail}</td>
                                                <td className="px-6 py-4 font-bold text-green-600">₹{payment.amount}</td>
                                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{payment.id}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                No payments recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit User</h3>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                                    <input
                                        type="text"
                                        value={editForm.studentId}
                                        onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isPremium"
                                        checked={editForm.isPremium}
                                        onChange={(e) => setEditForm({ ...editForm, isPremium: e.target.checked })}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                                        👑 Premium Member
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Program Edit Modal */}
                {showProgramModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-2xl">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">{editingProgram ? 'Edit Program' : 'New Program'}</h3>
                            <form onSubmit={handleSaveProgram} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Program Title</label>
                                    <input
                                        type="text"
                                        value={programForm.title}
                                        onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                                        placeholder="e.g., Push Day (Chest/Triceps)"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Exercises (comma separated)</label>
                                    <textarea
                                        value={programForm.exercises}
                                        onChange={(e) => setProgramForm({ ...programForm, exercises: e.target.value })}
                                        placeholder="Bench Press 3x10, Pushups 3x15, ..."
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-24"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Note</label>
                                    <input
                                        type="text"
                                        value={programForm.note}
                                        onChange={(e) => setProgramForm({ ...programForm, note: e.target.value })}
                                        placeholder="e.g., Focus on form"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowProgramModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Save Program
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Details Modal */}
                {viewingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
                                <button onClick={() => setViewingUser(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">Personal Info</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-gray-500">Name:</span> <span className="font-medium">{viewingUser.name}</span></div>
                                        <div><span className="text-gray-500">Email:</span> <span className="font-medium">{viewingUser.email}</span></div>
                                        <div><span className="text-gray-500">Student ID:</span> <span className="font-medium">{viewingUser.studentId}</span></div>
                                        <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{viewingUser.gender || 'N/A'}</span></div>
                                        <div><span className="text-gray-500">Age:</span> <span className="font-medium">{viewingUser.age || 'N/A'}</span></div>
                                        <div><span className="text-gray-500">Height:</span> <span className="font-medium">{viewingUser.height ? `${viewingUser.height} cm` : 'N/A'}</span></div>
                                        <div><span className="text-gray-500">Weight:</span> <span className="font-medium">{viewingUser.weight ? `${viewingUser.weight} kg` : 'N/A'}</span></div>
                                        <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-medium block mt-1 text-gray-800">{viewingUser.address || 'N/A'}</span></div>
                                    </div>
                                </div>

                                {userProfile ? (
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                        <h4 className="font-semibold text-purple-800 mb-2 border-b border-purple-200 pb-1">Fitness Profile (AI Setup)</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-gray-500">Goal:</span> <span className="font-medium capitalize">{userProfile.goal?.replace('_', ' ')}</span></div>
                                            <div><span className="text-gray-500">Level:</span> <span className="font-medium capitalize">{userProfile.fitnessLevel}</span></div>
                                            <div><span className="text-gray-500">Diet:</span> <span className="font-medium capitalize">{userProfile.diet}</span></div>
                                            <div><span className="text-gray-500">Workouts:</span> <span className="font-medium">{userProfile.workoutDays} days/week</span></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-center">
                                        <p className="text-yellow-700">No AI Fitness Profile found.</p>
                                        <p className="text-xs text-yellow-600 mt-1">User has not completed the AI Setup yet.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setViewingUser(null)}
                                    className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
