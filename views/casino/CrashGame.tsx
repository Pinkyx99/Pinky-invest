
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useGameState } from '../../hooks/useGameState';
import { formatCurrency, formatNumber } from '../../utils/format';
import { Icon } from '../../components/Icon';

type CrashGameProps = ReturnType<typeof useGameState> & { onBack: () => void };
type GamePhase = 'betting' | 'running' | 'crashed';

const useParticles = (isEmitting: boolean) => {
    const [particles, setParticles] = useState<any[]>([]);
    
    useEffect(() => {
        if (!isEmitting) return;

        const interval = setInterval(() => {
            const newParticle = {
                id: Math.random(),
                x: 0,
                y: 0,
                scale: Math.random() * 0.5 + 0.5,
                duration: Math.random() * 1 + 0.5,
            };
            setParticles(current => [...current.slice(-20), newParticle]);
        }, 100);

        return () => clearInterval(interval);
    }, [isEmitting]);
    
    return [particles, setParticles] as const;
};

const CrashGame: React.FC<CrashGameProps> = ({ cash, addCash, removeCash, addActivity, onBack }) => {
    const [bet, setBet] = useState('100');
    const [placedBet, setPlacedBet] = useState(0);
    const [phase, setPhase] = useState<GamePhase>('betting');
    const [multiplier, setMultiplier] = useState(1.0);
    const [crashPoint, setCrashPoint] = useState(1.0);
    const [chartData, setChartData] = useState([{ time: 0, value: 1.0 }]);
    const [hasCashedOut, setHasCashedOut] = useState(false);

    const animationFrameRef = useRef<number | undefined>(undefined);
    const [particles, setParticles] = useParticles(phase === 'running');
    
    const numericBet = parseInt(bet, 10);
    const isBetValid = !isNaN(numericBet) && numericBet > 0;

    const generateCrashPoint = () => {
        const r = Math.pow(Math.random(), 1.1); // Skew random number towards 0 for more frequent early crashes
        return Math.max(1.01, 1 / (1 - r));
    };

    const startGame = () => {
        if (!isBetValid || cash < numericBet) return;

        setPlacedBet(numericBet);
        removeCash(numericBet);
        addActivity(`Placed a ${formatCurrency(numericBet)} bet on Crash.`, 'neutral');

        setCrashPoint(generateCrashPoint());
        setMultiplier(1.0);
        setChartData([{ time: 0, value: 1.0 }]);
        setHasCashedOut(false);
        setPhase('running');
    };

    const cashOut = () => {
        if (phase !== 'running' || hasCashedOut) return;
        const winnings = placedBet * multiplier;
        addCash(winnings);
        setHasCashedOut(true);
        addActivity(`Cashed out ${formatCurrency(winnings)} from Crash!`, 'gain');
    };

    const resetGame = () => setPhase('betting');
    
    useEffect(() => {
        if (phase === 'running') {
            const startTime = Date.now();
            const animate = () => {
                const elapsed = (Date.now() - startTime) / 1000;
                // Slower multiplier growth
                const newMultiplier = Math.pow(1.04, elapsed);

                if (newMultiplier >= crashPoint) {
                    setMultiplier(crashPoint);
                    setPhase('crashed');
                    if (!hasCashedOut) addActivity(`Crashed! Lost ${formatCurrency(placedBet)}.`, 'loss');
                } else {
                    setMultiplier(newMultiplier);
                    setChartData(prev => [...prev.slice(-100), { time: elapsed, value: newMultiplier }]);
                    animationFrameRef.current = requestAnimationFrame(animate);
                }
            };
            animationFrameRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [phase, crashPoint, hasCashedOut, placedBet, addActivity]);

    const getButton = () => {
        switch (phase) {
            case 'betting':
                return <motion.button onClick={startGame} disabled={!isBetValid || cash < numericBet} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl disabled:bg-gray-700 disabled:text-white/40" whileTap={{ scale: 0.95 }}>Place Bet ({isBetValid ? formatCurrency(numericBet) : '...'})</motion.button>;
            case 'running':
                 return <motion.button onClick={cashOut} disabled={hasCashedOut} className={`w-full font-bold py-4 rounded-xl ${hasCashedOut ? 'bg-gray-700 text-white/40' : 'bg-green-600 text-white'}`} whileTap={{ scale: 0.95 }}>{hasCashedOut ? `Cashed Out @ ${formatNumber(multiplier)}x` : `Cash Out ${formatCurrency(placedBet * multiplier)}`}</motion.button>;
            case 'crashed':
                return <motion.button onClick={resetGame} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl" whileTap={{ scale: 0.95 }}>Play Again</motion.button>;
        }
    };

    const multiplierColor = phase === 'running' ? (hasCashedOut ? 'text-green-400' : 'text-white') : 'text-red-500';

    return (
        <motion.div
            key="crash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 space-y-4 h-full flex flex-col"
        >
            <div className="flex items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-blue-400 font-semibold"><Icon name="back" className="w-5 h-5"/> Casino</button>
                <h2 className="text-2xl font-bold text-center flex-1">Crash</h2>
            </div>
            
            <motion.div 
              className="relative flex-1 bg-gray-900/70 rounded-xl p-2 overflow-hidden"
              animate={phase === 'crashed' && !hasCashedOut ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <Line type="monotone" dataKey="value" stroke={phase === 'crashed' ? "#ef4444" : "#60a5fa"} strokeWidth={4} dot={false} isAnimationActive={false} style={{filter: `drop-shadow(0 0 5px ${phase === 'crashed' ? '#ef4444' : '#60a5fa'})`}} />
                    </LineChart>
                </ResponsiveContainer>
                <AnimatePresence>
                {phase === 'crashed' && !hasCashedOut &&
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-red-500/20"
                        initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                    >
                         <motion.h2 
                            className="text-5xl font-bold text-white" 
                            style={{textShadow: '0 0 10px white'}}
                            initial={{scale: 0.5, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{type:'spring', stiffness: 300, damping: 15, delay: 0.1}}
                         >CRASHED!</motion.h2>
                    </motion.div>
                }
                </AnimatePresence>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h2 className={`text-6xl font-bold transition-colors ${multiplierColor}`} style={{textShadow: '0 0 15px currentColor'}}>
                        {formatNumber(multiplier)}x
                    </h2>
                     <div className="absolute bottom-0 right-0">
                        {particles.map(p => (
                            <motion.div 
                                key={p.id}
                                className="absolute rounded-full bg-blue-400"
                                style={{
                                    width: 8, height: 8, bottom: chartData[chartData.length-1].value / crashPoint * 100 + '%', right: 0
                                }}
                                initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
                                animate={{ x: -Math.random() * 200, y: (Math.random() - 0.5) * 100, opacity: 0 }}
                                transition={{ duration: p.duration, ease: 'easeOut' }}
                                onAnimationComplete={() => setParticles(ps => ps.filter(ps => ps.id !== p.id))}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {phase === 'betting' && (
                <div className="bg-gray-800/50 p-4 rounded-xl">
                    <label className="text-sm text-white/70">Bet Amount</label>
                    <input type="text" value={bet} onChange={e => setBet(e.target.value)} pattern="[0-9]*" inputMode="numeric" className="w-full bg-gray-900 p-2 rounded-lg border border-gray-700" />
                </div>
            )}
            
            {getButton()}
        </motion.div>
    );
};

export default CrashGame;
