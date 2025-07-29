

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { MinesGameState } from '../../types';
import { CASINO_MINES_GRID_SIZE } from '../../constants';
import { formatCurrency, formatNumber } from '../../utils/format';
import { Icon } from '../../components/Icon';
import GlassCard from '../../components/GlassCard';

type MinesGameProps = ReturnType<typeof useGameState> & {
    onBack: () => void;
};

const MinesGame: React.FC<MinesGameProps> = ({ cash, addCash, removeCash, addActivity, onBack }) => {
    const [gameState, setGameState] = useState<MinesGameState | null>(null);
    const [bet, setBet] = useState(100);
    const [mines, setMines] = useState(3);

    const gemsCount = CASINO_MINES_GRID_SIZE - mines;

    const calculateMultiplier = (revealedGems: number) => {
        if (revealedGems === 0) return 1;
        let multiplier = 1;
        for (let i = 0; i < revealedGems; i++) {
            multiplier *= (CASINO_MINES_GRID_SIZE / (gemsCount - i));
        }
        return multiplier;
    };

    const startGame = () => {
        if (cash < bet) return;
        removeCash(bet);
        
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
            bet,
            multiplier: 1,
            gameOver: false,
            isWin: null
        });
        addActivity(`Started Mines with a ${formatCurrency(bet)} bet.`, 'neutral');
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
                            <input type="number" value={bet} onChange={e => setBet(Math.max(1, Number(e.target.value)))} className="w-full bg-gray-900 p-2 rounded-lg border border-gray-700" />
                        </div>
                         <div>
                            <label className="text-sm text-white/70">Mines (3-20)</label>
                            <input type="number" value={mines} onChange={e => setMines(Math.max(3, Math.min(20, Number(e.target.value))))} className="w-full bg-gray-900 p-2 rounded-lg border border-gray-700" />
                        </div>
                    </GlassCard>
                     <motion.button 
                        onClick={startGame}
                        disabled={cash < bet}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl disabled:bg-gray-700 disabled:text-white/40"
                        whileTap={{ scale: 0.95 }}
                    >
                        Place Bet ({formatCurrency(bet)})
                    </motion.button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                        {gameState.grid.map((type, index) => (
                            <motion.div
                                key={index}
                                onClick={() => handleTileClick(index)}
                                className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer
                                    ${gameState.revealed[index] ? 'bg-gray-900' : 'bg-gray-700/50 hover:bg-gray-700/80'}`
                                }
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.02 }}
                            >
                                {gameState.revealed[index] && (
                                    type === 'gem' 
                                    ? <Icon name="gem" className="w-8 h-8 text-blue-400"/> 
                                    : <Icon name="mine" className="w-8 h-8 text-red-500"/>
                                )}
                            </motion.div>
                        ))}
                    </div>
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