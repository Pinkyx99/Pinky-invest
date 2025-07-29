
const SI_SYMBOLS = ["", "k", "M", "B", "T", "q", "Q", "s", "S"];

export const formatNumber = (num: number): string => {
    if (num < 1000) return num.toFixed(2);
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
    if (tier >= SI_SYMBOLS.length) return num.toExponential(2);
    const suffix = SI_SYMBOLS[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
    return scaled.toFixed(3) + suffix;
};

export const formatCurrency = (num: number): string => {
    if (num < 10000) {
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    return `$${formatNumber(num)}`;
};

export const formatCryptoAmount = (num: number): string => {
    if (num === 0) return '0.00';
    if (num < 0.0001) return num.toExponential(2);
    return num.toFixed(Math.min(8, Math.max(2, -Math.floor(Math.log10(num)) + 4)));
};
