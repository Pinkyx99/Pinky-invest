import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { PROPERTIES_DATA, CARS_DATA, OTHER_ASSETS_DATA, STOCKS_DATA, TICKS_PER_SECOND } from '../constants';
import { Property, LuxuryAsset, Stock, OwnedStock } from '../types';
import { formatCurrency, formatNumber, formatCryptoAmount } from '../utils/format';
import { Icon } from '../components/Icon';
import Sparkline from '../components/Sparkline';

type InvestViewProps = ReturnType<typeof useGameState>;
type AssetTab = 'realEstate' | 'garage' | 'luxury' | 'stocks';

// --- Stock Detail View (similar to CryptoDetailView) ---
const StockDetailView: React.FC<InvestViewProps & { stock: Stock, onBack: () => void }> = 
({ stock, onBack, cash, stocks, buyStock, sellStock }) => {
    const holding = stocks[stock.id];
    const [shares, setShares] = useState('');

    const numericShares = parseInt(shares, 10) || 0;
    const tradeValue = numericShares * holding.price;

    const canBuy = cash >= tradeValue && numericShares > 0;
    const canSell = holding.shares >= numericShares && numericShares > 0;

    const logoSrc = `data:image/svg+xml;utf8,${encodeURIComponent(stock.logo)}`;

    const handleAction = (action: 'buy' | 'sell') => {
        if (action === 'buy' && canBuy) {
            buyStock(stock.id, numericShares);
        }
        if (action === 'sell' && canSell) {
            sellStock(stock.id, numericShares);
        }
        setShares('');
    }

    const priceHistory = holding.priceHistory.map(value => ({ value }));
    const trend = holding.price >= (holding.priceHistory[holding.priceHistory.length - 2] || holding.price);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="p-4 space-y-4 flex flex-col h-full"
        >
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold mb-2">
                <Icon name="back" className="w-5 h-5"/> Back
            </button>
            <div className="flex items-center space-x-4">
                <img src={logoSrc} alt={stock.name} className="w-12 h-12 rounded-full bg-white/10 p-1" />
                <div>
                    <h1 className="text-2xl font-bold">{stock.name}</h1>
                    <p className="text-lg text-white/70">{formatCurrency(holding.price)}</p>
                </div>
            </div>
            <div className="h-48">
                <Sparkline data={priceHistory} color={trend ? '#34d399' : '#f87171'} />
            </div>
            <div className="space-y-4 flex-grow flex flex-col justify-end">
                <div className="p-4 bg-[#1C1C1E] border border-white/10 rounded-xl">
                    <p className="text-sm text-white/60">Your Shares</p>
                    <div className="flex justify-between items-baseline">
                        <p className="text-2xl font-semibold">{holding.shares} {stock.ticker}</p>
                        <p className="text-white/80">{formatCurrency(holding.value)}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="relative">
                        <input
                            type="number"
                            value={shares}
                            onChange={(e) => setShares(e.target.value)}
                            placeholder="Number of shares"
                            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg p-4 text-white text-lg focus:ring-1 focus:ring-white/20 focus:outline-none transition"
                        />
                    </div>
                    <p className="text-center text-white/70 h-6">
                        {numericShares > 0 && `Cost: ${formatCurrency(tradeValue)}`}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleAction('buy')} disabled={!canBuy} className="bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 font-bold py-4 rounded-xl transition text-lg">Buy</button>
                        <button onClick={() => handleAction('sell')} disabled={!canSell} className="bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 font-bold py-4 rounded-xl transition text-lg">Sell</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


