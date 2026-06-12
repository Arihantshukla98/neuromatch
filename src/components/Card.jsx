import React from 'react';

const Card = ({ pokemon, isFlipped, isMatched, onClick }) => {
    return (
        <div
            className={`card group relative w-full h-full cursor-pointer perspective-[1200px] ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
            onClick={onClick}
        >
            <div className="card-inner w-full h-full text-center relative transition-transform duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform-style-3d">
                {/* Front of Card (Realistic Squircle Pokeball) */}
                <div className="card-front absolute w-full h-full rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-slate-700/50 flex flex-col items-center justify-center pointer-events-none z-10 overflow-hidden bg-slate-800">
                    {/* Top Half (Sleek Indigo Gradient) */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500 to-indigo-700"></div>

                    {/* Bottom Half (Slate Gradient) */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-100 to-slate-300"></div>

                    {/* Center Dark Band */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-4 bg-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.6)] z-20"></div>

                    {/* Outer Center Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900 z-20 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center border-2 border-slate-800">
                        {/* Inner White Button with 3D drop */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-400 border border-slate-600 flex items-center justify-center shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4)]">
                            {/* Inner Glass Glow */}
                            <div className="w-4 h-4 rounded-full border border-white/40 bg-[radial-gradient(circle_at_30%_30%,#FFFFFF_0%,transparent_100%)] opacity-90"></div>
                        </div>
                    </div>

                    {/* Overall Glossy Overlay for the Pokeball */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-30 pointer-events-none rounded-2xl mix-blend-overlay"></div>
                </div>

                {/* Back of Card (Pokemon) */}
                <div className="card-back absolute w-full h-full rounded-2xl bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-[15%] border-4 border-slate-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none z-10 mix-blend-overlay"></div>

                    {/* Pokemon Image with 3D Pop */}
                    <div className="relative w-full h-full flex items-center justify-center transform-style-3d translate-z-[20px] transition-transform duration-500 group-hover:translate-z-[40px] group-hover:scale-105">
                        <img
                            src={pokemon.imgUrl}
                            alt="Pokemon"
                            className="max-w-full max-h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] transition-all duration-500 will-change-transform"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
