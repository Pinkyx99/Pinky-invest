
import { useState, useCallback } from 'react';
import { GameState, Activity, CryptoTrend } from '../types';
import { CLICK_UPGRADES, PROPERTIES_DATA, CRYPTO_DATA, LUXURY_ASSETS_DATA, PRESTIGE_REQUIREMENT, PRESTIGE_MULTIPLIER_PER_LEVEL } from '../constants';
import { fetchCryptoPrices } from '../services/cryptoService';

const initialCryptoHoldings = CRYPTO_DATA.reduce((acc, crypto) => {
    acc[crypto.id] = {
        id: crypto.id,
        amount: 0,
        price: crypto.id === 'tycooncoin' ? 1 : 0,
        value: 0,
        priceHistory: Array(30).fill(crypto.id === 'tycooncoin' ? 1 : 0),
    };
    return acc;
}, {} as GameState['cryptoHoldings']);

const INITIAL_STATE: GameState = {
  cash: 10,
  clickLevel: 1,
  tycoonLevel: 0,
  properties: {},
  cryptoHoldings: initialCryptoHoldings,
  assets: {},
  activityFeed: [{ id: Date.now().toString(), text: 'Welcome to Tycoon Aurora!', type: 'neutral' }],
};

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

    const addActivity = useCallback((text: string, type: Activity['type']) => {
        setGameState(prev => ({
            ...prev,
            activityFeed: [{ id: Date.now().toString(), text, type }, ...prev.activityFeed.slice(0, 49)],
        }));
    }, []);

    const prestige = useCallback(() => {
        const netWorth = Object.values(gameState.properties).reduce((s, p) => s + p.value, 0) +
                         Object.values(gameState.cryptoHoldings).reduce((s, c) => s + c.value, 0) +
                         Object.values(gameState.assets).reduce((s, a) => s + a.value, 0) +
                         gameState.cash;

        if (netWorth >= PRESTIGE_REQUIREMENT) {
            const newTycoonLevel = gameState.tycoonLevel + 1;
            setGameState({
                ...INITIAL_STATE,
                tycoonLevel: newTycoonLevel,
                activityFeed: [{ id: Date.now().toString(), text: `Went Tycoon! Level ${newTycoonLevel} reached!`, type: 'prestige' }, ...gameState.activityFeed],
            });
            addActivity(`Prestige Bonus is now +${newTycoonLevel * PRESTIGE_MULTIPLIER_PER_LEVEL * 100}%!`, 'prestige');
        }
    }, [gameState.cash, gameState.properties, gameState.cryptoHoldings, gameState.assets, gameState.tycoonLevel, addActivity]);


    const addCash = useCallback((amount: number) => {
        setGameState(prev => ({ ...prev, cash: prev.cash + amount }));
    }, []);

    const removeCash = useCallback((amount: number) => {
        setGameState(prev => ({ ...prev, cash: prev.cash - amount }));
        return true; 
    }, []);
    
    const earnByClick = useCallback(() => {
        const clickValue = CLICK_UPGRADES[gameState.clickLevel - 1].clickValue;
        const prestigeBonus = 1 + gameState.tycoonLevel * PRESTIGE_MULTIPLIER_PER_LEVEL;
        const totalClickValue = clickValue * prestigeBonus;
        addCash(totalClickValue);
    }, [gameState.clickLevel, gameState.tycoonLevel, addCash]);

    const upgradeClick = useCallback(() => {
        const nextUpgrade = CLICK_UPGRADES[gameState.clickLevel];
        if (nextUpgrade && gameState.cash >= nextUpgrade.cost) {
            removeCash(nextUpgrade.cost);
            setGameState(prev => ({ ...prev, clickLevel: prev.clickLevel + 1 }));
            addActivity(`Upgraded click to Lvl ${nextUpgrade.level}!`, 'gain');
        }
    }, [gameState.cash, gameState.clickLevel, removeCash, addActivity]);
    
    const buyOrUpgradeProperty = useCallback((id: string) => {
        const propertyData = PROPERTIES_DATA.find(p => p.id === id);
        if (!propertyData) return;

        const owned = gameState.properties[id];
        const level = owned ? owned.level : 0;
        const cost = propertyData.baseCost * Math.pow(1.15, level);

        if (gameState.cash >= cost) {
            removeCash(cost);
            const newLevel = level + 1;
            const newIncome = propertyData.baseIncome * newLevel * Math.pow(1.05, newLevel - 1);
            const newValue = propertyData.baseCost * Math.pow(1.15, newLevel - 1);

            setGameState(prev => ({
                ...prev,
                properties: {
                    ...prev.properties,
                    [id]: { level: newLevel, income: newIncome, value: newValue },
                },
            }));
            addActivity(`${owned ? 'Upgraded' : 'Bought'} ${propertyData.name} to Lvl ${newLevel}`, 'gain');
        }
    }, [gameState.cash, gameState.properties, removeCash, addActivity]);

    const buyAsset = useCallback((id: string) => {
        const assetData = LUXURY_ASSETS_DATA.find(a => a.id === id);
        if (!assetData || gameState.assets[id] || gameState.cash < assetData.cost) return;

        removeCash(assetData.cost);
        setGameState(prev => ({
            ...prev,
            assets: {
                ...prev.assets,
                [id]: { id: id, value: assetData.cost, flexMultiplier: assetData.flexMultiplier },
            },
        }));
        addActivity(`Acquired ${assetData.name}!`, 'gain');
    }, [gameState.cash, gameState.assets, removeCash, addActivity]);
    
    const updateCryptoPrices = useCallback(async (trend: CryptoTrend) => {
        const realWorldPrices = await fetchCryptoPrices();
        setGameState(prev => {
            const newHoldings = { ...prev.cryptoHoldings };
            Object.keys(newHoldings).forEach(id => {
                const crypto = newHoldings[id];
                let newPrice = crypto.price;
                if(realWorldPrices[id]){
                    newPrice = realWorldPrices[id];
                } else if (id === 'tycooncoin') {
                    const volatility = 0.05;
                    let changePercent = (Math.random() - 0.5) * volatility;
                    if (trend === 'bull') changePercent += volatility * 1.5;
                    if (trend === 'bear') changePercent -= volatility * 1.5;
                    newPrice = Math.max(0.01, crypto.price * (1 + changePercent));
                }
                
                const newHistory = [...crypto.priceHistory.slice(1), newPrice];
                newHoldings[id] = {
                    ...crypto,
                    price: newPrice,
                    value: crypto.amount * newPrice,
                    priceHistory: newHistory
                };
            });
            return { ...prev, cryptoHoldings: newHoldings };
        });
    }, []);

    const buyCrypto = useCallback((id: string, amount: number) => {
        const crypto = gameState.cryptoHoldings[id];
        if (!crypto || amount <= 0) return;
        const cost = amount * crypto.price;
        if (gameState.cash >= cost) {
            removeCash(cost);
            setGameState(prev => ({
                ...prev,
                cryptoHoldings: {
                    ...prev.cryptoHoldings,
                    [id]: { ...prev.cryptoHoldings[id], amount: prev.cryptoHoldings[id].amount + amount },
                },
            }));
            addActivity(`Bought ${formatCryptoAmount(amount)} ${CRYPTO_DATA.find(c=>c.id===id)?.ticker}`, 'neutral');
        }
    }, [gameState.cash, gameState.cryptoHoldings, removeCash, addActivity]);

    const sellCrypto = useCallback((id: string, amount: number) => {
        const crypto = gameState.cryptoHoldings[id];
        if (!crypto || amount <= 0 || crypto.amount < amount) return;
        const gain = amount * crypto.price;
        addCash(gain);
        setGameState(prev => ({
            ...prev,
            cryptoHoldings: {
                ...prev.cryptoHoldings,
                [id]: { ...prev.cryptoHoldings[id], amount: prev.cryptoHoldings[id].amount - amount },
            },
        }));
        addActivity(`Sold ${formatCryptoAmount(amount)} ${CRYPTO_DATA.find(c=>c.id===id)?.ticker}`, 'neutral');
    }, [gameState.cryptoHoldings, addCash, addActivity]);

    const formatCryptoAmount = (num: number): string => {
        if (num > 1000) return num.toFixed(2);
        if (num > 1) return num.toFixed(4);
        return num.toPrecision(4);
    };

    return { 
        ...gameState, 
        addCash, 
        removeCash, 
        earnByClick, 
        upgradeClick,
        buyOrUpgradeProperty,
        buyAsset,
        updateCryptoPrices,
        buyCrypto,
        sellCrypto,
        addActivity,
        prestige
    };
};
