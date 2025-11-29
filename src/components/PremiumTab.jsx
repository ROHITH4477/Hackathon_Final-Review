import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { generateHealthResponse } from '../services/gemini';

const PremiumTab = ({ currentUser }) => {
    // AI Trainer State
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Personal Trainer. I can help you with workout plans, diet advice, and form checks. What's your goal today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Analytics State
    const [weightData, setWeightData] = useState([]);
    const [consistencyData, setConsistencyData] = useState([]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Mock Data for Charts (In a real app, this would come from logs)
        const mockWeightData = [
            { date: 'Week 1', weight: currentUser.weight ? currentUser.weight + 2 : 70 },
            { date: 'Week 2', weight: currentUser.weight ? currentUser.weight + 1.5 : 69.5 },
            { date: 'Week 3', weight: currentUser.weight ? currentUser.weight + 0.5 : 68.5 },
            { date: 'Week 4', weight: currentUser.weight || 68 },
        ];
        setWeightData(mockWeightData);

        const mockConsistency = [
            { day: 'Mon', workouts: 1 },
            { day: 'Tue', workouts: 1 },
            { day: 'Wed', workouts: 0 },
            { day: 'Thu', workouts: 1 },
            { day: 'Fri', workouts: 1 },
            { day: 'Sat', workouts: 0 },
            { day: 'Sun', workouts: 1 },
        ];
        setConsistencyData(mockConsistency);
    }, [currentUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Use 'drill_sergeant' or 'nutritionist' based on context, or a generic 'trainer'
            // For now, let's use a custom prompt injection for the "Trainer" persona
            const response = await generateHealthResponse(input, 'drill_sergeant');

            // Extract text from the response object
            const responseText = response.text || response;

            const aiMessage = { id: Date.now() + 1, text: responseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Trainer Error:', error);
            const errorMessage = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the gym server. Try again!", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: AI Personal Trainer */}
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden flex flex-col h-[600px]">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        🤖 AI Personal Trainer
                        <span className="bg-yellow-400 text-indigo-900 text-xs px-2 py-0.5 rounded-full font-bold">PREMIUM</span>
                    </h3>
                    <span className="text-indigo-200 text-sm">Powered by Gemini Flash</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about workouts, diet, or form..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Column: Analytics */}
            <div className="space-y-8">
                {/* Weight Trend Chart */}
                <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        📉 Weight Progress
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">Last 4 Weeks</span>
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#4f46e5' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Workout Consistency Chart */}
                <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        🔥 Workout Consistency
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">This Week</span>
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={consistencyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="workouts" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumTab;
