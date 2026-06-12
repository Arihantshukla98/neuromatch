import React from 'react';

const GameOverScreen = ({ scores, mode, onPlayAgain, onMainMenu }) => {
    const p1Wins = scores[1] > scores[2];
    const p2Wins = scores[2] > scores[1];
    const tie = scores[1] === scores[2];

    let winnerText = "It's a Tie!";
    let winnerColor = "text-amber-400";

    if (p1Wins) {
        winnerText = "Player 1 Wins!";
        winnerColor = "text-indigo-500";
    } else if (p2Wins) {
        winnerText = mode === 1 ? "AI Defeated You!" : "Player 2 Wins!";
        winnerColor = mode === 1 ? "text-purple-500" : "text-blue-500";
    }

    return (
        <section className="flex flex-col items-center gap-8 w-full animate-[fadeIn_0.5s_ease-out_forwards] mt-8">
            <div className="glass-card p-12 rounded-[32px] text-center w-full max-w-[440px] shadow-2xl">
                <div className="text-[4rem] mb-6 animate-[bounce_2s_infinite_ease-in-out]">🏆</div>
                <h2 className={`text-4xl font-black mb-10 drop-shadow-sm tracking-tight ${winnerColor}`}>{winnerText}</h2>

                <div className="bg-slate-800/80 rounded-2xl p-6 mb-10 flex flex-col gap-5 border border-white/5 shadow-inner">
                    <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-slate-400">
                        <span>Player 1</span>
                        <span className="text-3xl font-black text-slate-100">{scores[1]}</span>
                    </div>
                    <div className="h-px w-full bg-slate-700/50"></div>
                    <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-slate-400">
                        <span>{mode === 1 ? 'AI Opponent' : 'Player 2'}</span>
                        <span className="text-3xl font-black text-slate-100">{scores[2]}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button onClick={onPlayAgain} className="primary-btn py-3.5 px-6 text-base">
                        Play Again
                    </button>
                    <button onClick={onMainMenu} className="secondary-btn py-3.5 px-6 text-base">
                        Main Menu
                    </button>
                </div>
            </div>
        </section>
    );
};

export default GameOverScreen;
