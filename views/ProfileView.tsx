import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { PRESTIGE_REQUIREMENT, PRESTIGE_MULTIPLIER_PER_LEVEL } from '../constants';
import { formatCurrency } from '../utils/format';
import Modal from '../components/Modal';
import { Icon } from '../components/Icon';
import { Activity } from '../types';

type ProfileViewProps = ReturnType<typeof useGameState> & { netWorth: number };

const AnimatedStat: React.FC<{ value: number, formatter: (n: number) => string, className?: string }> = ({ value, formatter, className }) => {
    const motionValue = useMotionValue(0);
    const displayValue = useTransform(motionValue, v => formatter(v));
    
    useEffect(() => {
        const controls = animate(motionValue, value, { duration: 1.5, ease: 'easeOut' });
        return controls.stop;
    }, [value, motionValue]);

    return <motion.p className={className}>{displayValue}</motion.p>;
};

const ActivityFeed: React.FC<{ feed: Activity[] }> = ({ feed }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white px-2">Your Journey</h3>
        <motion.div 
            className="space-y-1"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
        {feed.slice(0, 10).map(item => (
            <motion.div
                key={item.id}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="flex items-center p-3 hover:bg-[#1C1C1E] rounded-xl"
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    item.type === 'gain' ? 'bg-green-500/10 text-green-400' :
                    item.type === 'loss' ? 'bg-red-500/10 text-red-400' :
                    item.type === 'prestige' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-gray-500/10 text-gray-400'
                }`}>
                    <Icon name={
                        item.type === 'gain' ? 'plus-circle' :
                        item.type === 'loss' ? 'minus-circle' :
                        item.type === 'prestige' ? 'sparkles' : 'cash'
                    } className="w-6 h-6"/>
                </div>
                <span className="text-white/90 font-medium text-sm flex-1">{item.text}</span>
            </motion.div>
        ))}
        </motion.div>
    </div>
);


const ProfileView: React.FC<ProfileViewProps> = ({ netWorth, tycoonLevel, prestige, activityFeed }) => {
    const [isPrestigeModalOpen, setPrestigeModalOpen] = useState(false);
    const canPrestige = netWorth >= PRESTIGE_REQUIREMENT;
    const prestigeBonus = tycoonLevel * PRESTIGE_MULTIPLIER_PER_LEVEL * 100;

    const handlePrestige = () => {
        prestige();
        setPrestigeModalOpen(false);
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Your Empire</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#1C1C1E] border border-white/10 rounded-xl">
                    <p className="text-sm text-white/70">Total Net Worth</p>
                    <AnimatedStat value={netWorth} formatter={formatCurrency} className="text-2xl font-bold text-white" />
                </div>
                <div className="p-4 bg-[#1C1C1E] border border-white/10 rounded-xl">
                    <p className="text-sm text-white/70">Prestige Bonus</p>
                    <AnimatedStat value={prestigeBonus} formatter={(v) => `+${v.toFixed(0)}%`} className="text-2xl font-bold text-yellow-400" />
                </div>
            </div>
            
            <motion.button
                onClick={() => canPrestige && setPrestigeModalOpen(true)}
                disabled={!canPrestige}
                className="w-full font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-white bg-[#1C1C1E] border border-white/10 disabled:bg-gray-800 disabled:text-white/40 disabled:cursor-not-allowed disabled:border-gray-700"
                whileHover={canPrestige ? { filter: 'brightness(1.2)' } : {}}
                whileTap={{ scale: canPrestige ? 0.95 : 1 }}
                animate={canPrestige ? {
                    borderColor: ["rgba(251, 191, 36, 0.3)", "rgba(251, 191, 36, 0.8)", "rgba(251, 191, 36, 0.3)"]
                } : {}}
                transition={canPrestige ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
            >
                <Icon name="prestige" className="w-6 h-6 text-yellow-400"/> Go Tycoon
            </motion.button>
            <p className="text-center text-sm text-white/60 -mt-4">
                Requires {formatCurrency(PRESTIGE_REQUIREMENT)} net worth
            </p>

            <ActivityFeed feed={activityFeed} />

            <Modal title="Go Tycoon?" isOpen={isPrestigeModalOpen} onClose={() => setPrestigeModalOpen(false)}>
                <div className="space-y-4 text-center">
                    <p className="text-white/80">Are you sure you want to prestige? Your progress will be reset, but you will gain a permanent income bonus for all future runs.</p>
                    <p className="font-bold text-lg">Next Bonus: <span className="text-yellow-300">+{ (tycoonLevel + 1) * 100 }%</span></p>
                    <div className="flex justify-around pt-4">
                        <button onClick={() => setPrestigeModalOpen(false)} className="px-6 py-2 rounded-lg bg-white/10">Cancel</button>
                        <button onClick={handlePrestige} className="px-6 py-2 rounded-lg bg-yellow-600 text-white font-bold">Confirm</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProfileView;