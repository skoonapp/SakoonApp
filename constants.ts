import { RecentActivity, ActiveCall, WaitingCall, CallHistoryItem, ActiveChat, WaitingChat, ChatHistoryItem as ChatHistoryType } from './types';

export const ZEGO_APP_ID = 1150186913;
// NOTE: In a production environment, a token should be generated on a server with a ServerSecret.
// For this example, we use a token-less setup which is insecure and for development only.


export const INITIAL_RECENT_ACTIVITIES: RecentActivity[] = [
    { id: 1, avatar: 'R', name: 'Riya', plan: '15 min Chat', status: 'Completed', timestamp: '2 min ago' },
    { id: 2, avatar: 'A', name: 'Amit', plan: '10 min Call', status: 'Active', timestamp: '5 min ago' },
    { id: 3, avatar: 'S', name: 'Sonia', plan: '30 min Chat', status: 'Waiting', timestamp: '8 min ago' },
    { id: 4, avatar: 'V', name: 'Vikram', plan: '5 min Call', status: 'Completed', timestamp: '10 min ago' },
];

// Call Management constants
export const INITIAL_ACTIVE_CALLS: ActiveCall[] = [
  { id: 101, name: 'Priya Sharma', planDuration: 900, timeRemaining: 750, avatar: 'P' },
];

export const INITIAL_WAITING_CALLS: WaitingCall[] = [
  { id: 201, name: 'Rahul Verma', plan: '10 min Call', waitingTime: 125, avatar: 'R' },
  { id: 202, name: 'Sneha Patel', plan: '5 min Call', waitingTime: 45, avatar: 'S' },
];

export const INITIAL_CALL_HISTORY: CallHistoryItem[] = [
  { id: 301, name: 'Amit Kumar', plan: '15 min Call', duration: '14:55', avatar: 'A' },
  { id: 302, name: 'Neha Singh', plan: '30 min Call', duration: '28:10', avatar: 'N' },
];

// Chat Management constants
export const INITIAL_ACTIVE_CHATS: ActiveChat[] = [
    { 
        id: 401, name: 'Aman Gupta', planDuration: 600, timeRemaining: 480, avatar: 'A',
        messages: [
            { id: 1, sender: 'user', text: 'Hello, can you help me?', timestamp: '10:31 AM' },
            { id: 2, sender: 'admin', text: 'Hi Aman, of course. How can I assist you today?', timestamp: '10:32 AM' },
            { id: 3, sender: 'user', text: 'I have a question about my plan.', timestamp: '10:33 AM' },
        ]
    }
];

export const INITIAL_WAITING_CHATS: WaitingChat[] = [
    { id: 501, name: 'Nisha Kumari', plan: '15 min Chat Plan – ₹15', waitingTime: 180, avatar: 'N' },
    { id: 502, name: 'Raj Singh', plan: '10 min Chat Plan – ₹10', waitingTime: 65, avatar: 'R' },
];

export const INITIAL_CHAT_HISTORY: ChatHistoryType[] = [
    { id: 601, name: 'Kavita Iyer', plan: '5 min Chat', duration: '04:58', avatar: 'K' },
    { id: 602, name: 'Rohan Mehra', plan: '30 min Chat', duration: '29:45', avatar: 'R' },
];