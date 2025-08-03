
import React from 'react';
import { AdminStats, RecentActivity, ActivityStatus } from '../../types';

interface DashboardScreenProps {
  stats: AdminStats;
  recentActivities: RecentActivity[];
  showNotification: boolean;
  notificationMessage: string;
}

const StatCard: React.FC<{ icon: string, label: string, value: number, gradient: string, glow?: boolean, pulse?: boolean, className?: string, style?: React.CSSProperties }> = ({ icon, label, value, gradient, glow, pulse, className, style }) => (
    <div style={style} className={`relative p-4 rounded-2xl text-white overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 ${gradient} ${glow ? 'animate-glow' : ''} ${pulse ? 'animate-pulse-orange' : ''} ${className}`}>
        <div className="flex items-center justify-between">
            <div className="text-4xl">{icon}</div>
            <div className="text-right">
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm opacity-80">{label}</div>
            </div>
        </div>
    </div>
);

const ActivityRow: React.FC<{ activity: RecentActivity, className?: string, style?: React.CSSProperties }> = ({ activity, className, style }) => {
    const statusColor: Record<ActivityStatus, string> = {
        Active: 'border-l-green-400 bg-green-500/10',
        Waiting: 'border-l-orange-400 bg-orange-500/10',
        Completed: 'border-l-gray-500 bg-gray-500/10',
    };

    return (
        <div style={style} className={`flex items-center p-3 rounded-lg mb-3 text-white border-l-4 transition-transform duration-300 hover:bg-white/10 ${statusColor[activity.status]} backdrop-blur-sm ${className}`}>
            <div className="w-10 h-10 rounded-full bg-purple-500/50 flex items-center justify-center font-bold text-lg mr-3 flex-shrink-0">
                {activity.avatar}
            </div>
            <div className="flex-grow">
                <div className="font-semibold">{activity.name} - <span className="font-normal opacity-90">{activity.plan}</span></div>
                <div className={`text-xs font-bold opacity-80`}>{activity.status}</div>
            </div>
            <div className="text-xs text-gray-400">{activity.timestamp}</div>
        </div>
    );
};


const DashboardScreen: React.FC<DashboardScreenProps> = ({ stats, recentActivities, showNotification, notificationMessage }) => {
  return (
    <div className="p-4 text-white relative">
        {/* Floating Glass Notification */}
        {showNotification && (
            <div className="fixed top-0 left-0 right-0 z-30 flex justify-center p-4 pointer-events-none animate-slide-in-down">
                <div className="w-full max-w-[calc(448px-2rem)] p-4 rounded-2xl text-white font-semibold text-center bg-purple-600/50 bg-gradient-to-r from-purple-500/60 via-pink-500/60 to-red-500/60 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden pointer-events-auto">
                    <div className="absolute inset-0 animate-shine opacity-50"></div>
                    {notificationMessage}
                </div>
            </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard icon="📞" label="Active Calls" value={stats.activeCalls} gradient="from-green-500 to-cyan-500 bg-gradient-to-br" glow className="animate-fade-in-up" style={{ animationDelay: '100ms' }}/>
            <StatCard icon="💬" label="Active Chats" value={stats.activeChats} gradient="from-purple-500 to-indigo-500 bg-gradient-to-br" className="animate-fade-in-up" style={{ animationDelay: '200ms' }}/>
            <StatCard icon="👥" label="Waiting Queue" value={stats.waitingQueue} gradient="from-orange-500 to-yellow-500 bg-gradient-to-br" pulse className="animate-fade-in-up" style={{ animationDelay: '300ms' }}/>
            <StatCard icon="₹" label="Today's Revenue" value={stats.todaysRevenue} gradient="from-blue-500 to-sky-500 bg-gradient-to-br" className="animate-fade-in-up" style={{ animationDelay: '400ms' }}/>
        </div>
        
        {/* Recent Activity */}
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="max-h-96 overflow-y-auto pr-2">
              {recentActivities.map((activity, index) => <ActivityRow key={activity.id} activity={activity} className="animate-fade-in-up" style={{ animationDelay: `${500 + index * 75}ms`}}/>)}
            </div>
        </div>
    </div>
  );
};

export default DashboardScreen;