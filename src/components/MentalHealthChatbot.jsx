import React, { useState, useEffect, useRef } from 'react';
import { generateHealthResponse } from '../services/gemini';

const MentalHealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your AI Health & Wellness Companion. I can help with:\n\n🍎 Nutrition & Diet\n💊 Common Ailments (Flu, Headache, etc.)\n💪 Fitness Advice\n🧠 Mental Well-being\n\n*Note: I am an AI, not a doctor. For emergencies, call 911.*",
      isUser: false,
      type: 'intro'
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [persona, setPersona] = useState('general');
  const messagesEndRef = useRef(null);

  // Check Premium/Admin status
  const isPremium = localStorage.getItem('isPremium') === 'true';
  const currentUser = JSON.parse(localStorage.getItem('currentWellnessUser') || '{}');
  const isAdmin = currentUser.email === 'admin@wellness.com'; // Simple check
  const canUsePersonas = isPremium || isAdmin;

  const personas = [
    { id: 'general', name: '🤖 General Assistant', locked: false },
    { id: 'drill_sergeant', name: '🪖 Drill Sergeant', locked: !canUsePersonas },
    { id: 'empathetic', name: '🧘 Empathetic Coach', locked: !canUsePersonas },
    { id: 'nutritionist', name: '🥗 Nutritionist', locked: !canUsePersonas },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // 1. Check for Critical Emergencies LOCALLY (Zero Latency)
    const emergencyKeywords = ['suicide', 'kill myself', 'die', 'heart attack', 'stroke', 'chest pain', 'difficulty breathing', 'severe bleeding'];
    const lowerInput = input.toLowerCase();
    const isEmergency = emergencyKeywords.some(keyword => lowerInput.includes(keyword));

    if (isEmergency) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: "🚨 **EMERGENCY ALERT** 🚨\n\nIt sounds like you are in a critical situation. Please stop using this app and:\n\n📞 **Call 911 or your local emergency number IMMEDIATELY.**\n\nIf you are in mental health crisis:\n📞 **Call 988 (Suicide & Crisis Lifeline)**\n\nPlease get professional help right now.",
        isUser: false,
        type: 'emergency'
      }]);
      return;
    }

    // 2. Use Gemini API for all other queries
    // Pass the selected persona
    const result = await generateHealthResponse(input, persona);

    setIsTyping(false);
    setMessages(prev => [...prev, {
      text: result.text,
      isUser: false,
      type: result.isError ? 'error' : 'advice'
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-110 flex items-center gap-2"
        >
          <span className="text-2xl">🤖</span>
          <span className="font-medium pr-2">AI Health Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 max-h-[600px] flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-teal-600 p-4 text-white">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <span className="text-xl">🏥</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Health Companion</h3>
                  <p className="text-teal-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online • Powered by Gemini
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-teal-100 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Persona Selector */}
            <div className="relative">
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full bg-teal-700/50 border border-teal-500 text-white text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none cursor-pointer"
              >
                {personas.map(p => (
                  <option key={p.id} value={p.id} disabled={p.locked}>
                    {p.locked ? '🔒 ' : ''}{p.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-teal-200 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${msg.isUser
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : msg.type === 'emergency'
                      ? 'bg-red-100 text-red-800 border border-red-200 rounded-bl-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}
                >
                  {msg.type === 'emergency' && (
                    <div className="flex items-center gap-2 mb-2 font-bold text-red-600">
                      <span>🚨</span> CRITICAL ALERT
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about health, diet, or symptoms..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white p-2 rounded-full shadow-md transition-colors flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">
                ⚠️ AI can make mistakes. Consult a doctor for medical advice.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MentalHealthChatbot;