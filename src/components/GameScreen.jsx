import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

const GameScreen = ({ difficulty, mode, onEndGame, onQuit }) => {
    const [deck, setDeck] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [scores, setScores] = useState({ 1: 0, 2: 0 });
    const [isLocked, setIsLocked] = useState(true);
    const [loading, setLoading] = useState(true);

    const totalPairs = difficulty / 2;
    const aiMemoryRef = useRef(new Map());
    const turnFlippedRef = useRef([]);

    // Initialization
    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            const pokemonIds = new Set();
            while (pokemonIds.size < totalPairs) {
                pokemonIds.add(Math.floor(Math.random() * 800) + 1);
            }

            const pairsArray = Array.from(pokemonIds);
            let newDeck = [];

            for (let i = 0; i < totalPairs; i++) {
                const pokeId = pairsArray[i];
                const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;
                const cardData = { pokemonId: pokeId, imgUrl, isMatched: false };
                newDeck.push({ ...cardData, id: `${pokeId}-1` });
                newDeck.push({ ...cardData, id: `${pokeId}-2` });
            }

            newDeck.sort(() => Math.random() - 0.5);
            setDeck(newDeck);
            setLoading(false);
            setIsLocked(false);
        };

        fetchCards();
    }, [totalPairs]);

    // AI Turn Logic
    useEffect(() => {
        if (mode === 1 && currentPlayer === 2 && matchedPairs < totalPairs && !loading) {
            setIsLocked(true);

            const timer = setTimeout(() => {
                playAITurn();
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [currentPlayer, matchedPairs, loading]);

    const playAITurn = () => {
        const availableIndices = deck.map((c, i) => !c.isMatched ? i : -1).filter(i => i !== -1);
        if (availableIndices.length === 0) return;

        let firstPick = -1;
        let secondPick = -1;

        // Strategy 1: Find a known pair in memory
        const memoryParams = findPairInMemory();
        if (memoryParams) {
            firstPick = memoryParams[0];
            secondPick = memoryParams[1];
        } else {
            // Strategy 2: Random first pick
            const unknownCards = availableIndices.filter(idx => !aiMemoryRef.current.has(idx));
            firstPick = unknownCards.length > 0
                ? unknownCards[Math.floor(Math.random() * unknownCards.length)]
                : availableIndices[Math.floor(Math.random() * availableIndices.length)];
        }

        // Attempt First Flip
        handleCardFlip(firstPick, true);

        // Delay before second flip
        setTimeout(() => {
            let actualSecondPick = secondPick;
            if (actualSecondPick === -1) {
                const targetId = deck[firstPick].pokemonId;
                let foundMatch = -1;
                for (let [idx, pokeId] of aiMemoryRef.current.entries()) {
                    if (pokeId === targetId && idx !== firstPick && !deck[idx].isMatched) {
                        foundMatch = idx;
                        break;
                    }
                }
                if (foundMatch !== -1) {
                    actualSecondPick = foundMatch;
                } else {
                    const rems = availableIndices.filter(idx => idx !== firstPick && !aiMemoryRef.current.has(idx));
                    if (rems.length > 0) {
                        actualSecondPick = rems[Math.floor(Math.random() * rems.length)];
                    } else {
                        const fallbacks = availableIndices.filter(idx => idx !== firstPick);
                        actualSecondPick = fallbacks[Math.floor(Math.random() * fallbacks.length)];
                    }
                }
            }

            handleCardFlip(actualSecondPick, true);
        }, 800);
    };

    const findPairInMemory = () => {
        const idMap = new Map();
        for (let [idx, pokeId] of aiMemoryRef.current.entries()) {
            if (deck[idx]?.isMatched) continue;

            if (!idMap.has(pokeId)) {
                idMap.set(pokeId, [idx]);
            } else {
                idMap.get(pokeId).push(idx);
                if (idMap.get(pokeId).length === 2) return idMap.get(pokeId);
            }
        }
        return null;
    };

    const handleCardFlip = (index, isAi = false, latestDeck = deck) => {
        if ((isLocked && !isAi) || latestDeck[index].isMatched || turnFlippedRef.current.includes(index)) return;

        // Update memory
        aiMemoryRef.current.set(index, latestDeck[index].pokemonId);

        turnFlippedRef.current.push(index);
        setFlippedIndices([...turnFlippedRef.current]);

        if (turnFlippedRef.current.length === 2) {
            const [idx1, idx2] = turnFlippedRef.current;
            checkMatch(idx1, idx2, latestDeck);
        }
    };

    const checkMatch = (idx1, idx2, latestDeck) => {
        setIsLocked(true);
        const card1 = latestDeck[idx1];
        const card2 = latestDeck[idx2];

        if (card1.pokemonId === card2.pokemonId) {
            setTimeout(() => {
                setDeck(prevDeck => {
                    const newDeck = [...prevDeck];
                    newDeck[idx1] = { ...newDeck[idx1], isMatched: true };
                    newDeck[idx2] = { ...newDeck[idx2], isMatched: true };
                    return newDeck;
                });

                setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));

                setMatchedPairs(prev => prev + 1);

                if (matchedPairs + 1 === totalPairs) {
                    setScores(latestScores => {
                        setTimeout(() => onEndGame(latestScores), 500);
                        return latestScores;
                    });
                }

                aiMemoryRef.current.delete(idx1);
                aiMemoryRef.current.delete(idx2);

                turnFlippedRef.current = [];
                setFlippedIndices([]);
                if (!(mode === 1 && currentPlayer === 2)) {
                    setIsLocked(false);
                }
            }, 600);
        } else {
            setTimeout(() => {
                turnFlippedRef.current = [];
                setFlippedIndices([]);
                setCurrentPlayer(prev => prev === 1 ? 2 : 1);
                setIsLocked(false);
            }, 1000);
        }
    };

    const cols = Math.sqrt(difficulty);
    const rows = Math.sqrt(difficulty);
    const aiTurnActive = mode === 1 && currentPlayer === 2;

    return (
        <section className="flex flex-col w-full animate-[fadeIn_0.4s_ease-out_forwards]">
            {/* Top Bar */}
            <div className="glass-card flex justify-between items-center p-4 mb-8 rounded-2xl w-full max-w-[800px] mx-auto shadow-lg">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${currentPlayer === 1 ? 'bg-slate-800/80 border border-slate-600 shadow-[0_4px_12px_rgba(99,102,241,0.15)] opacity-100 scale-105 ring-1 ring-indigo-500/50' : 'opacity-50 grayscale-[50%]'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center font-bold text-white shadow-inner">P1</div>
                    <div className="flex flex-col">
                        <span className="text-[0.75rem] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Player 1</span>
                        <span className="text-xl font-black text-slate-100 leading-none">{scores[1]}</span>
                    </div>
                </div>

                <div className="text-center flex flex-col items-center px-4">
                    <div className={`text-lg font-bold pb-1 bg-clip-text text-transparent ${currentPlayer === 1 ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' : (mode === 1 ? 'bg-gradient-to-r from-purple-400 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-blue-600')}`}>
                        {currentPlayer === 1 ? "Player 1's Turn" : (mode === 1 ? "AI is playing..." : "Player 2's Turn")}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Pairs left: {totalPairs - matchedPairs}</div>
                </div>

                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${currentPlayer === 2 ? `bg-slate-800/80 border border-slate-600 opacity-100 scale-105 ring-1 ${mode === 1 ? 'ring-purple-500/50 shadow-[0_4px_12px_rgba(168,85,247,0.15)]' : 'ring-blue-500/50 shadow-[0_4px_12px_rgba(59,130,246,0.15)]'}` : 'opacity-50 grayscale-[50%]'}`}>
                    <div className="flex flex-col items-end">
                        <span className="text-[0.75rem] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">{mode === 1 ? 'AI Opponent' : 'Player 2'}</span>
                        <span className="text-xl font-black text-slate-100 leading-none">{scores[2]}</span>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${mode === 1 ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                        {mode === 1 ? 'AI' : 'P2'}
                    </div>
                </div>
            </div>

            {/* Board Container */}
            <div className="relative w-full flex justify-center items-center min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 glass-card rounded-[24px]">
                        <div className="w-[50px] h-[50px] border-4 border-white/20 border-t-accent rounded-full animate-[spin_1s_linear_infinite]"></div>
                        <p className="text-lg font-semibold text-white drop-shadow-md">Catching Pokémon...</p>
                    </div>
                )}

                <div
                    className="grid gap-[12px] w-full max-w-[800px] mx-auto aspect-square md:gap-4 transition-all duration-500"
                    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                >
                    {deck.map((card, index) => (
                        <Card
                            key={card.id + index}
                            pokemon={card}
                            isFlipped={flippedIndices.includes(index) || card.isMatched}
                            isMatched={card.isMatched}
                            onClick={() => handleCardFlip(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Bot Actions */}
            <div className="mt-8 w-full flex justify-center">
                <button onClick={onQuit} className="secondary-btn py-3 px-6">
                    Quit Game
                </button>
            </div>

            {/* AI Toast Notification */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-slate-600 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-3 z-[100] transition-all duration-500 ease-out ${aiTurnActive ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-[ping_1.4s_infinite_ease-in-out] delay-[-0.32s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-[ping_1.4s_infinite_ease-in-out] delay-[-0.16s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-[ping_1.4s_infinite_ease-in-out]"></div>
                </div>
                <span className="font-medium text-slate-200 text-sm tracking-wide">AI is calculating moves...</span>
            </div>

        </section>
    );
};

export default GameScreen;
