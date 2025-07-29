
import { ClickUpgrade, Property, Crypto, LuxuryAsset } from './types';

export const TICK_RATE = 100; // ms per game tick
export const TICKS_PER_SECOND = 1000 / TICK_RATE;

export const CLICK_UPGRADES: ClickUpgrade[] = [
  { level: 1, cost: 0, clickValue: 1 },
  { level: 2, cost: 50, clickValue: 2 },
  { level: 3, cost: 250, clickValue: 5 },
  { level: 4, cost: 1000, clickValue: 10 },
  { level: 5, cost: 5000, clickValue: 25 },
  { level: 6, cost: 20000, clickValue: 75 },
  { level: 7, cost: 100000, clickValue: 250 },
  { level: 8, cost: 500000, clickValue: 1000 },
  { level: 9, cost: 2.5e6, clickValue: 5000 },
  { level: 10, cost: 10e6, clickValue: 25000 },
];

export const PROPERTIES_DATA: Property[] = [
  { id: 'apt', name: 'Studio Apartment', location: 'City Center', baseCost: 1000, baseIncome: 1, imageUrl: 'https://picsum.photos/seed/apt/400/300' },
  { id: 'house', name: 'Suburban House', location: 'Maple Street', baseCost: 25000, baseIncome: 20, imageUrl: 'https://picsum.photos/seed/house/400/300' },
  { id: 'office', name: 'Office Building', location: 'Financial District', baseCost: 500000, baseIncome: 350, imageUrl: 'https://picsum.photos/seed/office/400/300' },
  { id: 'skyscraper', name: 'Skyscraper', location: 'Downtown', baseCost: 10e6, baseIncome: 5000, imageUrl: 'https://picsum.photos/seed/skyscraper/400/300' },
  { id: 'island', name: 'Private Island', location: 'The Tropics', baseCost: 500e6, baseIncome: 150000, imageUrl: 'https://picsum.photos/seed/island/400/300' },
];

export const CRYPTO_DATA: Crypto[] = [
  { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', isVolatile: true },
  { id: 'ethereum', name: 'Ethereum', ticker: 'ETH', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', isVolatile: true },
  { id: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png', isVolatile: true },
  { id: 'tycooncoin', name: 'TycoonCoin', ticker: 'TYC', logoUrl: '/tycoon-coin.svg', isVolatile: true },
];

export const LUXURY_ASSETS_DATA: LuxuryAsset[] = [
  { id: 'supercar', name: 'Supercar', cost: 1e6, imageUrl: 'https://picsum.photos/seed/car/400/400', flexMultiplier: 0.05 },
  { id: 'yacht', name: 'Mega Yacht', cost: 25e6, imageUrl: 'https://picsum.photos/seed/yacht/400/400', flexMultiplier: 0.10 },
  { id: 'jet', name: 'Private Jet', cost: 100e6, imageUrl: 'https://picsum.photos/seed/jet/400/400', flexMultiplier: 0.15 },
  { id: 'masterpiece', name: 'Art Masterpiece', cost: 1e9, imageUrl: 'https://picsum.photos/seed/art/400/400', flexMultiplier: 0.20 },
  { id: 'space', name: 'Space Mission', cost: 10e9, imageUrl: 'https://picsum.photos/seed/space/400/400', flexMultiplier: 0.50 },
];

export const PRESTIGE_REQUIREMENT = 10e9; // $10 Billion
export const PRESTIGE_MULTIPLIER_PER_LEVEL = 1; // +100% per level

export const CASINO_MINES_GRID_SIZE = 25;
export const CASINO_CRASH_MIN_BET = 100;
export const CASINO_BLACKJACK_MIN_BET = 500;
