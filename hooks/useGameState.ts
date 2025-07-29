import { useState, useCallback, useEffect } from 'react';
import { GameState, Activity, CryptoTrend } from '../types';
import { CLICK_UPGRADES, PROPERTIES_DATA, CRYPTO_DATA, STOCKS_DATA, OTHER_ASSETS_DATA, CARS_DATA, PRESTIGE_REQUIREMENT, PRESTIGE_MULTIPLIER_PER_LEVEL, TICKS_PER_SECOND, DAILY_REWARD_BASE } from '../constants';
import { fetchCryptoPrices } from '../services/cryptoService';
import { formatCurrency } from '../utils/format';

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

const initialStockHoldings = STOCKS_DATA.reduce((acc, stock) => {
    acc[stock.id] = {
        id: stock.id,
        shares: 0,
        price: stock.basePrice,
        value: 0,
        priceHistory: Array(30).fill(stock.basePrice),
    };
    return acc;
}, {} as GameState['stocks']);


const INITIAL_STATE: GameState = {
  cash: 10,
  clickLevel: 1,
  tycoonLevel: 0,
  properties: {},
  cryptoHoldings: initialCryptoHoldings,
  stocks: initialStockHoldings,
  assets: {},
  activityFeed: [{ id: Date.now().toString(), text: 'Welcome to Tycoon Aurora!', type: 'neutral' }],
  lastUpdated: Date.now(),
  dailyRewardStreak: 0,
  lastClaimedDailyReward: 0,
};

const getInitialState = () => {
    try {
        const savedStateJSON = localStorage.getItem('tycoonGameState');
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON) as GameState;
            // Ensure new properties exist
            savedState.dailyRewardStreak = savedState.dailyRewardStreak || 0;
            savedState.lastClaimedDailyReward = savedState.lastClaimedDailyReward || 0;
            savedState.stocks = savedState.stocks || initialStockHoldings;
            // Validate saved stocks against current STOCKS_DATA
            Object.keys(savedState.stocks).forEach(id => {
                if(!STOCKS_DATA.find(s => s.id === id)) {
                    delete savedState.stocks[id];
                }
            });
            STOCKS_DATA.forEach(stock => {
                if (!savedState.stocks[stock.id]) {
                    savedState.stocks[stock.id] = initialStockHoldings[stock.id];
                }
            })

            return savedState;
        }
    } catch (error) {
        console.error("Failed to load game state from localStorage", error);
    }
    return INITIAL_STATE;
};

const isSameDay = (ts1: number, ts2: number) => {
    const d1 = new Date(ts1);
    const d2 = new Date(ts2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>(getInitialState);
    const [offlineGains, setOfflineGains] = useState({ cash: 0 });

    useEffect(() => {
        const calculateOfflineProgress = () => {
            const now = Date.now();
            const elapsedSeconds = (now - gameState.lastUpdated) / 1000;
            
            if (elapsedSeconds < 10) return; // Don't calculate for very short periods

            const prestigeBonus = 1 + gameState.tycoonLevel * PRESTIGE_MULTIPLIER_PER_LEVEL;
            const flexMultiplier = Object.values(gameState.assets).reduce((sum, asset) => sum + asset.flexMultiplier, 0);
            const globalMultiplier = prestigeBonus * (1 + flexMultiplier);

            const propertyIncomePerSecond = Object.entries(gameState.properties).reduce((sum, [id, owned]) => {
                const propData = PROPERTIES_DATA.find(p => p.id === id);
                if (!propData) return sum;
                return sum + (owned.income / TICKS_PER_SECOND);
            }, 0);
            
            const earnedCash = propertyIncomePerSecond * globalMultiplier * elapsedSeconds;

            if (earnedCash > 0) {
                setGameState(prev => ({
                    ...prev,
                    cash: prev.cash + earnedCash,
                    lastUpdated: now,
                }));
                setOfflineGains({ cash: earnedCash });
            }
        };

        calculateOfflineProgress();
    }, []); // Run only on initial mount

    const clearOfflineGains = useCallback(() => {
        setOfflineGains({ cash: 0 });
    }, []);

    useEffect(() => {
        try {
            const stateToSave = { ...gameState, lastUpdated: Date.now() };
            localStorage.setItem('tycoonGameState', JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save game state to localStorage", error);
        }
    }, [gameState]);


    const addActivity = useCallback((text: string, type: Activity['type']) => {
        setGameState(prev => ({
            ...prev,
            activityFeed: [{ id: Date.now().toString(), text, type }, ...prev.activityFeed.slice(0, 49)],
        }));
    }, []);
    
    const claimDailyReward = useCallback(() => {
        const now = Date.now();
        if (isSameDay(now, gameState.lastClaimedDailyReward)) {
            return; // Already claimed today
        }
        
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const newStreak = isSameDay(yesterday.getTime(), gameState.lastClaimedDailyReward) ? gameState.dailyRewardStreak + 1 : 1;
        const reward = DAILY_REWARD_BASE * newStreak * (1 + gameState.tycoonLevel);

        setGameState(prev => ({
            ...prev,
            cash: prev.cash + reward,
            dailyRewardStreak: newStreak,
            lastClaimedDailyReward: now
        }));

        addActivity(`Claimed daily reward of ${formatCurrency(reward)}! (Streak: ${newStreak}d)`, 'gain');
    }, [gameState.lastClaimedDailyReward, gameState.dailyRewardStreak, gameState.tycoonLevel, addActivity]);


    const prestige = useCallback(() => {
        const netWorth = Object.values(gameState.properties).reduce((s, p) => s + p.value, 0) +
                         Object.values(gameState.cryptoHoldings).reduce((s, c) => s + c.value, 0) +
                         Object.values(gameState.stocks).reduce((s, c) => s + c.value, 0) +
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
    }, [gameState.cash, gameState.properties, gameState.cryptoHoldings, gameState.stocks, gameState.assets, gameState.tycoonLevel, addActivity]);


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
    
    const ALL_BUYABLE_ASSETS = [...CARS_DATA, ...OTHER_ASSETS_DATA];
    const buyAsset = useCallback((id: string) => {
        const assetData = ALL_BUYABLE_ASSETS.find(a => a.id === id);
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
    
    const updateStockPrices = useCallback(() => {
        setGameState(prev => {
            const newHoldings = { ...prev.stocks };
            Object.keys(newHoldings).forEach(id => {
                const stock = newHoldings[id];
                const volatility = 0.015; // Stocks are less volatile
                const changePercent = (Math.random() - 0.49) * volatility; // Slight upward bias
                const newPrice = Math.max(1.0, stock.price * (1 + changePercent));
                
                const newHistory = [...stock.priceHistory.slice(1), newPrice];
                newHoldings[id] = {
                    ...stock,
                    price: newPrice,
                    value: stock.shares * newPrice,
                    priceHistory: newHistory
                };
            });
            return { ...prev, stocks: newHoldings };
        });
    }, []);

    const buyStock = useCallback((id: string, shares: number) => {
        const stock = gameState.stocks[id];
        if (!stock || shares <= 0) return;
        const cost = shares * stock.price;
        if (gameState.cash >= cost) {
            removeCash(cost);
            setGameState(prev => ({
                ...prev,
                stocks: {
                    ...prev.stocks,
                    [id]: { ...prev.stocks[id], shares: prev.stocks[id].shares + shares },
                },
            }));
            addActivity(`Bought ${shares} share(s) of ${STOCKS_DATA.find(s=>s.id===id)?.ticker}`, 'neutral');
        }
    }, [gameState.cash, gameState.stocks, removeCash, addActivity]);

    const sellStock = useCallback((id: string, shares: number) => {
        const stock = gameState.stocks[id];
        if (!stock || shares <= 0 || stock.shares < shares) return;
        const gain = shares * stock.price;
        addCash(gain);
        setGameState(prev => ({
            ...prev,
            stocks: {
                ...prev.stocks,
                [id]: { ...prev.stocks[id], shares: prev.stocks[id].shares - shares },
            },
        }));
        addActivity(`Sold ${shares} share(s) of ${STOCKS_DATA.find(s=>s.id===id)?.ticker}`, 'neutral');
    }, [gameState.stocks, addCash, addActivity]);

    const formatCryptoAmount = (num: number): string => {
        if (num > 1000) return num.toFixed(2);
        if (num > 1) return num.toFixed(4);
        return num.toPrecision(4);
    };

    const isDailyRewardAvailable = !isSameDay(Date.now(), gameState.lastClaimedDailyReward);

    return { 
        ...gameState, 
        offlineGains,
        isDailyRewardAvailable,
        clearOfflineGains,
        addCash, 
        removeCash, 
        earnByClick, 
        upgradeClick,
        buyOrUpgradeProperty,
        buyAsset,
        updateCryptoPrices,
        buyCrypto,
        sellCrypto,
        updateStockPrices,
        buyStock,
        sellStock,
        addActivity,
        prestige,
        claimDailyReward,
    };
};