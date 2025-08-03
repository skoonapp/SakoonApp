
import React, { useState } from 'react';
import { ActiveChat, WaitingChat, ChatHistoryItem, ChatMessage } from '../../types';

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

const ActiveChatCard: React.FC<{ chat: ActiveChat, onViewChat: (chatId: number) => void }> = ({ chat, onViewChat }) => {
    const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
    const lastMessageText = lastMessage ? (lastMessage.sender === 'admin' ? 'You: ' : '') + lastMessage.text : 'Chat has started.';
    
    return (
        <div
            onClick={() => onViewChat(chat.id)}
            className="bg-gradient-to-br from-indigo-500/80 to-purple-500/80 p-4 rounded-2xl shadow-lg border border-indigo-400/50 mb-4 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-300"
            role="button"
            aria-label={`Open chat with ${chat.name}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center font-bold text-2xl text-white flex-shrink-0">{chat.avatar}</div>
                    <div className="overflow-hidden">
                        <div className="text-xl font-bold text-white truncate">{chat.name}</div>
                        <p className="text-xs text-white/80 truncate">{lastMessageText}</p>
                    </div>
                </div>
                <div className="text-right text-white flex-shrink-0 ml-2">
                    <div className="text-xs opacity-80">Time Left</div>
                    <div className="text-lg font-bold">{formatTime(chat.timeRemaining)}</div>
                </div>
            </div>
        </div>
    );
};


const WaitingChatCard: React.FC<{ chat: WaitingChat, onStartChat: (chat: WaitingChat) => void }> = ({ chat, onStartChat }) => (
    <div className="bg-gradient-to-br from-orange-400/80 to-yellow-400/80 p-4 rounded-2xl shadow-lg mb-3 flex items-center">
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-bold text-xl text-white mr-4">{chat.avatar}</div>
        <div className="flex-grow text-white">
            <div className="font-bold">{chat.name}</div>
            <div className="text-xs opacity-90 truncate">{chat.plan}</div>
            <div className="text-xs opacity-90">Waiting for: {formatTime(chat.waitingTime)}</div>
        </div>
        <button onClick={() => onStartChat(chat)} className="py-2 px-5 rounded-full text-white font-bold animate-glow-orange transition">
            Start Chat
        </button>
    </div>
);

const HistoryItem: React.FC<{ item: ChatHistoryItem }> = ({ item }) => (
    <div className="bg-white/10 p-3 rounded-lg flex items-center mb-2 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-purple-500/50 flex items-center justify-center font-bold text-sm mr-3">{item.avatar}</div>
        <div className="flex-grow text-white/90 text-sm">
            <div className="font-semibold">{item.name}</div>
            <div className="text-xs opacity-70">{item.plan} - Duration: {item.duration}</div>
        </div>
    </div>
);


interface ChatManagementScreenProps {
    activeChats: ActiveChat[];
    waitingChats: WaitingChat[];
    chatHistory: ChatHistoryItem[];
    onStartChat: (chat: WaitingChat) => void;
    onEndChat: (chat: ActiveChat) => void;
    onViewChat: (chatId: number) => void;
}

const ChatManagementScreen: React.FC<ChatManagementScreenProps> = ({ activeChats, waitingChats, chatHistory, onStartChat, onEndChat, onViewChat }) => {
    return (
        <div className="p-4 text-white">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Chats</h2>
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                    <span>Online</span>
                </div>
            </div>
            
            <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Active Chats ({activeChats.length})</h3>
                {activeChats.length > 0 ? (
                    activeChats.map(chat => <ActiveChatCard key={chat.id} chat={chat} onViewChat={onViewChat} />)
                ) : (
                    <p className="text-center text-white/50 text-sm py-4">No active chats.</p>
                )}
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Waiting Queue ({waitingChats.length})</h3>
                 {waitingChats.length > 0 ? (
                    waitingChats.map(chat => <WaitingChatCard key={chat.id} chat={chat} onStartChat={onStartChat} />)
                ) : (
                    <p className="text-center text-white/50 text-sm py-4">No users waiting for chat.</p>
                )}
            </div>

            <div>
                <h3 className="font-bold text-lg mb-3">Chat History</h3>
                <div className="max-h-60 overflow-y-auto pr-2">
                    {chatHistory.length > 0 ? (
                        chatHistory.map(item => <HistoryItem key={item.id} item={item} />)
                    ) : (
                         <p className="text-center text-white/50 text-sm py-4">No chat history yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatManagementScreen;