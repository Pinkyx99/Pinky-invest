
export enum View {
  Cash,
  Properties,
  Crypto,
  Assets,
  Casino,
  Profile,
}

export interface ClickUpgrade {
  level: number;
  cost: number;
  clickValue: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  baseCost: number;
  baseIncome: number;
  imageUrl: string;
}

export interface OwnedProperty {
  level: number;
  value: number;
  income: number;
}

export interface Crypto {
  id: string;
  name: string;
  ticker: string;
  logoUrl: string;
  isVolatile: boolean;
}

export interface CryptoHolding {
  id: string;
  amount: number;
  price: number;
  value: number;
  priceHistory: number[];
}

export enum CryptoTrend {
    BULL = 'bull',
    BEAR = 'bear',
    STABLE = 'stable',
}

export interface LuxuryAsset {
  id: string;
  name: string;
  cost: number;
  imageUrl: string;
  flexMultiplier: number; // e.g., 0.05 for 5%
}

export interface OwnedAsset {
  id: string;
  value: number;
  flexMultiplier: number;
}

export interface Activity {
  id: string;
  text: string;
  type: 'gain' | 'loss' | 'neutral' | 'prestige';
}

export interface GameState {
  cash: number;
  clickLevel: number;
  tycoonLevel: number;
  properties: Record<string, OwnedProperty>;
  cryptoHoldings: Record<string, CryptoHolding>;
  assets: Record<string, OwnedAsset>;
  activityFeed: Activity[];
}

export interface MinesGameState {
    grid: ('gem' | 'mine' | null)[];
    revealed: boolean[];
    mines: number;
    bet: number;
    multiplier: number;
    gameOver: boolean;
    isWin: boolean | null;
}

export interface BlackjackHand {
    cards: { suit: string; rank: string }[];
    value: number;
}
