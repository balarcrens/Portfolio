import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
    const textRef = useRef(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        // Entrance animations for both columns
        const ctx = gsap.context(() => {
            if (textRef.current) {
                gsap.fromTo(textRef.current.children,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.3 }
                );
            }

            if (terminalRef.current) {
                gsap.fromTo(terminalRef.current,
                    { opacity: 0, x: 50, scale: 0.95 },
                    { opacity: 1, x: 0, scale: 1, duration: 1.5, ease: "power3.out", delay: 0.6 }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative w-screen min-h-screen overflow-hidden bg-transparent flex items-center justify-center pt-25 md:pt-10 pb-10 px-6 md:px-12 lg:px-24">
            <div className="max-w-[70rem] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
                <div ref={textRef} className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
                    <div className="space-y-4">
                        <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-[0.2em] uppercase">
                            Hey, I'm Crens Pravinbhai Balar
                        </p>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] text-white font-sans">
                            Turning Ideas
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-white font-serif italic font-light pr-2">
                                Into Digital
                            </span>
                            <br />
                            Products
                        </h1>
                    </div>

                    <p className="max-w-xl text-base sm:text-lg text-gray-400 font-light tracking-wide leading-relaxed">
                        Full-stack developer specializing in MERN and PERN technologies, building fast, scalable, and visually engaging digital experiences. Let's architect the future together.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-full border border-red-500/30 text-white text-xs sm:text-sm tracking-[0.2em] uppercase font-bold hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-500 backdrop-blur-sm shadow-xl inline-block cursor-pointer"
                        >
                            Start a Project
                        </button>
                        <button
                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-full border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-xs sm:text-sm tracking-[0.2em] uppercase font-bold transition-all duration-500 backdrop-blur-sm shadow-xl inline-block cursor-pointer bg-white/5"
                        >
                            Explore Work
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-5 w-full flex justify-center">
                    <div
                        ref={terminalRef}
                        className="w-full max-w-md bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md"
                        style={{ fontFamily: 'monospace' }}
                    >
                        <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5 select-none">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <span className="text-[10px] text-gray-500 font-semibold tracking-wider">
                                crens@balar: ~
                            </span>
                            <div className="w-6 h-3" />
                        </div>

                        <div className="p-6 text-xs text-left space-y-4 font-mono select-none overflow-x-auto no-scrollbar">
                            <div className="space-y-1">
                                <p className="text-gray-500">
                                    crens@balar:~$ <span className="text-white">cat profile.json</span>
                                </p>
                                <div className="pl-4 border-l border-white/5 text-gray-400 space-y-0.5">
                                    <p>{"{"}</p>
                                    <p>  <span className="text-red-400">"name"</span>: <span className="text-orange-300">"Crens Pravinbhai Balar"</span>,</p>
                                    <p>  <span className="text-red-400">"role"</span>: <span className="text-orange-300">"Full-Stack Developer"</span>,</p>
                                    <p>  <span className="text-red-400">"specialization"</span>: <span className="text-orange-300">["MERN", "PERN"]</span>,</p>
                                    <p>  <span className="text-red-400">"frontend"</span>: <span className="text-orange-300">["React", "Next.js"]</span>,</p>
                                    <p>  <span className="text-red-400">"backend"</span>: <span className="text-orange-300">["Node.js", "Express"]</span>,</p>
                                    <p>  <span className="text-red-400">"database"</span>: <span className="text-orange-300">["PostgreSQL", "MongoDB", "MySQL"]</span>,</p>
                                    <p>  <span className="text-red-400">"hosting"</span>: <span className="text-orange-300">["Vercel", "Render", "Hostinger", "Netlify"]</span>,</p>
                                    <p>  <span className="text-red-400">"availability"</span>: <span className="text-emerald-400">"Open to Projects"</span></p>
                                    <p>{"}"}</p>
                                </div>
                            </div>

                            <p className="text-white animate-pulse">
                                crens@balar:~$ <span className="inline-block w-1.5 h-3 bg-red-500 align-middle"></span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
