
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { Icon } from '../components/Icon';
import MinesGame from './casino/MinesGame';
import CrashGame from './casino/CrashGame';
import BlackjackGame from './casino/BlackjackGame';
import CoinFlipGame from './casino/CoinFlipGame';

type CasinoViewProps = ReturnType<typeof useGameState>;
type GameType = 'mines' | 'crash' | 'blackjack' | 'coin-flip' | null;

const GameCard: React.FC<{ title: string, description: string, icon: React.ReactNode, onClick: () => void }> = ({ title, description, icon, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            className="p-6 flex items-center space-x-6 cursor-pointer relative overflow-hidden bg-[#1C1C1E] border border-white/10 rounded-2xl"
            whileHover={{ y: -5, filter: 'brightness(1.2)' }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="text-gray-400 z-10">
              {icon}
            </div>
            <div className="z-10 text-left">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-white/60">{description}</p>
            </div>
        </motion.div>
    )
}

const CasinoView: React.FC<CasinoViewProps> = (props) => {
    const [activeGame, setActiveGame] = useState<GameType>(null);

    const renderGame = () => {
        switch(activeGame) {
            case 'mines':
                return <MinesGame onBack={() => setActiveGame(null)} {...props} />;
            case 'crash':
                return <CrashGame onBack={() => setActiveGame(null)} {...props} />;
            case 'blackjack':
                return <BlackjackGame onBack={() => setActiveGame(null)} {...props} />;
            case 'coin-flip':
                return <CoinFlipGame onBack={() => setActiveGame(null)} {...props} />;
            default:
                return (
                    <motion.div 
                        key="hub"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 space-y-4"
                    >
                        <h1 className="text-2xl font-bold">The Casino</h1>
                        <motion.div 
                            className="space-y-4"
                            initial="hidden"
                            animate="show"
                            variants={{
                                show: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                                <GameCard 
                                    title="Coin Flip" 
                                    description="Heads or Tails. 50/50 odds."
                                    icon={<Icon name="coin" className="w-12 h-12"/>}
                                    onClick={() => setActiveGame('coin-flip')}
                                />
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                                <GameCard 
                                    title="Mines" 
                                    description="Reveal gems, avoid mines."
                                    icon={<Icon name="gem" className="w-12 h-12"/>}
                                    onClick={() => setActiveGame('mines')}
                                />
                            </motion.div>
                             <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                                <GameCard 
                                    title="Crash" 
                                    description="Cash out before the multiplier crashes."
                                    icon={<Icon name="up-right-arrow" className="w-12 h-12"/>}
                                    onClick={() => setActiveGame('crash')}
                                />
                             </motion.div>
                             <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                                <GameCard 
                                    title="Blackjack" 
                                    description="Beat the dealer to 21."
                                    icon={<Icon name="spade" className="w-12 h-12 fill-current"/>}
                                    onClick={() => setActiveGame('blackjack')}
                                />
                             </motion.div>
                        </motion.div>
                    </motion.div>
                )
        }
    }

    return (
        <AnimatePresence mode="wait">
            {renderGame()}
        </AnimatePresence>
    );
};

export default CasinoView;