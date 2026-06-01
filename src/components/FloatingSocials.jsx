import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SOCIALS = [
    {
        name: 'GitHub',
        label: 'GITHUB',
        href: 'https://github.com/balarcrens',
        color: '#fff',
        glowColor: 'rgba(239, 68, 68, 0.6)',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        name: 'LinkedIn',
        label: 'LINKEDIN',
        href: 'https://linkedin.com/in/crens-b-2b5076375',
        color: '#0077b5',
        glowColor: 'rgba(239, 68, 68, 0.6)',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        name: 'Twitter',
        label: 'TWITTER',
        href: 'https://x.com/BalarCrens07',
        color: '#fff',
        glowColor: 'rgba(239, 68, 68, 0.6)',
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    {
        name: 'Email',
        label: 'EMAIL',
        href: 'https://mail.google.com/mail/?view=cm&fs=1&to=balarcrens@gmail.com',
        color: '#ea4335',
        glowColor: 'rgba(239, 68, 68, 0.6)',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    }
];

export default function FloatingSocials() {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);
    const floatContainersRef = useRef([]);
    const lineRef = useRef(null);

    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Initialize independent gentle floating/swaying animations for each icon
    useEffect(() => {
        const floatTimelines = [];

        floatContainersRef.current.forEach((el, index) => {
            if (!el) return;

            // Assign unique, asynchronous floating metrics for organic zero-gravity movement
            const delay = index * 0.4;
            const duration = 4 + index * 0.8;

            const tl = gsap.timeline({ repeat: -1, yoyo: true });
            tl.to(el, {
                y: '+=12',
                x: '+=6',
                rotate: index % 2 === 0 ? '+=4' : '-=4',
                duration: duration,
                ease: 'sine.inOut',
                delay: delay
            });

            floatTimelines.push(tl);
        });

        // Fade-in dock on initial page mount
        gsap.fromTo(containerRef.current,
            { x: -80, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.5, ease: 'power4.out', delay: 1.2 }
        );

        return () => {
            floatTimelines.forEach(tl => tl.kill());
        };
    }, []);

    // Magnetic cursor tracking effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const threshold = 120; // Radius of magnetic attraction in pixels

            itemsRef.current.forEach((itemEl) => {
                if (!itemEl) return;

                const rect = itemEl.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < threshold) {
                    // Calculate intensity of magnetic attraction (stronger as mouse gets closer)
                    const intensity = (threshold - distance) / threshold;
                    // Apply magnetic offset vector
                    const pullX = dx * intensity * 0.45;
                    const pullY = dy * intensity * 0.45;

                    gsap.to(itemEl, {
                        x: pullX,
                        y: pullY,
                        scale: 1.15,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    // Snap back gently if mouse leaves the local magnet radius
                    gsap.to(itemEl, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power3.out'
                    });
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);

        // Glow effect transition on the connected wire
        if (lineRef.current) {
            gsap.to(lineRef.current, {
                background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0) 0%, rgb(239, 68, 68) 50%, rgba(239, 68, 68, 0) 100%)',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.7)',
                width: '2px',
                duration: 0.3
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);

        // Revert the connected wire back to standard subtle state
        if (lineRef.current) {
            gsap.to(lineRef.current, {
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0) 100%)',
                boxShadow: 'none',
                width: '1px',
                duration: 0.5
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col items-center py-8 z-40"
            style={{ pointerEvents: 'none' }}
        >
            {/* Sci-Fi glowing vertical spiderweb wire/cable */}
            <div
                ref={lineRef}
                className="w-[1px] absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0) 100%)',
                    transition: 'width 0.3s, background 0.3s, box-shadow 0.3s'
                }}
            />

            {/* Floating social links wrapper */}
            <div className="flex flex-col space-y-10 relative z-10">
                {SOCIALS.map((social, index) => (
                    <div
                        key={social.name}
                        ref={el => floatContainersRef.current[index] = el}
                        className="relative flex items-center"
                    >
                        {/* The actual interactive magnetic target */}
                        <a
                            ref={el => itemsRef.current[index] = el}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            aria-label={social.name}
                            className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full bg-black/60 border border-white/10 text-gray-400 backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-red-500 hover:text-white"
                            style={{
                                boxShadow: hoveredIndex === index
                                    ? `0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.2)`
                                    : '0 4px 20px rgba(0,0,0,0.5)',
                                borderColor: hoveredIndex === index ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {social.icon}
                        </a>

                        {/* Glowing slide-out HUD labels */}
                        <div
                            className="absolute left-16 pl-2 pointer-events-none flex items-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                            style={{
                                opacity: hoveredIndex === index ? 1 : 0,
                                transform: hoveredIndex === index ? 'translateX(0)' : 'translateX(-15px)',
                            }}
                        >
                            <div
                                className="bg-black/80 border border-red-500/30 text-red-500 text-[10px] font-bold tracking-[0.2em] font-mono px-3 py-1.5 rounded-md backdrop-blur-md"
                                style={{
                                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.25)',
                                    textShadow: '0 0 5px rgba(239, 68, 68, 0.5)'
                                }}
                            >
                                {social.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
