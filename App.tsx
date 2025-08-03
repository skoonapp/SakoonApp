
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, AdminStats, RecentActivity, ActiveCall, WaitingCall, CallHistoryItem, ActiveChat, WaitingChat, ChatHistoryItem as ChatHistoryType, User, ChatMessage } from './types';
import { 
    INITIAL_RECENT_ACTIVITIES, 
    INITIAL_ACTIVE_CALLS, 
    INITIAL_WAITING_CALLS, 
    INITIAL_CALL_HISTORY,
    INITIAL_ACTIVE_CHATS,
    INITIAL_WAITING_CHATS,
    INITIAL_CHAT_HISTORY
} from './constants';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import DashboardScreen from './components/screens/DashboardScreen';
import CallManagementScreen from './components/screens/CallManagementScreen';
import ChatManagementScreen from './components/screens/ChatManagementScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import FullScreenChatScreen from './components/screens/FullScreenChatScreen';
import FullScreenCallScreen from './components/screens/FullScreenCallScreen';


const extractNumber = (str: string): number => {
    if (!str) return 0;
    // Look for a number followed by "min" for more accuracy
    const match = str.match(/(\d+)\s*min/i);
    return match ? parseInt(match[1], 10) : 0;
};

const App: React.FC = () => {
  const [user] = useState<User>({ name: 'Sakoon Admin', id: 'admin-001' });

  // State for authenticated app
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [stats, setStats] = useState<AdminStats>({ activeCalls: 1, activeChats: 1, waitingQueue: 4, todaysRevenue: 1250 });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(INITIAL_RECENT_ACTIVITIES);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // State for Call Management
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>(INITIAL_ACTIVE_CALLS);
  const [waitingCalls, setWaitingCalls] = useState<WaitingCall[]>(INITIAL_WAITING_CALLS);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>(INITIAL_CALL_HISTORY);
  const [viewingCallId, setViewingCallId] = useState<number | null>(null);

  // State for Chat Management
  const [activeChats, setActiveChats] = useState<ActiveChat[]>(INITIAL_ACTIVE_CHATS);
  const [waitingChats, setWaitingChats] = useState<WaitingChat[]>(INITIAL_WAITING_CHATS);
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>(INITIAL_CHAT_HISTORY);
  const [viewingChatId, setViewingChatId] = useState<number | null>(null);

  // A single "tick" state to drive all time-based updates.
  const [tick, setTick] = useState(0);

  // Single interval to drive all time-based updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effect for all 1-second interval updates
  useEffect(() => {
    if (tick === 0) return; // Don't run on initial render

    // --- Call Timers ---
    setActiveCalls(prev =>
      prev.map(call =>
        call.timeRemaining > 0 ? { ...call, timeRemaining: call.timeRemaining - 1 } : call
      ).filter(call => {
        if (call.timeRemaining <= 0) {
          setCallHistory(hist => [{
            id: call.id, name: call.name, avatar: call.avatar,
            plan: `${call.planDuration / 60} min Call`,
            duration: new Date(call.planDuration * 1000).toISOString().substr(14, 5)
          }, ...hist]);
          setStats(s => ({ ...s, activeCalls: s.activeCalls - 1 }));
          return false;
        }
        return true;
      })
    );
    setWaitingCalls(prev => prev.map(call => ({ ...call, waitingTime: call.waitingTime + 1 })));

    // --- Chat Timers ---
    setActiveChats(prev =>
      prev.map(chat =>
        chat.timeRemaining > 0 ? { ...chat, timeRemaining: chat.timeRemaining - 1 } : chat
      ).filter(chat => {
        if (chat.timeRemaining <= 0) {
          setChatHistory(hist => [{
            id: chat.id, name: chat.name, avatar: chat.avatar,
            plan: `${chat.planDuration / 60} min Chat`,
            duration: new Date(chat.planDuration * 1000).toISOString().substr(14, 5)
          }, ...hist]);
          setStats(s => ({ ...s, activeChats: s.activeChats - 1 }));
          return false;
        }
        return true;
      })
    );
    setWaitingChats(prev => prev.map(chat => ({ ...chat, waitingTime: chat.waitingTime + 1 })));

  }, [tick]);

  // Effect for 15-second updates (notifications)
  useEffect(() => {
    if (tick === 0 || tick % 15 !== 0) return;

    const plans = ["10 min Chat", "5 min Call", "30 min Chat"];
    const randomPlan = plans[Math.floor(Math.random() * plans.length)];
    setNotificationMessage(`🔔 New User Purchased ${randomPlan} Plan!`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);

    setRecentActivities(prev => {
        const newActivity: RecentActivity = {
            id: Date.now(),
            avatar: 'N',
            name: 'New User',
            plan: randomPlan,
            status: 'Waiting',
            timestamp: 'Just now'
        };
        return [newActivity, ...prev].slice(0, 50);
    }); // Prevent list from growing indefinitely

    const revenueFromPlan = extractNumber(randomPlan);
    setStats(s => ({
      ...s,
      waitingQueue: s.waitingQueue + 1,
      todaysRevenue: s.todaysRevenue + (revenueFromPlan > 0 ? revenueFromPlan * 10 : 50),
    }));
  }, [tick]);
  
  const handleConnectCall = useCallback((waitingCall: WaitingCall) => {
    setWaitingCalls(prev => prev.filter(c => c.id !== waitingCall.id));
    const planMinutes = extractNumber(waitingCall.plan);
    const planSeconds = planMinutes > 0 ? planMinutes * 60 : 300; // Default to 5 mins if parsing fails
    const newActiveCall: ActiveCall = {
        id: waitingCall.id, name: waitingCall.name, avatar: waitingCall.avatar,
        planDuration: planSeconds, timeRemaining: planSeconds
    };
    setActiveCalls(prev => [newActiveCall, ...prev]);
    setStats(s => ({ ...s, activeCalls: s.activeCalls + 1, waitingQueue: s.waitingQueue - 1 }));
  }, []);

  const handleEndCall = useCallback((activeCall: ActiveCall) => {
    setActiveCalls(prev => prev.filter(c => c.id !== activeCall.id));
    const timeSpent = activeCall.planDuration - activeCall.timeRemaining;
    const durationStr = new Date(timeSpent * 1000).toISOString().substr(14, 5);
    setCallHistory(prev => [{
        id: activeCall.id, name: activeCall.name, avatar: activeCall.avatar,
        plan: `${Math.round(activeCall.planDuration / 60)} min Call`,
        duration: durationStr
    }, ...prev]);
    setStats(s => ({ ...s, activeCalls: s.activeCalls - 1 }));
    if (viewingCallId === activeCall.id) {
        setViewingCallId(null);
    }
  }, [viewingCallId]);

  const handleStartChat = useCallback((waitingChat: WaitingChat) => {
    setWaitingChats(prev => prev.filter(c => c.id !== waitingChat.id));
    const planMinutes = extractNumber(waitingChat.plan);
    const planSeconds = planMinutes > 0 ? planMinutes * 60 : 900; // Default to 15 mins if parsing fails
    const newActiveChat: ActiveChat = {
        id: waitingChat.id, name: waitingChat.name, avatar: waitingChat.avatar,
        planDuration: planSeconds, timeRemaining: planSeconds,
        messages: [{ id: Date.now(), sender: 'user', text: `Hi! I've started the ${waitingChat.plan}.`, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }]
    };
    setActiveChats(prev => [newActiveChat, ...prev]);
    setStats(s => ({ ...s, activeChats: s.activeChats + 1, waitingQueue: s.waitingQueue - 1 }));
  }, []);

  const handleEndChat = useCallback((activeChat: ActiveChat) => {
    setActiveChats(prev => prev.filter(c => c.id !== activeChat.id));
    const timeSpent = activeChat.planDuration - activeChat.timeRemaining;
    const durationStr = new Date(timeSpent * 1000).toISOString().substr(14, 5);
    setChatHistory(prev => [{
        id: activeChat.id, name: activeChat.name, avatar: activeChat.avatar,
        plan: `${Math.round(activeChat.planDuration / 60)} min Chat`,
        duration: durationStr
    }, ...prev]);
    setStats(s => ({ ...s, activeChats: s.activeChats - 1 }));
     if (viewingChatId === activeChat.id) {
        setViewingChatId(null);
    }
  }, [viewingChatId]);

  const handleSendMessage = useCallback((chatId: number, text: string) => {
    setActiveChats(prevChats =>
        prevChats.map(chat => {
            if (chat.id === chatId) {
                const newMessage: ChatMessage = {
                    id: Date.now(),
                    sender: 'admin',
                    text,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                };
                return {
                    ...chat,
                    messages: [...chat.messages, newMessage]
                };
            }
            return chat;
        })
    );
  }, []);
  
  const handleViewChat = useCallback((chatId: number) => {
    setViewingChatId(chatId);
  }, []);

  const handleCloseChatView = useCallback(() => {
    setViewingChatId(null);
  }, []);

  const handleViewCall = useCallback((callId: number) => {
    setViewingCallId(callId);
  }, []);

  const handleCloseCallView = useCallback(() => {
    setViewingCallId(null);
  }, []);

  const handleNavigate = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen stats={stats} recentActivities={recentActivities} showNotification={showNotification} notificationMessage={notificationMessage} />;
      case 'call':
        const viewingCall = activeCalls.find(c => c.id === viewingCallId);
        if (viewingCall) {
            return <FullScreenCallScreen
                call={viewingCall}
                onEndCall={handleEndCall}
                onBack={handleCloseCallView}
                user={user}
            />
        }
        return <CallManagementScreen 
                    activeCalls={activeCalls}
                    waitingCalls={waitingCalls}
                    callHistory={callHistory}
                    onConnectCall={handleConnectCall}
                    onViewCall={handleViewCall}
                />;
      case 'chat':
        const viewingChat = activeChats.find(c => c.id === viewingChatId);
        if (viewingChat) {
            return <FullScreenChatScreen
                chat={viewingChat}
                onSendMessage={handleSendMessage}
                onEndChat={handleEndChat}
                onBack={handleCloseChatView}
            />
        }
        return <ChatManagementScreen 
                    activeChats={activeChats}
                    waitingChats={waitingChats}
                    chatHistory={chatHistory}
                    onStartChat={handleStartChat}
                    onEndChat={handleEndChat}
                    onViewChat={handleViewChat}
               />;
      case 'settings':
        return <SettingsScreen user={user} onNavigate={handleNavigate} />;
    }
  };

  const isFullScreenChat = currentScreen === 'chat' && viewingChatId !== null;
  const isFullScreenCall = currentScreen === 'call' && viewingCallId !== null;
  const isFullScreen = isFullScreenChat || isFullScreenCall;

  return (
    <div className="bg-gradient-to-br from-[#0d123a] to-[#0a0f2c]">
      <div className={`max-w-md mx-auto bg-transparent min-h-screen relative flex flex-col ${isFullScreen ? 'overflow-hidden h-screen' : ''}`}>
        {!isFullScreen && <Header newNotification={showNotification} />}
        <main className={`flex-grow ${isFullScreen ? '' : 'pb-24'}`}>
          {renderScreen()}
        </main>
        {!isFullScreen && <BottomNav activeScreen={currentScreen} onNavigate={handleNavigate} />}
      </div>
    </div>
  );
};

export default App;