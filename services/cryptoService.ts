
import { CRYPTO_DATA } from '../constants';

const API_BASE_URL = 'https://api.coingecko.com/api/v3/simple/price';

export const fetchCryptoPrices = async (): Promise<Record<string, number>> => {
  const realWorldCoinIds = CRYPTO_DATA
    .filter(c => c.id !== 'tycooncoin')
    .map(c => c.id)
    .join(',');

  try {
    const response = await fetch(`${API_BASE_URL}?ids=${realWorldCoinIds}&vs_currencies=usd`);
    if (!response.ok) {
      console.error("Failed to fetch crypto prices from CoinGecko");
      return {};
    }
    const data = await response.json();
    
    const prices: Record<string, number> = {};
    for (const id in data) {
        prices[id] = data[id].usd;
    }
    return prices;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return {};
  }
};
