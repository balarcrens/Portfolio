import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
    { name: 'Singularity', href: '#singularity' },
];

const SOCIAL_LINKS = [
    {
        name: 'GitHub',
        href: 'https://github.com/crensbalar',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/in/crensbalar',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        name: 'Twitter',
        href: 'https://x.com/crensbalar',
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    {
        name: 'Email',
        href: 'mailto:crensbalar@gmail.com',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    }
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navRef = useRef(null);
    const linksRef = useRef([]);
    const mobileMenuRef = useRef(null);
    const mobileLinksRef = useRef([]);
    const glowRef = useRef(null);

    // Scroll Event Listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initial Load Animation
    useEffect(() => {
        const tl = gsap.timeline();

        // Animate Navbar dropping down
        tl.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
        );

        // Stagger in the links
        if (linksRef.current.length > 0) {
            tl.fromTo(linksRef.current,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
                "-=0.6"
            );
        }
    }, []);

    // Mouse Glow Interaction
    const handleMouseMove = (e) => {
        if (!glowRef.current || !navRef.current) return;
        const rect = navRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(glowRef.current, {
            x,
            y,
            duration: 0.4,
            ease: 'power2.out'
        });
    };

    // Mobile Menu Animation Toggle
    useEffect(() => {
        if (isMobileMenuOpen) {
            gsap.to(mobileMenuRef.current, {
                clipPath: 'circle(150% at 90% 10%)',
                duration: 0.8,
                ease: 'power3.inOut'
            });
            gsap.fromTo(mobileLinksRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
            );
        } else {
            gsap.to(mobileMenuRef.current, {
                clipPath: 'circle(0% at 90% 10%)',
                duration: 0.6,
                ease: 'power3.inOut'
            });
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav
                ref={navRef}
                onMouseMove={handleMouseMove}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 overflow-hidden ${isScrolled
                    ? 'bg-black/40 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-4'
                    : 'bg-transparent py-6'
                    }`}
            >
                {/* Subtle Background Glow Mask */}
                <div
                    ref={glowRef}
                    className="pointer-events-none absolute w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-0 md:opacity-100 transition-opacity duration-300"
                />

                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-10">

                    {/* Logo */}
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        {/* Minimalist modern tech-monogram 'C' SVG Logo */}
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white transition-transform duration-500 group-hover:scale-110">
                            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                            <path d="M68 35C62 25 48 22 38 28C26 35 22 52 30 65C38 78 55 81 65 72" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                            <path d="M48 50H72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-60 group-hover:translate-x-1 transition-transform" />
                        </svg>
                        <span className="text-white font-bold tracking-widest uppercase text-sm ml-2 opacity-90 group-hover:opacity-100 transition-opacity">
                            Crens
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-10">
                        {NAV_LINKS.map((link, index) => (
                            <a
                                key={link.name}
                                href={link.href}
                                ref={el => linksRef.current[index] = el}
                                className="relative text-gray-400 hover:text-white text-sm font-medium tracking-wide transition-colors duration-300 group"
                            >
                                {link.name}
                                {/* Center-out underline animation */}
                                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                            </a>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <button
                            ref={el => linksRef.current[NAV_LINKS.length] = el} // animate with the links
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="relative px-6 py-2.5 rounded-full overflow-hidden group bg-transparent border border-white/20 text-white text-sm font-medium tracking-wider hover:border-white/60 transition-colors duration-300"
                        >
                            <span className="relative z-10 group-hover:text-black transition-colors duration-300">Let's Talk</span>
                            {/* Button Inner Fill Effect */}
                            <div className="absolute inset-0 h-full w-full bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                        </button>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="md:hidden text-white p-2 z-50 relative"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`w-full h-[1px] bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[10px]' : ''}`} />
                            <span className={`w-full h-[1px] bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-[1px] bg-white transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[10px]' : ''}`} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Fullscreen Menu */}
            <div
                ref={mobileMenuRef}
                className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col justify-center items-center"
                style={{ clipPath: 'circle(0% at 90% 10%)' }}
            >
                <div className="flex flex-col space-y-6 text-center mt-10 w-full max-w-sm px-6">
                    {NAV_LINKS.map((link, index) => (
                        <a
                            key={link.name}
                            href={link.href}
                            ref={el => mobileLinksRef.current[index] = el}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl font-light text-gray-400 hover:text-white transition-colors tracking-widest relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
                        </a>
                    ))}

                    <button
                        ref={el => mobileLinksRef.current[NAV_LINKS.length] = el}
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            setTimeout(() => {
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            }, 600); // Wait for menu close slide out
                        }}
                        className="mt-6 px-8 py-3 rounded-full border border-white/20 text-white tracking-widest hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                        Hire Me
                    </button>

                    {/* Mobile Socials Tray */}
                    <div
                        ref={el => mobileLinksRef.current[NAV_LINKS.length + 1] = el}
                        className="flex items-center justify-center space-x-6 pt-6 mt-6 border-t border-white/10 w-full"
                    >
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500/50 flex items-center justify-center transition-all duration-300 active:scale-95"
                                style={{
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                                }}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
