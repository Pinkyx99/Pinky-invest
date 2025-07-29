
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI Advisor will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAITradingAdvice = async (cash: number, netWorth: number): Promise<string> => {
    if (!API_KEY) {
        return "The AI Advisor is offline. The crystal ball is cloudy because someone forgot to pay the API bill.";
    }

    const prompt = `
        You are a cynical, witty, and slightly unhinged financial advisor in a high-stakes financial simulation game.
        The player has $${cash.toFixed(2)} in cash and a total net worth of $${netWorth.toFixed(2)}.
        Give them one short, memorable, and darkly humorous piece of trading advice. Be creative and a little dramatic.
        Do not give actual financial advice. Keep it under 280 characters.
        Example: "With that much cash, you could almost afford a sandwich. Maybe sell some of that pixelated gold before it turns to dust."
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.9,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching advice from Gemini API:", error);
        return "The AI is currently on a coffee break, contemplating the futility of digital currency. Try again later.";
    }
};
