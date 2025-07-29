
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { MinesGameState } from '../../types';
import { CASINO_MINES_GRID_SIZE } from '../../constants';
import { formatCurrency, formatNumber } from '../../utils/format';
import { Icon } from '../../components/Icon';
import GlassCard from '../../components/GlassCard';

type MinesGameProps = ReturnType<typeof useGameState> & {
    onBack: () => void;
};

const Tile: React.FC<{
    type: 'gem' | 'mine' | null;
    isRevealed: boolean;
    isGameOverMine: boolean;
    delay: number;
    onClick: () => void;
}> = ({ type, isRevealed, isGameOverMine, delay, onClick }) => {
    
    const [showSparkle, setShowSparkle] = useState(false);
    useEffect(() => {
        if (isRevealed && type === 'gem') {
            setShowSparkle(true);
        }
    }, [isRevealed, type]);

    return (
        <div className="aspect-square" style={{ perspective: '800px' }}>
            <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{ rotateY: (isRevealed || isGameOverMine) ? 180 : 0 }}
                transition={{ duration: 0.5, delay }}
            >
                {/* Back */}
                <div
                    onClick={onClick}
                    className="absolute w-full h-full bg-gray-700/50 hover:bg-gray-700/80 rounded-lg cursor-pointer"
                    style={{ backfaceVisibility: 'hidden' }}
                />
                {/* Front */}
                <div
                    className="absolute w-full h-full bg-gray-900 rounded-lg flex items-center justify-center"
                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                    {type === 'gem' ? (
                        <div className="relative">
                           <Icon name="gem" className="w-8 h-8 text-blue-400"/>
                           <AnimatePresence>
                           {showSparkle && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    onAnimationComplete={() => setShowSparkle(false)}
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, opacity: 1, rotate: Math.random() * 360 }}
                                            animate={{ scale: [1.5, 0], opacity: [1, 0] }}
                                            transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                                            className="absolute"
                                        >
                                           <Icon name="sparkles" className="w-6 h-6 text-yellow-300" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                           )}
                           </AnimatePresence>
                        </div>
                    ) : (
                        <Icon name="mine" className="w-8 h-8 text-red-500"/>
                    )}
                </div>
            </motion.div>
        </div>
    );
};


