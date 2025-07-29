import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { BlackjackHand } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Icon } from '../../components/Icon';

type BlackjackGameProps = ReturnType<typeof useGameState> & { onBack: () => void };
type GameStatus = 'betting' | 'playing' | 'dealer' | 'ended';

const SUITS = ['spade', 'heart', 'diamond', 'club'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11 };

const PlayingCard: React.FC<{ card?: { suit: string; rank: string }, isHidden?: boolean, layoutId: string }> = ({ card, isHidden, layoutId }) => {
    const suitColor = (card?.suit === 'heart' || card?.suit === 'diamond') ? 'text-red-500' : 'text-gray-800';
    return (
        <motion.div
            layoutId={layoutId}
            className={`w-20 h-28 p-2 flex flex-col justify-between rounded-lg shadow-md transform-gpu ${isHidden ? 'bg-gray-800 border-2 border-gray-600' : 'bg-gray-200 text-gray-800'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
            {!isHidden && card && (
                <>
                    <div className={suitColor}>
                        <p className="font-bold text-lg">{card.rank}</p>
                        <Icon name={card.suit as any} className="w-5 h-5 fill-current"/>
                    </div>
                    <div className={`self-end rotate-180 ${suitColor}`}>
                        <p className="font-bold text-lg">{card.rank}</p>
                        <Icon name={card.suit as any} className="w-5 h-5 fill-current"/>
                    </div>
                </>
            )}
        </motion.div>
    );
};

const BlackjackGame: React.FC<BlackjackGameProps> = ({ cash, addCash, removeCash, addActivity, onBack }) => {
    const [bet, setBet] = useState(500);
    const [status, setStatus] = useState<GameStatus>('betting');
    const [deck, setDeck] = useState<{ suit: string; rank: string }[]>([]);
    const [playerHand, setPlayerHand] = useState<BlackjackHand>({ cards: [], value: 0 });
    const [dealerHand, setDealerHand] = useState<BlackjackHand>({ cards: [], value: 0 });
    const [message, setMessage] = useState('');

    const calculateHandValue = (cards: {rank: string}[]) => {
        let value = cards.reduce((sum, card) => sum + RANK_VALUES[card.rank], 0);
        let aces = cards.filter(c => c.rank === 'A').length;
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    };
    
    const startGame = () => {
        if (cash < bet) return;
        removeCash(bet);
        addActivity(`Bet ${formatCurrency(bet)} on Blackjack.`, 'neutral');

        const newDeck = SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank }))).sort(() => Math.random() - 0.5);
        
        const initialPlayer = [newDeck.pop()!, newDeck.pop()!];
        const initialDealer = [newDeck.pop()!, newDeck.pop()!];
        const playerValue = calculateHandValue(initialPlayer);
        
        setDeck(newDeck);
        setPlayerHand({ cards: initialPlayer, value: playerValue });
        setDealerHand({ cards: initialDealer, value: calculateHandValue(initialDealer) });
        setStatus('playing');
        setMessage('');

        if (playerValue === 21) setTimeout(() => stand(), 500);
    };
    
    const hit = () => {
        if(status !== 'playing' || !deck.length) return;
        const newCard = deck.pop()!;
        const newHand = [...playerHand.cards, newCard];
        const newValue = calculateHandValue(newHand);
        setPlayerHand({ cards: newHand, value: newValue });
        setDeck([...deck]);
        if(newValue > 21) {
            setMessage('Bust!');
            setStatus('ended');
            addActivity(`Bust! Lost ${formatCurrency(bet)}.`, 'loss');
        }
    };

    const stand = () => {
        if(status !== 'playing') return;
        setStatus('dealer');
    };
    
    useEffect(() => {
        if (status === 'dealer') {
            const dealerTurnTimeout = setTimeout(() => {
                let hand = [...dealerHand.cards];
                let value = calculateHandValue(hand);
                const currentDeck = [...deck];

                while (value < 17) {
                    const newCard = currentDeck.pop();
                    if (!newCard) break; 
                    hand.push(newCard);
                    value = calculateHandValue(hand);
                }
                
                setDeck(currentDeck);
                setDealerHand({ cards: hand, value });
                setStatus('ended');

                const playerValue = playerHand.value;
                if (value > 21 || (playerValue <= 21 && playerValue > value)) {
                    const isBlackjack = playerValue === 21 && playerHand.cards.length === 2;
                    const winnings = isBlackjack ? bet * 2.5 : bet * 2;
                    setMessage(isBlackjack ? 'Blackjack!' : 'You Win!');
                    addCash(winnings);
                    addActivity(`Won ${formatCurrency(winnings)} in Blackjack!`, 'gain');
                } else if (value > playerValue) {
                    setMessage('Dealer Wins');
                    addActivity(`Lost ${formatCurrency(bet)} in Blackjack.`, 'loss');
                } else {
                    setMessage('Push');
                    addCash(bet);
                    addActivity(`Pushed in Blackjack. Bet returned.`, 'neutral');
                }
            }, 1000);

            return () => clearTimeout(dealerTurnTimeout);
        }
    }, [status]);
    
    const handDisplay = (hand: BlackjackHand, isDealer: boolean) => (
        <div className="relative h-32 w-full flex justify-center items-center">
            <AnimatePresence>
            {hand.cards.map((card, i) => (
                <motion.div 
                    key={`${card.rank}-${card.suit}-${i}`}
                    className="absolute"
                    initial={{ y: -250, x: 0, opacity: 0, rotate: 0 }}
                    animate={{
                        y: 0,
                        x: (i - (hand.cards.length - 1) / 2) * 35,
                        rotate: (i - (hand.cards.length - 1) / 2) * 8,
                        opacity: 1,
                    }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{type: 'spring', stiffness: 400, damping: 30, delay: i * 0.15}}
                    >
                    <PlayingCard layoutId={`${isDealer ? 'd' : 'p'}-${i}`} card={card} isHidden={isDealer && i === 1 && status === 'playing'} />
                </motion.div>
            ))}
            </AnimatePresence>
        </div>
   );
    
    const handValue = (hand: BlackjackHand, isDealer: boolean) => {
        if(status === 'playing' && isDealer) return `?`;
        return hand.value;
    }

    return (
        <motion.div
            key="blackjack" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 space-y-2 h-full flex flex-col bg-gray-900/50"
        >
            <div className="flex items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 font-semibold"><Icon name="back" className="w-5 h-5"/> Casino</button>
                <h2 className="text-2xl font-bold text-center flex-1">Blackjack</h2>
            </div>

            <div className="flex-1 flex flex-col justify-around text-center relative">
                <div>
                    <p className="font-semibold text-white/80">Dealer's Hand ({handValue(dealerHand, true)})</p>
                    {handDisplay(dealerHand, true)}
                </div>

                 <AnimatePresence>
                    {status === 'ended' && 
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <div className="bg-black/70 backdrop-blur-sm px-8 py-4 rounded-xl shadow-lg">
                            <p className="text-4xl font-bold text-gray-300">{message}</p>
                        </div>
                    </motion.div>}
                 </AnimatePresence>

                <div>
                    <p className="font-semibold text-white/80">Your Hand ({handValue(playerHand, false)})</p>
                    {handDisplay(playerHand, false)}
                </div>
            </div>

            {status === 'betting' ? (
                 <div className="space-y-4">
                     <div className="bg-black/30 p-4 rounded-lg">
                         <label className="text-sm text-white/70">Bet Amount</label>
                         <input type="number" value={bet} onChange={e => setBet(Math.max(1, Number(e.target.value)))} className="w-full bg-[#1C1C1E] border border-white/10 p-2 rounded-lg" />
                     </div>
                     <motion.button onClick={startGame} disabled={cash < bet} className="w-full bg-[#1C1C1E] border border-white/10 hover:bg-[#2a2a2d] text-white font-bold py-3 rounded-xl disabled:bg-gray-800 disabled:text-white/40" whileTap={{ scale: 0.95 }}>Deal</motion.button>
                 </div>
             ) : status === 'playing' ? (
                <div className="grid grid-cols-2 gap-4">
                     <motion.button onClick={hit} className="w-full bg-green-600/20 text-green-300 border border-green-500/30 font-bold py-3 rounded-xl" whileHover={{ filter: 'brightness(1.2)' }} whileTap={{ scale: 0.95 }}>Hit</motion.button>
                     <motion.button onClick={stand} className="w-full bg-red-600/20 text-red-300 border border-red-500/30 font-bold py-3 rounded-xl" whileHover={{ filter: 'brightness(1.2)' }} whileTap={{ scale: 0.95 }}>Stand</motion.button>
                </div>
            ) : (
                <motion.button onClick={() => setStatus('betting')} className="w-full bg-[#1C1C1E] border border-white/10 hover:bg-[#2a2a2d] text-white font-bold py-3 rounded-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>New Hand</motion.button>
            )}
        </motion.div>
    );
};

export default BlackjackGame;