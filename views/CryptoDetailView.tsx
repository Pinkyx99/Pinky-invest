import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { Crypto } from '../types';
import { formatCurrency, formatCryptoAmount } from '../utils/format';
import { Icon } from '../components/Icon';
import Sparkline from '../components/Sparkline';

type CryptoDetailProps = ReturnType<typeof useGameState> & {
    crypto: Crypto;
    onBack: () => void;
};

const CryptoDetailView: React.FC<CryptoDetailProps> = ({ crypto, onBack, cash, cryptoHoldings, buyCrypto, sellCrypto }) => {
    const holding = cryptoHoldings[crypto.id];
    const [amount, setAmount] = useState('');

    const numericAmount = parseFloat(amount) || 0;
    const tradeValue = numericAmount * holding.price;

    const canBuy = cash >= tradeValue && numericAmount > 0;
    const canSell = holding.amount >= numericAmount && numericAmount > 0;
    
    const isTycoonCoin = crypto.ticker === 'TYC';
    const logoSrc = isTycoonCoin
    ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2360A5FA"/><stop offset="100%" stop-color="%233B82F6"/></linearGradient></defs><g transform="rotate(45 50 50)"><rect x="20" y="20" width="60" height="60" rx="10" fill="url(%23g)"/></g><g transform="rotate(-45 50 50)"><rect x="20" y="20" width="60" height="60" rx="10" fill="url(%23g)"/></g><circle cx="50" cy="50" r="25" fill="%231F2937"/><text x="50" y="58" font-family="Inter, sans-serif" font-size="28" fill="white" text-anchor="middle" font-weight="bold">T</text></svg>`
    : crypto.logoUrl;

    const handleAction = (action: 'buy' | 'sell') => {
        if (action === 'buy' && canBuy) {
            buyCrypto(crypto.id, numericAmount);
        }
        if (action === 'sell' && canSell) {
            sellCrypto(crypto.id, numericAmount);
        }
        setAmount('');
    }

    const priceHistory = holding.priceHistory.map(value => ({ value }));
    const trend = holding.price >= (holding.priceHistory[holding.priceHistory.length - 2] || holding.price);

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{ exit: { opacity: 0, transition: { duration: 0.2 } } }}
            className="p-4 space-y-4 flex flex-col h-full"
        >
            <motion.div layoutId={`crypto-card-${crypto.id}`} className="bg-transparent">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold mb-2">
                    <Icon name="back" className="w-5 h-5"/> Back
                </button>
            
                <div className="flex items-center space-x-4">
                    <motion.img 
                        layoutId={`crypto-logo-${crypto.id}`}
                        src={logoSrc} 
                        alt={crypto.name} 
                        className="w-12 h-12"
                    />
                    <motion.div 
                        variants={{ initial: {opacity: 0, y: 10}, animate: {opacity: 1, y: 0, transition: { delay: 0.2 }} }}
                    >
                        <h1 className="text-2xl font-bold">{crypto.name}</h1>
                        <p className="text-lg text-white/70">{formatCurrency(holding.price)}</p>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div 
                className="h-48"
                variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { delay: 0.2 } } }}
            >
                 <Sparkline data={priceHistory} color={trend ? '#34d399' : '#f87171'} />
            </motion.div>

            <motion.div
                variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
                }}
                className="space-y-4 flex-grow flex flex-col justify-end"
            >
                <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
                    <div className="p-4 bg-[#1C1C1E] border border-white/10 rounded-xl">
                        <p className="text-sm text-white/60">Your Balance</p>
                        <div className="flex justify-between items-baseline">
                            <p className="text-2xl font-semibold">{formatCryptoAmount(holding.amount)} {crypto.ticker}</p>
                            <p className="text-white/80">{formatCurrency(holding.value)}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="space-y-2">
                    <div className="relative">
                        <input 
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Amount in ${crypto.ticker}`}
                            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg p-4 text-white text-lg focus:ring-1 focus:ring-white/20 focus:outline-none transition"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">{crypto.ticker}</span>
                    </div>
                    <p className="text-center text-white/70 h-6">
                        {numericAmount > 0 && `Value: ${formatCurrency(tradeValue)}`}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button 
                            onClick={() => handleAction('buy')}
                            disabled={!canBuy}
                            className="bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 font-bold py-4 rounded-xl transition text-lg"
                            whileTap={{ scale: 0.95 }}
                        >Buy</motion.button>
                        <motion.button
                            onClick={() => handleAction('sell')}
                            disabled={!canSell}
                            className="bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 font-bold py-4 rounded-xl transition text-lg"
                            whileTap={{ scale: 0.95 }}
                        >Sell</motion.button>
                    </div>
                </motion.div>
            </motion.div>

        </motion.div>
    );
};

export default CryptoDetailView;