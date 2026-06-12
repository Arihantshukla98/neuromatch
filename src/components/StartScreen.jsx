import React from 'react';

const StartScreen = ({ onStart, defaultDifficulty, defaultMode }) => {
    const [difficulty, setDifficulty] = React.useState(defaultDifficulty);
    const [mode, setMode] = React.useState(defaultMode);

    return (
        <section className="flex flex-col items-center gap-8 w-full max-w-[480px] animate-[fadeIn_0.5s_ease-out_forwards] mt-4">
            <div className="glass-card w-full p-10 md:p-12 rounded-[28px] shadow-2xl">
                <div className="flex flex-col items-center mb-10 gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Game Setup</h2>
                </div>

                <div className="flex flex-col gap-8 mb-12">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                            Difficulty
                        </label>
                        <div className="flex p-1.5 bg-slate-800/80 rounded-2xl border border-white/5 shadow-inner">
                            {[
                                { val: 16, label: 'Easy' },
                                { val: 36, label: 'Medium' },
                                { val: 64, label: 'Hard' }
                            ].map(opt => (
                                <button
                                    key={opt.val}
                                    onClick={() => setDifficulty(opt.val)}
                                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${difficulty === opt.val
                                            ? 'bg-slate-700 text-white shadow-md ring-1 ring-white/10'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                            Opponent
                        </label>
                        <div className="flex p-1.5 bg-slate-800/80 rounded-2xl border border-white/5 shadow-inner">
                            {[
                                { val: 1, label: 'Play vs AI' },
                                { val: 2, label: '2 Players' }
                            ].map(opt => (
                                <button
                                    key={opt.val}
                                    onClick={() => setMode(opt.val)}
                                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${mode === opt.val
                                            ? 'bg-slate-700 text-white shadow-md ring-1 ring-white/10'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onStart(difficulty, mode)}
                    className="primary-btn py-3.5 px-8 text-base mx-auto"
                >
                    <span>Start Adventure</span>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 transition-transform group-hover:translate-x-1"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
            </div>
        </section>
    );
};

export default StartScreen;
