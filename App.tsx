
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { View } from './types';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Modal from './components/Modal';
import { formatCurrency } from './utils/format';

import CashView from './views/CashView';
import PropertiesView from './views/PropertiesView'; // This is now the main "Invest" hub
import CryptoView from './views/CryptoView';
import CasinoView from './views/CasinoView';
import ProfileView from './views/ProfileView';

const viewVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Cash);
  const gameController = useGameState();
  const { offlineGains, clearOfflineGains } = gameController;
  const [isWelcomeBackModalOpen, setWelcomeBackModalOpen] = useState(false);

  useEffect(() => {
    if (offlineGains.cash > 1) { // Only show if meaningful amount was earned
      setWelcomeBackModalOpen(true);
    }
  }, [offlineGains]);

  useGameLoop(gameController);

  const netWorth = useMemo(() => {
    const propertyValue = Object.values(gameController.properties).reduce((sum, p) => sum + p.value, 0);
    const cryptoValue = Object.values(gameController.cryptoHoldings).reduce((sum, c) => sum + c.value, 0);
    const stockValue = Object.values(gameController.stocks).reduce((sum, s) => sum + s.value, 0);
    const assetValue = Object.values(gameController.assets).reduce((sum, a) => sum + a.value, 0);
    return gameController.cash + propertyValue + cryptoValue + stockValue + assetValue;
  }, [gameController.cash, gameController.properties, gameController.cryptoHoldings, gameController.stocks, gameController.assets]);
  
  const handleCloseWelcomeBackModal = () => {
    setWelcomeBackModalOpen(false);
    clearOfflineGains();
  };

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
        return <motion.div {...motionProps} className="h-full"><CashView {...gameController} netWorth={netWorth} /></motion.div>;
      case View.Properties:
        return <motion.div {...motionProps}><PropertiesView {...gameController} /></motion.div>;
      case View.Crypto:
        return <motion.div {...motionProps}><CryptoView {...gameController} netWorth={netWorth} /></motion.div>;
      case View.Casino:
        return <motion.div {...motionProps}><CasinoView {...gameController} /></motion.div>;
      case View.Profile:
        return <motion.div {...motionProps}><ProfileView {...gameController} netWorth={netWorth} /></motion.div>;
      default:
        return <motion.div {...motionProps} className="h-full"><CashView {...gameController} netWorth={netWorth} /></motion.div>;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans text-white overflow-hidden p-4 bg-black">
      <main className="relative z-10 w-full max-w-[420px] h-[860px] bg-black border border-gray-700/50 rounded-[48px] shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
        <Header cash={gameController.cash} />
        <div className="flex-grow overflow-y-auto custom-scrollbar pt-16 pb-24">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </div>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </main>
      <Modal title="Welcome Back, Tycoon!" isOpen={isWelcomeBackModalOpen} onClose={handleCloseWelcomeBackModal}>
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-300">Your empire worked for you while you were away.</p>
          <div className="p-4 bg-green-500/10 rounded-lg">
            <p className="text-sm text-green-400">Offline Earnings</p>
            <p className="text-3xl font-bold text-green-300">{formatCurrency(offlineGains.cash)}</p>
          </div>
          <button onClick={handleCloseWelcomeBackModal} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-2">
            Awesome!
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;