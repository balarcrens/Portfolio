import React, { useEffect, useState } from 'react';

export default function ProgressBar() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const pos = window.scrollY;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollValue = height > 0 ? Math.round((pos * 100) / height) : 0;

            setProgress(scrollValue);
            setIsVisible(pos > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 ease-in-out select-none active:scale-90 ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Scroll to top"
        >
            {/* Ambient Background Glow Mask (Silver/White highlight matching the custom cursor/glow style) */}
            <div className="absolute -inset-1.5 bg-white/5 rounded-full opacity-0 hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />

            {/* Circular Progress Border */}
            <div
                className="absolute inset-0 rounded-full p-[2.5px] transition-transform duration-500 hover:scale-105"
                style={{
                    background: `conic-gradient(rgba(255, 255, 255, 0.95) ${progress}%, rgba(255, 255, 255, 0.12) ${progress}%)`
                }}
            >
                {/* Inner Glassmorphic Circle */}
                <div className="w-full h-full rounded-full bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    {/* Centered Chevron Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-white/80 group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <polyline points="18 15 12 9 6 15" />
                    </svg>

                    {/* Radial Hover Sparkle Highlight */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
            </div>
        </button>
    );
}
