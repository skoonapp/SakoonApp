
import React from 'react';
import { Screen } from '../../types';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  screen: Screen;
  isActive: boolean;
  onClick: (screen: Screen) => void;
}


const HomeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
);
const CallIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
);
const ChatIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>
);
const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2 3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></svg>
);

const NavItem: React.FC<NavItemProps> = ({ icon, label, screen, isActive, onClick }) => {
  return (
    <div
      className="text-center cursor-pointer flex-1 flex flex-col justify-center items-center p-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      onClick={() => onClick(screen)}
      role="button"
      aria-label={`Navigate to ${label}`}
    >
        <div className={`relative w-8 h-8 flex items-center justify-center mb-1 transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`}>
            {icon}
            {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>}
        </div>
        <div className={`text-xs font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400'}`}>{label}</div>
    </div>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems: { icon: React.ReactNode, label: string, screen: Screen }[] = [
    { icon: <HomeIcon className="w-7 h-7" />, label: 'Home', screen: 'dashboard' },
    { icon: <CallIcon className="w-7 h-7" />, label: 'Call', screen: 'call' },
    { icon: <ChatIcon className="w-7 h-7" />, label: 'Chats', screen: 'chat' },
    { icon: <SettingsIcon className="w-7 h-7" />, label: 'Settings', screen: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#161a33] flex justify-around items-center pt-2 pb-3 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] z-20 border-t border-white/10">
      {navItems.map(item => (
        <NavItem
          key={item.screen}
          icon={item.icon}
          label={item.label}
          screen={item.screen}
          isActive={activeScreen === item.screen}
          onClick={onNavigate}
        />
      ))}
    </nav>
  );
};

export default BottomNav;