// --- Stock List Item ---
const StockItem: React.FC<{ stock: Stock, holding: OwnedStock, onClick: () => void }> = ({ stock, holding, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const priceHistory = holding.priceHistory.map(value => ({ value }));
    const currentPrice = priceHistory[priceHistory.length - 1]?.value || 0;
    const prevPrice = priceHistory[priceHistory.length - 2]?.value || currentPrice;
    const priceChange = currentPrice - prevPrice;
    const priceChangePercent = prevPrice !== 0 ? (priceChange / prevPrice) * 100 : 0;
    const trend = priceChange >= 0;
    const color = trend ? '#34d399' : '#f87171';
    
    const logoSrc = `data:image/svg+xml;utf8,${encodeURIComponent(stock.logo)}`;

    return (
        <motion.div
            onClick={onClick}
            className="p-3 flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#1C1C1E]"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
            <img src={logoSrc} alt={stock.name} className="w-10 h-10 rounded-full bg-white/5 p-1"/>
            <div className="flex-1">
                <p className="font-bold">{stock.name}</p>
                <p className="text-sm text-white/50">{stock.ticker}</p>
            </div>
            <div className={`w-20 h-8`}>
                <Sparkline data={priceHistory} color={color} showDot={isHovered} />
            </div>
            <div className="text-right w-24">
                 <p className="font-semibold">{formatCurrency(holding.price)}</p>
                 <p className="text-sm" style={{ color }}>{trend ? '+' : ''}{priceChangePercent.toFixed(2)}%</p>
            </div>
        </motion.div>
    )
};


// --- Asset Card (for properties, cars, etc.) ---
const AssetCard: React.FC<{
    asset: Property | LuxuryAsset;
    assetType: 'property' | 'asset';
    ownedData: any;
    onBuy: (id: string, type: 'property' | 'asset') => void,
    canAfford: boolean
}> = ({ asset, assetType, ownedData, onBuy, canAfford }) => {
    const isProperty = assetType === 'property';
    const ownedLevel = isProperty ? ownedData?.level || 0 : 0;
    const isOwned = isProperty ? ownedLevel > 0 : !!ownedData;

    const cost = isProperty ? (asset as Property).baseCost * Math.pow(1.15, ownedLevel) : (asset as LuxuryAsset).cost;
    const income = isProperty && isOwned ? ownedData.income : 0;

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
    const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - width / 2);
        mouseY.set(clientY - top - height / 2);
    }
    
    return (
        <motion.div
             style={{ perspective: "1000px" }}
             onMouseMove={handleMouseMove}
             onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
             className="w-full"
        >
            <motion.div
                className="bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden shadow-lg relative group/card"
                style={{
                    transformStyle: "preserve-3d",
                    rotateX,
                    rotateY,
                }}
            >
                <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                    style={{ transform: "translateZ(80px)" }}
                >
                    <motion.div
                        className="absolute w-96 h-96 bg-white"
                        style={{
                            left: mouseX,
                            top: mouseY,
                            opacity: useTransform(mouseY, [-150, 0, 150], [0, 0.03, 0]),
                            transform: 'translate(-50%, -50%)',
                            filter: 'blur(80px)',
                        }}
                    />
                </motion.div>

                <motion.div className="w-full h-40 mt-0" style={{ transform: "translateZ(60px)" }}>
                  <img
                    src={asset.imageUrl}
                    height="1000"
                    width="1000"
                    className="h-full w-full object-cover rounded-t-xl group-hover/card:shadow-xl"
                    alt={asset.name}
                  />
                </motion.div>
                
                <div className="p-4">
                    <motion.div style={{ transform: "translateZ(50px)" }}>
                      <h3 className="text-xl font-bold text-white">{asset.name}</h3>
                      {isProperty && <p className="text-sm text-neutral-400 mt-1">{(asset as Property).location}</p>}
                    </motion.div>

                     {isProperty && isOwned && (
                        <motion.div style={{ transform: "translateZ(40px)" }} className="text-right flex-shrink-0 -mt-10">
                             <p className="text-xs text-white/60">Lvl {ownedLevel}</p>
                            <p className="text-green-400 font-semibold">{formatCurrency(income * TICKS_PER_SECOND)}/s</p>
                        </motion.div>
                    )}
                    
                    <motion.div className="mt-8">
                        {isOwned && !isProperty ? (
                             <motion.div style={{ transform: "translateZ(20px)" }} className="w-full bg-green-500/20 text-green-300 border border-green-500/30 font-bold py-3 text-center rounded-xl text-sm">
                                Owned
                            </motion.div>
                        ) : (
                            <motion.button
                                onClick={() => onBuy(asset.id, assetType)}
                                disabled={!canAfford}
                                style={{ transform: "translateZ(20px)" }}
                                className="w-full bg-[#333] hover:bg-[#444] text-white font-bold py-3 px-4 rounded-xl transition-all disabled:bg-gray-700 disabled:text-white/40 disabled:cursor-not-allowed"
                                whileHover={{ scale: canAfford ? 1.05 : 1 }}
                                whileTap={{ scale: canAfford ? 0.95 : 1 }}
                            >
                                {isProperty ? (ownedLevel === 0 ? 'Buy' : 'Upgrade') : 'Buy'} ({formatCurrency(cost)})
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- Main View Component ---
const InvestView: React.FC<InvestViewProps> = (props) => {
    const { cash, properties, assets, stocks } = props;
    const [activeTab, setActiveTab] = useState<AssetTab>('realEstate');
    const [selectedStock, setSelectedStock] = useState<string | null>(null);

    const handleBuy = (id: string, type: 'property' | 'asset' | 'stock') => {
        if (type === 'property') {
            props.buyOrUpgradeProperty(id);
        } else if (type === 'asset') {
            props.buyAsset(id);
        }
    }

    const tabs: { id: AssetTab, label: string, data: any[], type: 'property' | 'asset' | 'stock' }[] = [
        { id: 'realEstate', label: 'Real Estate', data: PROPERTIES_DATA, type: 'property'},
        { id: 'stocks', label: 'Stocks', data: STOCKS_DATA, type: 'stock' },
        { id: 'garage', label: 'Garage', data: CARS_DATA, type: 'asset' },
        { id: 'luxury', label: 'Luxury', data: OTHER_ASSETS_DATA, type: 'asset' }
    ];

    if (selectedStock) {
        const stockData = STOCKS_DATA.find(s => s.id === selectedStock);
        if (!stockData) return null;
        return <StockDetailView {...props} stock={stockData} onBack={() => setSelectedStock(null)} />;
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Invest</h1>
            
            <div className="flex space-x-2 bg-[#1C1C1E] p-1 rounded-xl">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                        } flex-1 relative px-3 py-2 text-sm font-medium transition rounded-lg`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="active-asset-tab"
                                className="absolute inset-0 bg-gray-600/50 rounded-lg"
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                >
                    {tabs.find(t => t.id === activeTab)?.data.map(asset => {
                         const currentTabInfo = tabs.find(t => t.id === activeTab)!;
                         if (currentTabInfo.type === 'stock') {
                             return <StockItem key={asset.id} stock={asset} holding={stocks[asset.id]} onClick={() => setSelectedStock(asset.id)} />
                         } else {
                             const cost = currentTabInfo.type === 'property' 
                                ? (asset as Property).baseCost * Math.pow(1.15, properties[asset.id]?.level || 0)
                                : (asset as LuxuryAsset).cost;
                            return <AssetCard
                                key={asset.id}
                                asset={asset}
                                assetType={currentTabInfo.type as 'property' | 'asset'}
                                ownedData={currentTabInfo.type === 'property' ? properties[asset.id] : assets[asset.id]}
                                onBuy={handleBuy}
                                canAfford={cash >= cost}
                           />
                         }
                    })}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default InvestView;