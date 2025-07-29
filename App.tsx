
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { View } from './types';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

import CashView from './views/CashView';
import PropertiesView from './views/PropertiesView';
import CryptoView from './views/CryptoView';
import AssetsView from './views/AssetsView';
import CasinoView from './views/CasinoView';
import ProfileView from './views/ProfileView';

const viewVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Cash);
  const gameState = useGameState();

  useGameLoop(gameState);

  const netWorth = useMemo(() => {
    const propertyValue = Object.values(gameState.properties).reduce((sum, p) => sum + p.value, 0);
    const cryptoValue = Object.values(gameState.cryptoHoldings).reduce((sum, c) => sum + c.value, 0);
    const assetValue = Object.values(gameState.assets).reduce((sum, a) => sum + a.value, 0);
    return gameState.cash + propertyValue + cryptoValue + assetValue;
  }, [gameState.cash, gameState.properties, gameState.cryptoHoldings, gameState.assets]);
  
  const renderView = () => {
    const motionProps = {
        key: activeView,
        initial: "hidden",
        animate: "visible",
        exit: "exit",
        variants: viewVariants,
        transition: { type: "spring", stiffness: 350, damping: 30 } as Transition,
    };

    switch (activeView) {
      case View.Cash:
        return <motion.div {...motionProps} className="h-full"><CashView {...gameState} netWorth={netWorth} /></motion.div>;
      case View.Properties:
        return <motion.div {...motionProps}><PropertiesView {...gameState} /></motion.div>;
      case View.Crypto:
        return <motion.div {...motionProps}><CryptoView {...gameState} netWorth={netWorth} /></motion.div>;
      case View.Assets:
        return <motion.div {...motionProps}><AssetsView {...gameState} /></motion.div>;
      case View.Casino:
        return <motion.div {...motionProps}><CasinoView {...gameState} /></motion.div>;
      case View.Profile:
        return <motion.div {...motionProps}><ProfileView {...gameState} netWorth={netWorth} /></motion.div>;
      default:
        return <motion.div {...motionProps} className="h-full"><CashView {...gameState} netWorth={netWorth} /></motion.div>;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans text-white overflow-hidden p-4 bg-black">
      <main className="relative z-10 w-full max-w-[420px] h-[860px] bg-black border border-gray-700/50 rounded-[48px] shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        <Header cash={gameState.cash} />
        <div className="flex-grow overflow-y-auto custom-scrollbar pt-16">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </div>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </main>
    </div>
  );
};

export default App;
