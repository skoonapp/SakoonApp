
export type Screen = 'dashboard' | 'call' | 'chat' | 'settings';

export interface User {
  name: string;
  id: string;
}

export type ActivityStatus = 'Active' | 'Waiting' | 'Completed';

export interface RecentActivity {
    id: number;
    avatar: string;
    name: string;
    plan: string;
    status: ActivityStatus;
    timestamp: string;
}

export interface AdminStats {
  activeCalls: number;
  activeChats: number;
  waitingQueue: number;
  todaysRevenue: number;
}

// Call Management types
export interface ActiveCall {
    id: number;
    name: string;
    planDuration: number; // in seconds
    timeRemaining: number; // in seconds
    avatar: string;
}

export interface WaitingCall {
    id: number;
    name: string;
    plan: string;
    waitingTime: number; // in seconds
    avatar: string;
}

export interface CallHistoryItem {
    id: number;
    name: string;
    plan: string;
    duration: string;
    avatar: string;
}

// Chat Management types
export interface ChatMessage {
    id: number;
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
}

export interface ActiveChat {
    id: number;
    name: string;
    planDuration: number; // in seconds
    timeRemaining: number; // in seconds
    avatar: string;
    messages: ChatMessage[];
}

export interface WaitingChat {
    id: number;
    name: string;
    plan: string;
    waitingTime: number; // in seconds
    avatar: string;
}

export interface ChatHistoryItem {
    id: number;
    name: string;
    plan: string;
    duration: string;
    avatar: string;
}