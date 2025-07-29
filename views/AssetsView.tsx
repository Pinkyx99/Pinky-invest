import React, { useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { LUXURY_ASSETS_DATA } from '../constants';
import { formatCurrency } from '../utils/format';

type AssetsViewProps = ReturnType<typeof useGameState>;

const AnimatedFlexBonus: React.FC<{ value: number }> = ({ value }) => {
    const motionValue = useMotionValue(0);
    const displayValue = useTransform(motionValue, v => `+${v.toFixed(0)}%`);

    useEffect(() => {
        const controls = animate(motionValue, value, {
            duration: 1,
            ease: 'easeOut'
        });
        return controls.stop;
    }, [value, motionValue]);

    return <motion.p className="text-3xl font-bold text-white">{displayValue}</motion.p>;
};

const AssetCard: React.FC<{
    asset: (typeof LUXURY_ASSETS_DATA)[0],
    owned: boolean,
    onBuy: (id: string) => void,
    canAfford: boolean
}> = ({ asset, owned, onBuy, canAfford }) => {
    return (
        <motion.div
            className="bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden shadow-lg group"
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="aspect-square overflow-hidden">
                <motion.div 
                    className="h-full w-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${asset.imageUrl})` }}
                    whileHover={{ scale: 1.05 }}
                />
            </div>
            <div className="p-3">
                <h3 className="font-bold text-base truncate text-white">{asset.name}</h3>
                {owned ? (
                     <div className="w-full mt-2 bg-green-500/20 text-green-300 border border-green-500/30 font-bold py-2 text-center rounded-lg text-sm">
                        Owned
                    </div>
                ) : (
                    <motion.button
                        onClick={() => onBuy(asset.id)}
                        disabled={!canAfford}
                        className="w-full mt-2 bg-[#333] hover:bg-[#444] text-white font-bold py-2 px-2 rounded-lg transition-all disabled:bg-gray-700 disabled:text-white/40 disabled:cursor-not-allowed text-sm"
                        whileHover={{ scale: canAfford ? 1.05 : 1 }}
                        whileTap={{ scale: canAfford ? 0.95 : 1 }}
                    >
                        {formatCurrency(asset.cost)}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

const AssetsView: React.FC<AssetsViewProps> = ({ cash, assets, buyAsset }) => {
    const totalFlex = useMemo(() => {
        return Object.values(assets).reduce((sum, asset) => sum + asset.flexMultiplier, 0);
    }, [assets]);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Luxury Assets</h1>
            <div className="p-6 text-center bg-[#1C1C1E] border border-white/10 rounded-2xl">
                <p className="text-white/70">Total Flex Bonus</p>
                <AnimatedFlexBonus value={totalFlex * 100} />
            </div>

            <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={{
                    show: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
            >
                {LUXURY_ASSETS_DATA.map(asset => (
                    <motion.div key={asset.id} variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}>
                        <AssetCard
                            asset={asset}
                            owned={!!assets[asset.id]}
                            onBuy={buyAsset}
                            canAfford={cash >= asset.cost}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default AssetsView;