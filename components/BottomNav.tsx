
import React from 'react';
import { motion } from 'framer-motion';
import { View } from '../types';
import { Icon } from './Icon';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navItemsLeft = [
  { view: View.Crypto, icon: 'bitcoin' as const },
  { view: View.Casino, icon: 'casino' as const },
];

const navItemsRight = [
  { view: View.Properties, icon: 'home' as const },
  { view: View.Profile, icon: 'profile' as const },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const centralView = View.Cash;

  const NavButton = ({ item, isActive }: { item: { view: View, icon: any}, isActive: boolean }) => (
    <button
      onClick={() => setActiveView(item.view)}
      className="flex-1 flex items-center justify-center p-2"
    >
      <Icon name={item.icon} className={`w-7 h-7 transition-colors ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`} />
    </button>
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 flex justify-center items-center px-6 z-50">
      <div className="w-full h-14 bg-[#161616] border border-white/10 rounded-2xl flex items-center">
        <div className="flex w-2/5">
          {navItemsLeft.map((item) => <NavButton key={item.view} item={item} isActive={activeView === item.view} />)}
        </div>
        <div className="w-1/s flex justify-center">
           <button 
             onClick={() => setActiveView(centralView)} 
             className="w-16 h-16 -mt-8 bg-gray-800 border-4 border-black rounded-full flex items-center justify-center shadow-lg"
           >
              <Icon name="wallet" className={`w-8 h-8 transition-colors ${activeView === centralView ? 'text-white' : 'text-gray-500'}`} />
           </button>
        </div>
        <div className="flex w-2/5">
          {navItemsRight.map((item) => <NavButton key={item.view} item={item} isActive={activeView === item.view} />)}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;