import { useEffect, useState, useRef } from 'react';
import { useGameState } from './useGameState';
import { TICK_RATE, TICKS_PER_SECOND, PROPERTIES_DATA, PRESTIGE_MULTIPLIER_PER_LEVEL } from '../constants';
import { CryptoTrend } from '../types';

type GameStateActions = ReturnType<typeof useGameState>;

export const useGameLoop = (gameState: GameStateActions) => {
    const { addCash, updateCryptoPrices, updateStockPrices, properties, assets, tycoonLevel } = gameState;
    const [cryptoTrend, setCryptoTrend] = useState<CryptoTrend>(CryptoTrend.STABLE);

    const gameLoopRef = useRef<number | undefined>(undefined);
    const cryptoUpdateRef = useRef<number | undefined>(undefined);
    const stockUpdateRef = useRef<number | undefined>(undefined);
    const trendUpdateRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        gameLoopRef.current = setInterval(() => {
            const prestigeBonus = 1 + tycoonLevel * PRESTIGE_MULTIPLIER_PER_LEVEL;
            const flexMultiplier = Object.values(assets).reduce((sum, asset) => sum + asset.flexMultiplier, 0);
            const globalMultiplier = prestigeBonus * (1 + flexMultiplier);

            const propertyIncome = Object.entries(properties).reduce((sum, [id, owned]) => {
                const propData = PROPERTIES_DATA.find(p => p.id === id);
                if (!propData) return sum;
                return sum + (owned.income / TICKS_PER_SECOND);
            }, 0);
            
            const totalIncome = propertyIncome * globalMultiplier;

            if (totalIncome > 0) {
                addCash(totalIncome);
            }
        }, TICK_RATE) as unknown as number;

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [addCash, properties, assets, tycoonLevel]);

    useEffect(() => {
        const updatePrices = () => updateCryptoPrices(cryptoTrend);
        updatePrices(); // Initial fetch
        
        cryptoUpdateRef.current = setInterval(updatePrices, 60000) as unknown as number; // Update every 60 seconds
        
        return () => {
            if (cryptoUpdateRef.current) clearInterval(cryptoUpdateRef.current);
        };
    }, [updateCryptoPrices, cryptoTrend]);
    
    useEffect(() => {
        updateStockPrices(); // Initial fetch
        stockUpdateRef.current = setInterval(updateStockPrices, 30000) as unknown as number; // Update every 30 seconds
        
        return () => {
            if (stockUpdateRef.current) clearInterval(stockUpdateRef.current);
        };
    }, [updateStockPrices]);

    useEffect(() => {
        trendUpdateRef.current = setInterval(() => {
            const trends = [CryptoTrend.BULL, CryptoTrend.BEAR, CryptoTrend.STABLE];
            const newTrend = trends[Math.floor(Math.random() * trends.length)];
            setCryptoTrend(newTrend);
        }, 300000) as unknown as number; // Change trend every 5 minutes

        return () => {
            if (trendUpdateRef.current) clearInterval(trendUpdateRef.current);
        };
    }, []);
};