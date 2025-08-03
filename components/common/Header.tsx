
import React from 'react';

interface HeaderProps {
  newNotification: boolean;
}

const Header: React.FC<HeaderProps> = ({ newNotification }) => {
  return (
    <header className="p-4 flex justify-between items-center text-white sticky top-0 bg-[#1a1a3d]/50 backdrop-blur-sm z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
          S
        </div>
      </div>
      <div className="text-xl font-bold">Sakoon Admin</div>
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-glow"></div>
        <div className={`text-2xl text-yellow-400 ${newNotification ? 'animate-shake' : ''}`}>
          🔔
        </div>
      </div>
    </header>
  );
};

export default Header;
