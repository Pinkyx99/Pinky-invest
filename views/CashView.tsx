
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { formatCurrency, formatNumber } from '../utils/format';
import { Icon } from '../components/Icon';
import { CLICK_UPGRADES, PRESTIGE_MULTIPLIER_PER_LEVEL, CRYPTO_DATA, DAILY_REWARD_BASE } from '../constants';

type CashViewProps = ReturnType<typeof useGameState> & { netWorth: number };

const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const gridItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const DashboardCard: React.FC<{ children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent<HTMLDivElement>) => void, whileTap?: any, animate?: any, transition?: any, variants?: any }> = ({ children, className = '', onClick, whileTap, animate, transition, variants }) => (
    <motion.div
        className={`bg-[#1C1C1E] border border-white/10 rounded-2xl p-4 ${className}`}
        onClick={onClick}
        whileTap={whileTap}
        animate={animate}
        transition={transition}
        variants={variants}
    >
        {children}
    </motion.div>
);

const TycoonCoin3D: React.FC = () => {
    return (
        <motion.div
            className="w-24 h-24 flex items-center justify-center"
            style={{ perspective: 800 }}
        >
            <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
                {/* Coin front */}
                <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                    <Icon name="tycoon" className="w-12 h-12 text-yellow-400" />
                </div>
                {/* Coin back */}
                <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                    <Icon name="tycoon" className="w-12 h-12 text-yellow-400" />
                </div>
                 <div className="absolute w-full h-full rounded-full" style={{ transform: 'rotateY(90deg) translateZ(0px)', background: 'linear-gradient(to bottom, #71717a, #404040, #71717a)', width: '4px', left: 'calc(50% - 2px)' }}></div>
            </motion.div>
        </motion.div>
    );
};

const CashView: React.FC<CashViewProps> = (props) => {
    const { cash, earnByClick, upgradeClick, clickLevel, tycoonLevel, addActivity, activityFeed, cryptoHoldings, isDailyRewardAvailable, claimDailyReward, dailyRewardStreak } = props;
    const [floatingTexts, setFloatingTexts] = useState<{ id: number, value: number, x: number, y: number }[]>([]);

    const nextUpgrade = CLICK_UPGRADES[clickLevel];
    const upgradeCost = nextUpgrade ? nextUpgrade.cost : null;

    const handleCardTap = (e: React.MouseEvent<HTMLDivElement>) => {
        earnByClick();
        const clickValue = CLICK_UPGRADES[clickLevel - 1].clickValue;
        const prestigeBonus = 1 + tycoonLevel * PRESTIGE_MULTIPLIER_PER_LEVEL;
        const totalClickValue = clickValue * prestigeBonus;

        const rect = e.currentTarget.getBoundingClientRect();
        const newText = {
            id: Date.now() + Math.random(),
            value: totalClickValue,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setFloatingTexts(prev => [...prev, newText]);
    };

    return (
        <div className="flex flex-col h-full bg-black text-white p-4 space-y-4">
            {/* Header */}
            <motion.header
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <img src="https://i.pravatar.cc/40?u=tycoon" alt="User" className="w-10 h-10 rounded-full" />
                <div className="flex-1 relative">
                    <Icon name="search" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search" className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20" />
                </div>
                <button className="p-2 bg-[#1C1C1E] border border-white/10 rounded-lg"><Icon name="wallet" className="w-6 h-6 text-gray-300" /></button>
                <button className="p-2 bg-[#1C1C1E] border border-white/10 rounded-lg"><Icon name="bell" className="w-6 h-6 text-gray-300" /></button>
            </motion.header>

            {/* Wallet Card */}
            <DashboardCard 
                className="bg-gradient-to-br from-[#222] to-black cursor-pointer relative overflow-hidden" 
                onClick={handleCardTap}
                whileTap={{ scale: 0.98 }}
            >
                <AnimatePresence>
                    {floatingTexts.map(text => (
                        <motion.span
                            key={text.id}
                            className="absolute text-lg font-bold text-white pointer-events-none drop-shadow-lg z-20"
                            style={{ left: text.x, top: text.y }}
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 0, y: -50 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            onAnimationComplete={() => setFloatingTexts(prev => prev.filter(t => t.id !== text.id))}
                        >
                            +{formatCurrency(text.value)}
                        </motion.span>
                    ))}
                </AnimatePresence>

                <div className="flex justify-between items-start">
                    <p className="font-semibold">Wallet</p>
                    <div className="text-right">
                        <button 
                            onClick={(e) => { e.stopPropagation(); upgradeClick(); }}
                            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:bg-white/5 disabled:cursor-not-allowed"
                            disabled={!nextUpgrade || cash < nextUpgrade.cost}
                        >
                            <Icon name="plus-lg" className="w-5 h-5" />
                        </button>
                         {upgradeCost !== null && (
                            <p className="text-xs text-gray-400 mt-1">{formatCurrency(upgradeCost)}</p>
                        )}
                    </div>
                </div>
                <div className="my-4">
                    <p className="text-4xl font-bold tracking-tight">{formatCurrency(cash)}</p>
                    <p className="text-gray-400 font-mono text-sm">Account **3498</p>
                </div>
                <div className="flex justify-between items-center">
                    <Icon name="mastercard" className="w-10 h-10" />
                    <p className="font-mono text-sm">**** 9432</p>
                </div>
            </DashboardCard>

            {/* Grid for other cards */}
            <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
            >
                <DashboardCard 
                    variants={gridItemVariants}
                    className={`relative overflow-hidden ${isDailyRewardAvailable ? 'cursor-pointer' : ''}`}
                    onClick={isDailyRewardAvailable ? claimDailyReward : undefined}
                >
                     {isDailyRewardAvailable && (
                        <motion.div
                            className="absolute inset-0 border-2 border-yellow-400 rounded-2xl"
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.7, 1, 0.7],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ boxShadow: '0 0 15px rgba(250, 204, 21, 0.5)' }}
                        />
                    )}
                    <Icon name="calendar" className="w-7 h-7 mb-1 text-gray-400"/>
                    <h3 className="font-semibold">Daily Reward</h3>
                    {isDailyRewardAvailable ? (
                        <p className="text-sm text-yellow-400">Claim Now!</p>
                    ) : (
                        <p className="text-sm text-gray-500">Claimed</p>
                    )}
                </DashboardCard>
                <DashboardCard variants={gridItemVariants}>
                    <h3 className="font-semibold mb-2">Cashback</h3>
                    <div className="flex items-center space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" alt="Adidas" className="w-7 h-7 bg-white p-1 rounded-full" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Mcdonalds-90s-logo.svg" alt="McDonald's" className="w-7 h-7" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify" className="w-7 h-7" />
                    </div>
                </DashboardCard>
                <DashboardCard className="col-span-2 flex items-center gap-2" variants={gridItemVariants}>
                    <TycoonCoin3D />
                    <div className="flex-1">
                        <h3 className="font-semibold">TycoonCoin (TYC)</h3>
                        <p className="text-sm text-gray-400 mt-1">The official currency of your empire. Price: {formatCurrency(cryptoHoldings['tycooncoin'].price)}</p>
                        <button disabled className="mt-2 text-sm font-semibold bg-gray-700/70 px-3 py-1 rounded-md cursor-not-allowed">Staking Soon</button>
                    </div>
                </DashboardCard>
            </motion.div>
        </div>
    );
};

export default CashView;