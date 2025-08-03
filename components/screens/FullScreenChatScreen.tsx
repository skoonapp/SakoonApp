import React, { useState, useEffect, useRef } from 'react';
import { ActiveChat, ChatMessage } from '../../types';

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

interface FullScreenChatScreenProps {
    chat: ActiveChat;
    onSendMessage: (chatId: number, text: string) => void;
    onEndChat: (chat: ActiveChat) => void;
    onBack: () => void;
}

const FullScreenChatScreen: React.FC<FullScreenChatScreenProps> = ({ chat, onSendMessage, onEndChat, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [chat.messages]);

    const handleSendClick = () => {
        if (newMessage.trim()) {
            onSendMessage(chat.id, newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="fixed inset-0 max-w-md mx-auto flex flex-col bg-gradient-to-br from-[#0a0f2c] to-[#1a1a3d] text-white z-50">
            {/* Header */}
            <header className="p-4 flex items-center justify-between bg-[#1a1a3d]/50 backdrop-blur-sm shrink-0 border-b border-white/10">
                <button onClick={onBack} className="text-2xl font-bold p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Back to chat list">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-bold text-xl">{chat.avatar}</div>
                    <div>
                        <div className="font-bold">{chat.name}</div>
                        <div className="text-xs text-green-400 font-mono">Time: {formatTime(chat.timeRemaining)}</div>
                    </div>
                </div>
                <button onClick={() => onEndChat(chat)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-transform hover:scale-105 active:scale-95">End Chat</button>
            </header>

            {/* Messages */}
            <main className="flex-grow p-4 overflow-y-auto space-y-4">
                {chat.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">{chat.avatar}</div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl text-sm leading-relaxed shadow-md ${msg.sender === 'admin' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none' : 'bg-white/10 backdrop-blur-sm border border-white/10 text-gray-200 rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 text-right ${msg.sender === 'admin' ? 'text-indigo-200/80' : 'text-gray-400/80'}`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            {/* Input */}
            <footer className="p-2 sm:p-4 bg-[#1a1a3d]/50 backdrop-blur-sm shrink-0 border-t border-white/10">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
                        placeholder="Type a message..."
                        aria-label="Chat message input"
                        className="flex-grow min-w-0 p-3 rounded-full bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                    <button
                        onClick={handleSendClick}
                        aria-label="Send message"
                        className="p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all flex-shrink-0 flex items-center justify-center aspect-square h-12 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
                        disabled={!newMessage.trim()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default FullScreenChatScreen;