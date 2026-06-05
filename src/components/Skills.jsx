import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SKILL_CATEGORIES = [
    {
        title: "Frontend Engineering",
        subtitle: "[ CLIENT_SIDE_ENGINE ]",
        skills: [
            "React JS",
            "Tailwind CSS",
            "HTML5 & CSS3",
            "JavaScript",
            "Responsive Design",
            "Attractive UIs"
        ]
    },
    {
        title: "Backend & Systems",
        subtitle: "[ SERVICE_SIDE_CORE ]",
        skills: [
            "Node JS",
            "Express JS",
            "MongoDB",
            "PostgreSQL",
            "MERN Stack",
            "PERN Stack"
        ]
    },
    {
        title: "Architecture & Workflow",
        subtitle: "[ DEVOPS_ARCH_SYSTEM ]",
        skills: [
            "RESTful APIs",
            "Git & GitHub",
            "Application State",
            "Clean Architecture",
            "Vite & Build Tools",
            "Database Design"
        ]
    }
];

export default function Skills() {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(headerRef.current.children,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Card entry animations
            const cards = sectionRef.current.querySelectorAll('.skill-card');
            gsap.fromTo(cards,
                { opacity: 0, y: 50, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Item entry animations (staggered fade-up inside the cards)
            const items = sectionRef.current.querySelectorAll('.skill-item');
            gsap.fromTo(items,
                { opacity: 0, x: -10 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.04,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="w-full min-h-screen bg-transparent py-10 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden"
        >
            <div className="max-w-[90rem] mx-auto w-full relative z-10">
                {/* Header Block */}
                <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8">
                    <div className="max-w-2xl">
                        <p className="text-red-500 font-mono text-sm tracking-[0.3em] uppercase font-bold mb-4">
                            [ System Capabilities ]
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold tracking-tighter text-white font-sans leading-none drop-shadow-lg">
                            Technical <span className="font-serif italic font-light opacity-80 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white pr-2">Expertise</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 font-light tracking-wide text-base md:text-lg max-w-sm mt-6 md:mt-0 leading-relaxed md:text-right">
                        A display of technologies, frameworks, and engineering standards I utilize to build digital solutions.
                    </p>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
                    {SKILL_CATEGORIES.map((cat, idx) => (
                        <div
                            key={idx}
                            className="skill-card group relative bg-black/40 border border-white/5 p-8 rounded-2xl flex flex-col hover:border-red-500/30 transition-all duration-500"
                            style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
                        >
                            {/* Glow Ring backdrop */}
                            <div className="absolute inset-0 rounded-2xl bg-red-500/0 group-hover:bg-red-500/[0.02] blur-xl transition-all duration-500 pointer-events-none" />

                            <div className="mb-6">
                                <span className="text-red-500 font-mono text-xs tracking-[0.25em] uppercase font-bold block mb-1">
                                    {cat.subtitle}
                                </span>
                                <h3 className="text-2xl font-bold text-white font-sans tracking-tight">
                                    {cat.title}
                                </h3>
                            </div>

                            {/* Inner tags grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {cat.skills.map((skill, sIdx) => (
                                    <div
                                        key={sIdx}
                                        className="skill-item flex items-center space-x-2.5 py-3 px-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-red-500/20 hover:bg-white/[0.03] transition-all duration-300 group/item"
                                    >
                                        <span className="text-red-500/60 group-hover/item:text-red-500 transition-colors font-mono text-xs font-bold select-none">
                                            &gt;
                                        </span>
                                        <span className="text-gray-400 group-hover/item:text-white text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors duration-300">
                                            {skill}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Ambience line-grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }}
            />
        </section>
    );
}
