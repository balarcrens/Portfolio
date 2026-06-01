import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
    {
        name: 'GitHub',
        href: 'https://github.com/balarcrens',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/in/crens-b-2b5076375',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        name: 'Twitter',
        href: 'https://x.com/BalarCrens07',
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    {
        name: 'Email',
        href: 'https://mail.google.com/mail/?view=cm&fs=1&to=balarcrens@gmail.com',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    }
];

export default function Contact() {
    const sectionRef = useRef(null);
    const formRef = useRef(null);

    // Form inputs and status state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'sending', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });

            // Select all animatable elements
            const elements = sectionRef.current.querySelectorAll('.animate-element');

            // Stagger them fading directly upward
            tl.fromTo(elements,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');
 
        try {
            const res = await api.post('/contact', { name, email, message });
 
            if (res.data.success) {
                setStatus('success');
                setName('');
                setEmail('');
                setMessage('');
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setErrorMessage(res.data.message || 'Message transmission failed.');
            }
        } catch (err) {
            setStatus('error');
            console.error(err);
            const serverMessage = err.response?.data?.message || 'Secure link timed out. Please check backend connection.';
            setErrorMessage(serverMessage);
        }
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="relative w-full min-h-screen bg-[#030303] flex items-center justify-center py-24 px-6 md:px-12 overflow-hidden"
        >
            {/* Intense Background Glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
                <div className="w-[800px] h-[500px] bg-red-600/10 rounded-full blur-[150px] mix-blend-screen opacity-50" />
            </div>

            <div className="max-w-2xl w-full relative z-10 flex flex-col items-center text-center">

                {/* Header Block */}
                <div className="mb-12 animate-element">
                    <p className="text-red-500 font-mono text-sm tracking-[0.3em] uppercase font-bold mb-4">
                        [ Encrypted Channel ]
                    </p>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white font-sans leading-none mb-6 drop-shadow-xl">
                        Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white font-serif italic pr-2">Connect</span>
                    </h2>
                    <p className="text-gray-400 font-light text-lg tracking-wide leading-relaxed max-w-xl mx-auto">
                        Whether you have a groundbreaking tech vision, a complex application to build, or just want to talk shop—my inbox is always open. Let’s collaborate and architect the digital tools of tomorrow.
                    </p>
                </div>

                {/* Form Block */}
                <form ref={formRef} onSubmit={handleSubmit} className="w-full flex flex-col space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="relative group animate-element">
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="peer w-full bg-white/5 border border-white/5 text-white text-base rounded-xl px-5 py-4 outline-none transition-all duration-300 focus:bg-white/10 focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] placeholder-transparent"
                                placeholder="Name"
                            />
                            <label htmlFor="name" className="absolute left-5 top-4 text-gray-500 text-base pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-red-400 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-gray-400 bg-[#030303] px-1 rounded">
                                Name
                            </label>
                        </div>

                        {/* Email Input */}
                        <div className="relative group animate-element">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="peer w-full bg-white/5 border border-white/5 text-white text-base rounded-xl px-5 py-4 outline-none transition-all duration-300 focus:bg-white/10 focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] placeholder-transparent"
                                placeholder="Email"
                            />
                            <label htmlFor="email" className="absolute left-5 top-4 text-gray-500 text-base pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-red-400 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-gray-400 bg-[#030303] px-1 rounded">
                                Email
                            </label>
                        </div>
                    </div>

                    {/* Message Textarea */}
                    <div className="relative group animate-element">
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows="5"
                            className="peer w-full bg-white/5 border border-white/5 text-white text-base rounded-xl px-5 py-4 outline-none transition-all duration-300 focus:bg-white/10 focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] placeholder-transparent resize-none"
                            placeholder="Message"
                        ></textarea>
                        <label htmlFor="message" className="absolute left-5 top-4 text-gray-500 text-base pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-red-400 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-gray-400 bg-[#030303] px-1 rounded">
                            Message
                        </label>
                    </div>

                    {/* Status Feedback Indicators */}
                    {status === 'success' && (
                        <div className="animate-element text-emerald-400 font-mono text-xs border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 rounded-xl tracking-wider uppercase">
                            [ Connection Decrypted ]: Message transmitted successfully!
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="animate-element text-red-400 font-mono text-xs border border-red-500/30 bg-red-500/5 px-4 py-3 rounded-xl tracking-wider uppercase">
                            [ Transmission Fail ]: {errorMessage}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="animate-element pt-4 flex justify-center">
                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="relative group overflow-hidden rounded-full w-full md:w-auto px-12 py-4 border border-red-500/30 bg-black text-white text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:scale-[1.02] hover:border-red-500 shadow-[0_0_0_rgba(239,68,68,0)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                        >
                            {/* Animated Inner Sweep */}
                            <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                            <span className="relative z-10 flex items-center justify-center space-x-3">
                                <span>{status === 'sending' ? 'Transmitting Message...' : 'Transmit Message'}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-red-500">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </span>
                        </button>
                    </div>

                </form>

                {/* Futuristic horizontal socials tray */}
                <div className="w-full mt-20 pt-10 border-t border-white/5 animate-element flex flex-col items-center">
                    <p className="text-gray-500 font-mono text-sm tracking-[0.3em] uppercase mb-6">
                        [ Channels to communicate ]
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn relative px-5 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white flex items-center space-x-3 transition-all duration-500 hover:border-red-500/40 hover:bg-white/[0.04] active:scale-95"
                                style={{
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                }}
                            >
                                {/* Glow Ring backdrop */}
                                <div className="absolute inset-0 rounded-xl bg-red-500/0 group-hover/btn:bg-red-500/5 blur-md transition-all duration-500 pointer-events-none" />

                                <span className="text-gray-400 group-hover/btn:text-red-500 transition-colors duration-300">
                                    {social.icon}
                                </span>
                                <span className="text-xs font-semibold tracking-wider font-sans uppercase">
                                    {social.name}
                                </span>
                            </a>
                        ))}
                    </div>
                    <p className="text-gray-600 text-sm tracking-[0.2em] uppercase mt-12 font-mono">
                        © {new Date().getFullYear()} Crens Balar. Connection Secured.
                    </p>
                </div>

            </div>

            {/* Tailwind config hack config for custom shimmer keyframe. A real project injects this in index.css or tailwind.config.js - we can shim it inline cleanly here */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
        </section>
    );
}
