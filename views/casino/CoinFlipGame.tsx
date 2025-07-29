
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { formatCurrency } from '../../utils/format';
import { Icon } from '../../components/Icon';
import GlassCard from '../../components/GlassCard';

type CoinFlipGameProps = ReturnType<typeof useGameState> & {
    onBack: () => void;
};

type Choice = 'heads' | 'tails';
type GamePhase = 'betting' | 'flipping' | 'result';

const Coin: React.FC<{ isFlipping: boolean, result: Choice | null }> = ({ isFlipping, result }) => {
    const variants: Variants = {
        flipping: {
            rotateY: [0, 360 * 5 + (result === 'tails' ? 180 : 0)],
            transition: { duration: 3, ease: 'circOut' }
        },
        still: {
            rotateY: result === 'tails' ? 180 : 0,
            transition: { duration: 0 }
        }
    };

    return (
        <div className="w-48 h-48" style={{ perspective: '1000px' }}>
            <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
                variants={variants}
                animate={isFlipping ? 'flipping' : 'still'}
            >
                {/* Heads */}
                <div className="absolute w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500" style={{ backfaceVisibility: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
                    <p className="text-6xl font-extrabold text-yellow-900" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>H</p>
                </div>
                {/* Tails */}
                <div className="absolute w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
                    <p className="text-6xl font-extrabold text-gray-900" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>T</p>
                </div>
            </motion.div>
        </div>
    );
};


const CoinFlipGame: React.FC<CoinFlipGameProps> = ({ cash, addCash, removeCash, addActivity, onBack }) => {
    const [bet, setBet] = useState('100');
    const [choice, setChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<Choice | null>(null);
    const [phase, setPhase] = useState<GamePhase>('betting');
    
    const numericBet = parseInt(bet, 10);
    const isBetValid = !isNaN(numericBet) && numericBet > 0;

    const handleFlip = (playerChoice: Choice) => {
        if (!isBetValid || cash < numericBet) return;

        setChoice(playerChoice);
        setPhase('flipping');
        removeCash(numericBet);
        
        const flipResult: Choice = Math.random() < 0.5 ? 'heads' : 'tails';
        setResult(flipResult);
        
        addActivity(`Bet ${formatCurrency(numericBet)} on ${playerChoice} in Coin Flip.`, 'neutral');

        setTimeout(() => {
            setPhase('result');
            if (playerChoice === flipResult) {
                const winnings = numericBet * 1.95; // Payout is 1.95x, not 2x, for a house edge
                addCash(winnings);
                addActivity(`Won ${formatCurrency(winnings)} in Coin Flip!`, 'gain');
            } else {
                addActivity(`Lost ${formatCurrency(numericBet)} in Coin Flip.`, 'loss');
            }
        }, 3000); // Duration of the animation
    };

    const resetGame = () => {
        setPhase('betting');
        setChoice(null);
        setResult(null);
    };
    
    const isWin = choice === result;

    return (
        <motion.div
            key="coin-flip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4 h-full flex flex-col"
        >
            <div className="flex items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-blue-400 font-semibold">
                    <Icon name="back" className="w-5 h-5"/> Casino
                </button>
                <h2 className="text-2xl font-bold text-center flex-1">Coin Flip</h2>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center space-y-8">
                <Coin isFlipping={phase === 'flipping'} result={result} />
                
                <AnimatePresence>
                {phase === 'result' && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h3 className="text-4xl font-bold">{result?.toUpperCase()}</h3>
                        <p className={`text-2xl font-semibold ${isWin ? 'text-green-400' : 'text-red-500'}`}>
                            {isWin ? 'You Win!' : 'You Lose!'}
                        </p>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            
            {phase === 'betting' ? (
                <div className="space-y-4">
                     <GlassCard className="w-full p-4 space-y-2">
                         <label className="text-sm text-white/70">Bet Amount</label>
                         <input type="text" value={bet} onChange={e => setBet(e.target.value)} pattern="[0-9]*" inputMode="numeric" className="w-full bg-gray-900 p-2 rounded-lg border border-gray-700" />
                     </GlassCard>
                     <div className="grid grid-cols-2 gap-4">
                        <motion.button onClick={() => handleFlip('heads')} disabled={!isBetValid || cash < numericBet} className="bg-yellow-500/80 text-white font-bold py-4 rounded-xl disabled:bg-gray-700" whileTap={{scale:0.95}}>Heads</motion.button>
                        <motion.button onClick={() => handleFlip('tails')} disabled={!isBetValid || cash < numericBet} className="bg-gray-400/80 text-white font-bold py-4 rounded-xl disabled:bg-gray-700" whileTap={{scale:0.95}}>Tails</motion.button>
                     </div>
                </div>
            ) : (
                <motion.button 
                    onClick={resetGame}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl" 
                    whileTap={{scale:0.95}}
                    disabled={phase === 'flipping'}
                >
                    Play Again
                </motion.button>
            )}
        </motion.div>
    );
};

export default CoinFlipGame;
