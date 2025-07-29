
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { CRYPTO_DATA } from '../constants';
import { formatCurrency, formatCryptoAmount } from '../utils/format';
import { getAITradingAdvice } from '../services/geminiService';
import Sparkline from '../components/Sparkline';
import Modal from '../components/Modal';
import CryptoDetailView from './CryptoDetailView';
import { Icon } from '../components/Icon';

type CryptoViewProps = ReturnType<typeof useGameState> & { netWorth: number };

const CryptoItem: React.FC<{
    crypto: (typeof CRYPTO_DATA)[0],
    holding: ReturnType<typeof useGameState>['cryptoHoldings'][string],
    onClick: () => void
}> = ({ crypto, holding, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const priceHistory = holding.priceHistory.map(value => ({ value }));
    const currentPrice = priceHistory[priceHistory.length - 1]?.value || 0;
    const prevPrice = priceHistory[priceHistory.length - 2]?.value || currentPrice;
    const priceChange = currentPrice - prevPrice;
    const priceChangePercent = prevPrice !== 0 ? (priceChange / prevPrice) * 100 : 0;
    const trend = priceChange >= 0;
    const color = trend ? '#34d399' : '#f87171';
    
    const isTycoonCoin = crypto.ticker === 'TYC';
    const logoSrc = isTycoonCoin
    ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2360A5FA"/><stop offset="100%" stop-color="%233B82F6"/></linearGradient></defs><g transform="rotate(45 50 50)"><rect x="20" y="20" width="60" height="60" rx="10" fill="url(%23g)"/></g><g transform="rotate(-45 50 50)"><rect x="20" y="20" width="60" height="60" rx="10" fill="url(%23g)"/></g><circle cx="50" cy="50" r="25" fill="%231F2937"/><text x="50" y="58" font-family="Inter, sans-serif" font-size="28" fill="white" text-anchor="middle" font-weight="bold">T</text></svg>`
    : crypto.logoUrl;


    return (
        <motion.div
            onClick={onClick}
            className="p-3 flex items-center gap-3 cursor-pointer rounded-xl hover:bg-[#1C1C1E]"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            layoutId={`crypto-card-${crypto.id}`}
        >
            <motion.img src={logoSrc} alt={crypto.name} className="w-10 h-10" layoutId={`crypto-logo-${crypto.id}`}/>
            <div className="flex-1">
                <p className="font-bold">{crypto.name}</p>
                <p className="text-sm text-white/50">{crypto.ticker}</p>
            </div>
            <div className={`w-20 h-8 ${trend ? 'sparkline-gain' : 'sparkline-loss'}`}>
                <Sparkline data={priceHistory} color={color} showDot={isHovered} />
            </div>
            <div className="text-right w-24">
                 <p className="font-semibold">{formatCurrency(holding.price)}</p>
                 <p className="text-sm" style={{ color }}>{trend ? '+' : ''}{priceChangePercent.toFixed(2)}%</p>
            </div>
        </motion.div>
    )
};

const CryptoView: React.FC<CryptoViewProps> = (props) => {
    const { cash, cryptoHoldings, netWorth } = props;
    const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
    const [isAdvisorOpen, setAdvisorOpen] = useState(false);
    const [advice, setAdvice] = useState('');
    const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

    const handleOpenAdvisor = async () => {
        setAdvisorOpen(true);
        setIsLoadingAdvice(true);
        const newAdvice = await getAITradingAdvice(cash, netWorth);
        setAdvice(newAdvice);
        setIsLoadingAdvice(false);
    };

    return (
        <AnimatePresence>
            {selectedCrypto ? (
                <CryptoDetailView 
                    key={`detail-${selectedCrypto}`}
                    crypto={CRYPTO_DATA.find(c => c.id === selectedCrypto)!} 
                    onBack={() => setSelectedCrypto(null)} 
                    {...props} 
                />
            ) : (
                <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 space-y-4"
                >
                    <h1 className="text-2xl font-bold">Crypto Market</h1>
                    <motion.button 
                        onClick={handleOpenAdvisor}
                        className="w-full bg-[#1C1C1E] border border-white/10 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                        whileHover={{ backgroundColor: '#2a2a2d' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icon name="sparkles" className="w-5 h-5 text-yellow-400" />
                        Consult AI Advisor
                    </motion.button>
                    
                    <motion.div 
                        className="space-y-1"
                        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
                        initial="hidden"
                        animate="show"
                    >
                        {CRYPTO_DATA.map(crypto => (
                            <motion.div key={crypto.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                                <CryptoItem
                                    crypto={crypto}
                                    holding={cryptoHoldings[crypto.id]}
                                    onClick={() => setSelectedCrypto(crypto.id)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    <Modal title="AI Advisor" isOpen={isAdvisorOpen} onClose={() => setAdvisorOpen(false)}>
                        {isLoadingAdvice ? (
                            <div className="flex justify-center items-center h-24">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <p className="text-gray-300 italic text-center text-lg">&ldquo;{advice}&rdquo;</p>
                        )}
                    </Modal>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CryptoView;