const MinesGame: React.FC<MinesGameProps> = ({ cash, addCash, removeCash, addActivity, onBack }) => {
    const [gameState, setGameState] = useState<MinesGameState | null>(null);
    const [bet, setBet] = useState('100');
    const [mines, setMines] = useState(3);
    
    const numericBet = parseInt(bet, 10);
    const isBetValid = !isNaN(numericBet) && numericBet > 0;

    const gemsCount = CASINO_MINES_GRID_SIZE - mines;

    const calculateMultiplier = (revealedGems: number) => {
        if (revealedGems === 0) return 1;
        let multiplier = 1;
        // This is a simplified, less aggressive multiplier formula
        for (let i = 0; i < revealedGems; i++) {
            multiplier *= (1 + (mines / CASINO_MINES_GRID_SIZE) * 0.8);
        }
        return multiplier;
    };

    const startGame = () => {
        if (!isBetValid || cash < numericBet) return;
        removeCash(numericBet);
        
        const grid: MinesGameState['grid'] = Array(CASINO_MINES_GRID_SIZE).fill('gem');
        let minesPlaced = 0;
        while(minesPlaced < mines) {
            const index = Math.floor(Math.random() * CASINO_MINES_GRID_SIZE);
            if(grid[index] === 'gem') {
                grid[index] = 'mine';
                minesPlaced++;
            }
        }
        
        setGameState({
            grid,
            revealed: Array(CASINO_MINES_GRID_SIZE).fill(false),
            mines,
            bet: numericBet,
            multiplier: 1,
            gameOver: false,
            isWin: null
        });
        addActivity(`Started Mines with a ${formatCurrency(numericBet)} bet.`, 'neutral');
    };

    const handleTileClick = (index: number) => {
        if (!gameState || gameState.gameOver || gameState.revealed[index]) return;

        const newRevealed = [...gameState.revealed];
        newRevealed[index] = true;

        if (gameState.grid[index] === 'mine') {
            setGameState({ ...gameState, revealed: newRevealed, gameOver: true, isWin: false });
            addActivity(`Hit a mine! Lost ${formatCurrency(gameState.bet)}.`, 'loss');
        } else {
            const revealedGems = newRevealed.filter((r, i) => r && gameState.grid[i] === 'gem').length;
            const newMultiplier = calculateMultiplier(revealedGems);
            setGameState({ ...gameState, revealed: newRevealed, multiplier: newMultiplier });
        }
    };
    
    const cashOut = () => {
        if (!gameState || gameState.gameOver) return;
        const winnings = gameState.bet * gameState.multiplier;
        addCash(winnings);
        setGameState({ ...gameState, gameOver: true, isWin: true });
        addActivity(`Cashed out ${formatCurrency(winnings)} from Mines!`, 'gain');
    };
    
    const canCashOut = gameState && !gameState.gameOver && gameState.revealed.some(r => r);
    
    const gridAnimation = gameState?.gameOver && gameState.isWin === false 
        ? { x: [0, -5, 5, -5, 5, 0] } 
        : {};

    return (
        <motion.div
            key="mines"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="p-4 space-y-4 h-full flex flex-col"
        >
            <div className="flex items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-blue-400 font-semibold">
                    <Icon name="back" className="w-5 h-5"/> Casino
                </button>
                <h2 className="text-2xl font-bold text-center flex-1">Mines</h2>
            </div>

            {!gameState ? (
                <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                    <GlassCard className="w-full p-4 space-y-4">
                        <div>
                            <label className="text-sm text-white/70">Bet Amount</label>
                            <input type="text" value={bet} onChange={e => setBet(e.target.value)} pattern="[0-9]*" inputMode="numeric" className="w-full bg-gray-900 p-2 rounded-lg border border-gray-700" />
                        </div>
                         <div>
                            <label className="text-sm text-white/70">Mines (3-20)</label>
                            <input type="number" value={mines} onChange={e => setMines(Math.max(3, Math.min(20, Number(e.target.value))))} className="w-full bg-gray-900 p-2 rounded-lg border border-gray-700" />
                        </div>
                    </GlassCard>
                     <motion.button 
                        onClick={startGame}
                        disabled={!isBetValid || cash < numericBet}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl disabled:bg-gray-700 disabled:text-white/40"
                        whileTap={{ scale: 0.95 }}
                    >
                        Place Bet ({isBetValid ? formatCurrency(numericBet) : '...'})
                    </motion.button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col space-y-4">
                     <motion.div 
                        className="grid grid-cols-5 gap-2"
                        animate={gridAnimation}
                        transition={{ duration: 0.3 }}
                    >
                        {gameState.grid.map((type, index) => (
                           <Tile
                                key={index}
                                type={type}
                                isRevealed={gameState.revealed[index]}
                                isGameOverMine={gameState.gameOver && gameState.isWin === false && type === 'mine'}
                                delay={gameState.gameOver && gameState.isWin === false && type === 'mine' ? index * 0.04 : 0}
                                onClick={() => handleTileClick(index)}
                           />
                        ))}
                    </motion.div>
                    <GlassCard className="p-4 text-center">
                        <p className="text-sm text-white/70">Next Payout</p>
                         <p className="text-2xl font-bold text-green-400">
                           {formatNumber(calculateMultiplier(gameState.revealed.filter((r,i) => r && gameState.grid[i] === 'gem').length + 1) * gameState.bet)}
                        </p>
                        <p className="text-sm text-white/70">({formatNumber(calculateMultiplier(gameState.revealed.filter((r,i) => r && gameState.grid[i] === 'gem').length + 1))}x)</p>
                    </GlassCard>
                    {gameState.gameOver ? (
                        <motion.button 
                            onClick={() => setGameState(null)}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl"
                            whileTap={{ scale: 0.95 }}
                        >
                            Play Again
                        </motion.button>
                    ) : (
                        <motion.button 
                            onClick={cashOut}
                            disabled={!canCashOut}
                            className="w-full bg-green-500/80 text-white font-bold py-4 rounded-xl disabled:bg-gray-700"
                            whileTap={{ scale: 0.95 }}
                        >
                            Cash Out {formatCurrency(gameState.bet * gameState.multiplier)}
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default MinesGame;
