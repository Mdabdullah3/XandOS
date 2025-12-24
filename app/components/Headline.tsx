import React from 'react';

const Headline = ({ title, title2 = "", subtitle }: { title: string, title2?: string, subtitle: string }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start gap-5">
                {/* Tactical Vertical Bar */}
                <div className="w-2 h-16 bg-linear-to-b from-cyan-400 via-white to-fuchsia-600 rounded-full shadow-[0_0_20px_#00f2ff]" />

                <div className="flex flex-col">
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-[-0.07em] text-white uppercase leading-[0.8] text-diamond">
                        {title}
                        {title2 && (
                            <>
                                <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-white to-fuchsia-500">
                                    {title2}
                                </span>
                            </>
                        )}
                    </h1>
                </div>
            </div>
            <p className="text-white/30 font-black text-[10px] tracking-[0.6em] uppercase ml-10 mt-3 italic">
                {subtitle}
            </p>
        </div>
    );
};

export default Headline;