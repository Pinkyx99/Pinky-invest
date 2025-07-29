import { ClickUpgrade, Property, Crypto, LuxuryAsset, Stock } from './types';

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
  { id: 'apt', name: 'Studio Apartment', location: 'City Center', baseCost: 1000, baseIncome: 1, imageUrl: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'tiny_home', name: 'Eco Tiny Home', location: 'The Woods', baseCost: 5000, baseIncome: 5, imageUrl: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'house', name: 'Suburban House', location: 'Maple Street', baseCost: 25000, baseIncome: 20, imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'condo', name: 'Luxury Condo', location: 'Ocean View', baseCost: 220000, baseIncome: 150, imageUrl: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'office', name: 'Office Building', location: 'Financial District', baseCost: 500000, baseIncome: 350, imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'beach_house', name: 'Beach House', location: 'Malibu', baseCost: 1.5e6, baseIncome: 800, imageUrl: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'ski_chalet', name: 'Ski Chalet', location: 'Aspen', baseCost: 3e6, baseIncome: 1500, imageUrl: 'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'mansion', name: 'Modern Mansion', location: 'Beverly Hills', baseCost: 5e6, baseIncome: 2500, imageUrl: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'penthouse', name: 'Penthouse Suite', location: 'Manhattan', baseCost: 8e6, baseIncome: 4000, imageUrl: 'https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'skyscraper', name: 'Skyscraper', location: 'Downtown', baseCost: 10e6, baseIncome: 5000, imageUrl: 'https://images.pexels.com/photos/3789895/pexels-photo-3789895.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'vineyard', name: 'Vineyard Estate', location: 'Napa Valley', baseCost: 15e6, baseIncome: 7000, imageUrl: 'https://images.pexels.com/photos/2249959/pexels-photo-2249959.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'castle', name: 'Historic Castle', location: 'Scotland', baseCost: 75e6, baseIncome: 30000, imageUrl: 'https://images.pexels.com/photos/161879/castle-eilean-donan-scotland-161879.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'tech_campus', name: 'Tech Campus', location: 'Silicon Valley', baseCost: 250e6, baseIncome: 100000, imageUrl: 'https://images.pexels.com/photos/220326/pexels-photo-220326.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'island', name: 'Private Island', location: 'The Tropics', baseCost: 500e6, baseIncome: 150000, imageUrl: 'https://images.pexels.com/photos/163273/island-of-moorea-french-polynesia-lagoon-163273.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'underwater_lair', name: 'Underwater Lair', location: 'Secret Trench', baseCost: 1e9, baseIncome: 350000, imageUrl: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'floating_city', name: 'Floating City', location: 'International Waters', baseCost: 20e9, baseIncome: 5e6, imageUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'lunar_base', name: 'Lunar Base', location: 'The Moon', baseCost: 100e9, baseIncome: 20e6, imageUrl: 'https://images.pexels.com/photos/73910/mars-mars-rover-space-travel-robot-73910.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export const CRYPTO_DATA: Crypto[] = [
  { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', isVolatile: true },
  { id: 'ethereum', name: 'Ethereum', ticker: 'ETH', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', isVolatile: true },
  { id: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png', isVolatile: true },
  { id: 'tycooncoin', name: 'TycoonCoin', ticker: 'TYC', logoUrl: '/tycoon-coin.svg', isVolatile: true },
];

export const STOCKS_DATA: Stock[] = [
    { id: 'nexus', name: 'Nexus Dynamics', ticker: 'NXS', basePrice: 150, logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="%2338bdf8" stroke-width="8"><path d="M20 50 L50 20 L80 50 L50 80Z" /><path d="M50 20 L50 80 M20 50 L80 50" /></g></svg>` },
    { id: 'aetherium', name: 'Aetherium Energy', ticker: 'AETH', basePrice: 85, logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 C60 30, 80 40, 80 60 C80 80, 60 90, 50 90 C40 90, 20 80, 20 60 C20 40, 40 30, 50 10 Z" fill="%234ade80" /></svg>` },
    { id: 'quantumleap', name: 'QuantumLeap AI', ticker: 'QAI', basePrice: 320, logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 15 A 35 25 0 0 1 50 85 A 35 25 0 0 1 50 15" fill="none" stroke="%23a78bfa" stroke-width="8"/><circle cx="50" cy="50" r="10" fill="%23a78bfa"/></svg>` },
    { id: 'helios', name: 'Helios Corp', ticker: 'HLC', basePrice: 210, logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" fill="%23facc15"/><path d="M20 60 A 45 20 0 0 0 80 60" fill="none" stroke="%23facc15" stroke-width="8"/></svg>` },
];

export const CARS_DATA: LuxuryAsset[] = [
    { id: 'sports_car', name: 'Sports Car', cost: 150e3, imageUrl: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.02 },
    { id: 'armored_suv', name: 'Armored SUV', cost: 800e3, imageUrl: 'https://images.pexels.com/photos/3807276/pexels-photo-3807276.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.04 },
    { id: 'supercar', name: 'Supercar', cost: 1e6, imageUrl: 'https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.05 },
    { id: 'electric_supercar', name: 'Electric Supercar', cost: 2.2e6, imageUrl: 'https://images.pexels.com/photos/9735306/pexels-photo-9735306.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.055 },
    { id: 'vintage_classic', name: 'Vintage Classic', cost: 2.5e6, imageUrl: 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.06 },
    { id: 'limo', name: 'The Beast Limo', cost: 3.5e6, imageUrl: 'https://images.pexels.com/photos/386007/pexels-photo-386007.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.07 },
    { id: 'hypercar', name: 'Hypercar', cost: 5e6, imageUrl: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.08 },
    { id: 'f1_car', name: 'Formula 1 Car', cost: 15e6, imageUrl: 'https://images.pexels.com/photos/1233414/pexels-photo-1233414.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.12 },
    { id: 'flying_car', name: 'Flying Car Prototype', cost: 50e6, imageUrl: 'https://images.pexels.com/photos/8372740/pexels-photo-8372740.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.20 },
];

export const OTHER_ASSETS_DATA: LuxuryAsset[] = [
  { id: 'yacht', name: 'Mega Yacht', cost: 25e6, imageUrl: 'https://images.pexels.com/photos/163236/luxury-yacht-yacht-yachting-yacht-charter-163236.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.10 },
  { id: 'jet', name: 'Private Jet', cost: 100e6, imageUrl: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.15 },
  { id: 'masterpiece', name: 'Art Masterpiece', cost: 1e9, imageUrl: 'https://images.pexels.com/photos/161401/art-gallery-royalty-free-image-161401.jpeg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.20 },
  { id: 'space', name: 'Space Mission', cost: 10e9, imageUrl: 'https://images.pexels.com/photos/5439/earth-space.jpg?auto=compress&cs=tinysrgb&w=600', flexMultiplier: 0.50 },
];

export const LUXURY_ASSETS_DATA: LuxuryAsset[] = [...CARS_DATA, ...OTHER_ASSETS_DATA];

export const PRESTIGE_REQUIREMENT = 10e9; // $10 Billion
export const PRESTIGE_MULTIPLIER_PER_LEVEL = 1; // +100% per level

export const DAILY_REWARD_BASE = 5000;

export const CASINO_MINES_GRID_SIZE = 25;
export const CASINO_CRASH_MIN_BET = 100;
export const CASINO_BLACKJACK_MIN_BET = 500;
export const CASINO_COINFLIP_MIN_BET = 100;