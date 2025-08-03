
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
            <header className="p-4 flex items-center justify-between bg-[#1a1a3d]/50 backdrop-blur-sm shrink-0">
                <button onClick={onBack} className="text-2xl font-bold p-2 -ml-2" aria-label="Back to chat list">&#x2190;</button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-bold text-xl">{chat.avatar}</div>
                    <div>
                        <div className="font-bold">{chat.name}</div>
                        <div className="text-xs text-green-400">Time: {formatTime(chat.timeRemaining)}</div>
                    </div>
                </div>
                <button onClick={() => onEndChat(chat)} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition">End Chat</button>
            </header>

            {/* Messages */}
            <main className="flex-grow p-4 overflow-y-auto space-y-4">
                {chat.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{chat.avatar}</div>}
                        <div className={`max-w-xs p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'admin' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 text-right ${msg.sender === 'admin' ? 'text-indigo-200' : 'text-gray-500'}`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            {/* Input */}
            <footer className="p-4 bg-[#1a1a3d]/50 backdrop-blur-sm shrink-0">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
                        placeholder="Type your message..."
                        aria-label="Chat message input"
                        className="flex-grow p-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                        onClick={handleSendClick}
                        aria-label="Send message"
                        className="p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition flex-shrink-0 flex items-center justify-center w-12 h-12"
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
