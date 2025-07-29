
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { formatCurrency } from '../utils/format';
import { Icon } from '../components/Icon';
import { CLICK_UPGRADES, PRESTIGE_MULTIPLIER_PER_LEVEL } from '../constants';

type CashViewProps = ReturnType<typeof useGameState> & { netWorth: number };

const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
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

const CashView: React.FC<CashViewProps> = (props) => {
    const { cash, earnByClick, upgradeClick, clickLevel, tycoonLevel, addActivity } = props;
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
                animate={{
                    borderColor: ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.1)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
                <DashboardCard variants={gridItemVariants}>
                    <h3 className="font-semibold mb-2">Transactions</h3>
                    <p className="text-sm text-gray-400">Spent in October</p>
                    <div className="flex items-center gap-1 mt-2">
                        <div className="h-2 w-2/5 bg-purple-500 rounded-l-full"></div>
                        <div className="h-2 w-1/5 bg-blue-500"></div>
                        <div className="h-2 w-1/5 bg-orange-500"></div>
                        <div className="h-2 w-1/5 bg-green-500 rounded-r-full"></div>
                    </div>
                </DashboardCard>
                <DashboardCard variants={gridItemVariants}>
                    <h3 className="font-semibold mb-2">Cashback</h3>
                    <div className="flex items-center space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" alt="Adidas" className="w-7 h-7 bg-white p-1 rounded-full" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Mcdonalds-90s-logo.svg" alt="McDonald's" className="w-7 h-7" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify" className="w-7 h-7" />
                    </div>
                </DashboardCard>
                <DashboardCard variants={gridItemVariants}>
                    <Icon name="academic-cap" className="w-7 h-7 mb-1 text-gray-400"/>
                    <h3 className="font-semibold">Tips and training</h3>
                </DashboardCard>
                <DashboardCard variants={gridItemVariants}>
                    <Icon name="apps" className="w-7 h-7 mb-1 text-gray-400"/>
                    <h3 className="font-semibold">All services</h3>
                </DashboardCard>
                <DashboardCard className="col-span-2 flex items-center gap-4" variants={gridItemVariants}>
                    <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0">
                      {/* Placeholder for 3D graphic */}
                    </div>
                    <div>
                        <h3 className="font-semibold">Refer and Earn</h3>
                        <p className="text-sm text-gray-400 mt-1">Share a referral link to your friend and get rewarded</p>
                        <button onClick={() => addActivity("Referral program coming soon!", "neutral")} className="mt-2 text-sm font-semibold bg-gray-700/70 px-3 py-1 rounded-md hover:bg-gray-700">Learn more</button>
                    </div>
                </DashboardCard>
            </motion.div>
        </div>
    );
};

export default CashView;
