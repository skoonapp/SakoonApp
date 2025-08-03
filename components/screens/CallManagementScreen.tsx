
import React from 'react';
import { ActiveCall, WaitingCall, CallHistoryItem } from '../../types';

// Helper to format time
const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

// Sub-components for different cards
const ActiveCallCard: React.FC<{ call: ActiveCall, onViewCall: (callId: number) => void }> = ({ call, onViewCall }) => (
    <div 
      onClick={() => onViewCall(call.id)}
      className="bg-gradient-to-br from-green-500/80 to-blue-500/80 p-4 rounded-2xl shadow-lg border border-green-400/50 mb-4 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-green-500/20 active:scale-[0.98] transition-all duration-300"
      role="button"
      aria-label={`Open call with ${call.name}`}
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center font-bold text-2xl text-white flex-shrink-0 animate-glow-green">{call.avatar}</div>
                <div className="overflow-hidden">
                    <div className="text-xl font-bold text-white truncate">{call.name}</div>
                    <p className="text-xs text-white/80 truncate">Tap to open call view</p>
                </div>
            </div>
            <div className="text-right text-white flex-shrink-0 ml-2">
                <div className="text-xs opacity-80">Time Left</div>
                <div className="text-lg font-bold">{formatTime(call.timeRemaining)}</div>
            </div>
        </div>
    </div>
);

const WaitingCallCard: React.FC<{ call: WaitingCall, onConnect: (call: WaitingCall) => void }> = ({ call, onConnect }) => (
    <div className="bg-gradient-to-br from-orange-400/80 to-yellow-400/80 p-4 rounded-2xl shadow-lg mb-3 flex items-center">
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-bold text-xl text-white mr-4">{call.avatar}</div>
        <div className="flex-grow text-white">
            <div className="font-bold">{call.name} - <span className="font-normal text-sm">{call.plan}</span></div>
            <div className="text-xs opacity-90">Waiting for: {formatTime(call.waitingTime)}</div>
        </div>
        <button onClick={() => onConnect(call)} className="py-2 px-5 rounded-full text-white font-bold animate-glow-orange transition">
            Connect
        </button>
    </div>
);

const HistoryItem: React.FC<{ item: CallHistoryItem }> = ({ item }) => (
    <div className="bg-white/10 p-3 rounded-lg flex items-center mb-2 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-purple-500/50 flex items-center justify-center font-bold text-sm mr-3">{item.avatar}</div>
        <div className="flex-grow text-white/90 text-sm">
            <div className="font-semibold">{item.name}</div>
            <div className="text-xs opacity-70">{item.plan} - Duration: {item.duration}</div>
        </div>
    </div>
);


// Main component
interface CallManagementScreenProps {
    activeCalls: ActiveCall[];
    waitingCalls: WaitingCall[];
    callHistory: CallHistoryItem[];
    onConnectCall: (call: WaitingCall) => void;
    onViewCall: (callId: number) => void;
}

const CallManagementScreen: React.FC<CallManagementScreenProps> = ({ activeCalls, waitingCalls, callHistory, onConnectCall, onViewCall }) => {
  return (
    <div className="p-4 text-white">
        {/* Screen Title / Sub-header */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Voice Calls</h2>
            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                <span>Online</span>
            </div>
        </div>
        
        {/* Active Calls */}
        <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Active Calls ({activeCalls.length})</h3>
            {activeCalls.length > 0 ? (
                activeCalls.map(call => <ActiveCallCard key={call.id} call={call} onViewCall={onViewCall} />)
            ) : (
                <p className="text-center text-white/50 text-sm py-4">No active calls.</p>
            )}
        </div>

        {/* Waiting Queue */}
        <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Waiting Queue ({waitingCalls.length})</h3>
             {waitingCalls.length > 0 ? (
                waitingCalls.map(call => <WaitingCallCard key={call.id} call={call} onConnect={onConnectCall} />)
            ) : (
                <p className="text-center text-white/50 text-sm py-4">No users waiting.</p>
            )}
        </div>

        {/* Call History */}
        <div>
            <h3 className="font-bold text-lg mb-3">Call History</h3>
            <div className="max-h-60 overflow-y-auto pr-2">
                {callHistory.length > 0 ? (
                    callHistory.map(item => <HistoryItem key={item.id} item={item} />)
                ) : (
                     <p className="text-center text-white/50 text-sm py-4">No call history yet.</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default CallManagementScreen;