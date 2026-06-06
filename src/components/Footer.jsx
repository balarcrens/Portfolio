import React from 'react';
import { FaGithub, FaLinkedinIn, FaTwitter, FaEnvelope, FaArrowUp } from 'react-icons/fa';

const NAV_LINKS = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
];

const SOCIAL_LINKS = [
    {
        name: 'GitHub',
        href: 'https://github.com/crensbalar',
        icon: <FaGithub className="w-5 h-5" />,
        color: '#24292e',
        glow: 'rgba(255,255,255,0.15)'
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/in/crensbalar',
        icon: <FaLinkedinIn className="w-5 h-5" />,
        color: '#0077b5',
        glow: 'rgba(0,119,181,0.3)'
    },
    {
        name: 'Twitter',
        href: 'https://x.com/crensbalar',
        icon: <FaTwitter className="w-5 h-5" />,
        color: '#1da1f2',
        glow: 'rgba(29,161,242,0.3)'
    },
    {
        name: 'Email',
        href: 'mailto:crensbalar@gmail.com',
        icon: <FaEnvelope className="w-5 h-5" />,
        color: '#ea4335',
        glow: 'rgba(234,67,53,0.3)'
    }
];

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-md relative overflow-hidden py-16 px-6 md:px-12 lg:px-24">
            {/* Ambient Background Glows */}
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/5">

                    {/* Logo & Description */}
                    <div className="md:col-span-5 flex flex-col items-start space-y-4">
                        <div
                            onClick={scrollToTop}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-white transition-transform duration-500 group-hover:scale-110">
                                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="opacity-40" />
                                <path d="M68 35C62 25 48 22 38 28C26 35 22 52 30 65C38 78 55 81 65 72" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                <path d="M48 50H72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-60 group-hover:translate-x-1 transition-transform" />
                            </svg>
                            <span className="text-white font-bold tracking-widest uppercase text-base ml-2 opacity-95 group-hover:opacity-100 transition-opacity">
                                Crens
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm md:text-base max-w-sm font-light leading-relaxed">
                            Crafting visually stunning, high-performance, and responsive digital solutions with modern frontend & backend architectures.
                        </p>
                    </div>

                    {/* Navigation Section */}
                    <div className="md:col-span-3 flex flex-col space-y-4">
                        <h4 className="text-white text-xs font-semibold tracking-widest uppercase">Navigation</h4>
                        <div className="flex flex-col space-y-2.5">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 font-light hover:translate-x-1 inline-block transform"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Socials & Contact CTA */}
                    <div className="md:col-span-4 flex flex-col space-y-5">
                        <h4 className="text-white text-xs font-semibold tracking-widest uppercase">Connect</h4>
                        <p className="text-gray-400 text-sm font-light leading-relaxed">
                            Let's build something extraordinary together. Drop me a line or follow my engineering updates.
                        </p>
                        {/* Social Buttons List */}
                        <div className="flex items-center space-x-4">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all duration-300 transform hover:-translate-y-1 footer-social-btn"
                                    style={{
                                        '--hover-bg': social.color,
                                        '--hover-glow': social.glow
                                    }}
                                    title={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-gray-300 text-sm font-light text-center sm:text-left">
                        &copy; {new Date().getFullYear()} Crens Balar. All rights reserved.
                    </p>

                    {/* Back to Top */}
                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 text-xs font-medium cursor-pointer"
                    >
                        <span>Back to top</span>
                        <FaArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Custom Interactive Styles for Footer Socials */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .footer-social-btn:hover {
                    background-color: var(--hover-bg) !important;
                    border-color: var(--hover-bg) !important;
                    box-shadow: 0 4px 15px var(--hover-glow) !important;
                }
            `}} />
        </footer>
    );
}
