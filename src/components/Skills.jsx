import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    FaReact, 
    FaHtml5, 
    FaJs, 
    FaNodeJs, 
    FaDatabase, 
    FaGitAlt, 
    FaMobileAlt, 
    FaPaintBrush, 
    FaNetworkWired, 
    FaCode 
} from 'react-icons/fa';
import { 
    SiTailwindcss, 
    SiExpress, 
    SiMongodb, 
    SiPostgresql, 
    SiVite, 
    SiRedux 
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
    React: FaReact,
    Tailwind: SiTailwindcss,
    HtmlCss: FaHtml5,
    Js: FaJs,
    Responsive: FaMobileAlt,
    Design: FaPaintBrush,
    Node: FaNodeJs,
    Express: SiExpress,
    Mongo: SiMongodb,
    Postgres: SiPostgresql,
    Mern: FaReact,
    Pern: SiPostgresql,
    Api: FaNetworkWired,
    Git: FaGitAlt,
    State: SiRedux,
    Architecture: FaCode,
    Vite: SiVite,
    Database: FaDatabase
};

const SKILL_CATEGORIES = [
    {
        title: "Client-Side & UI Engineering",
        skills: [
            { name: "React JS", icon: "React", color: "#61DAFB" },
            { name: "Tailwind CSS", icon: "Tailwind", color: "#06B6D4" },
            { name: "HTML5 & CSS3", icon: "HtmlCss", color: "#E34F26" },
            { name: "JavaScript", icon: "Js", color: "#F7DF1E" },
            { name: "Responsive Design", icon: "Responsive", color: "#10B981" },
            { name: "Attractive UIs", icon: "Design", color: "#EC4899" }
        ]
    },
    {
        title: "Server-Side & Databases",
        skills: [
            { name: "Node JS", icon: "Node", color: "#339933" },
            { name: "Express JS", icon: "Express", color: "#E0E0E0" },
            { name: "MongoDB", icon: "Mongo", color: "#47A248" },
            { name: "PostgreSQL", icon: "Postgres", color: "#4169E1" },
            { name: "MERN Stack", icon: "Mern", color: "#00D8FF" },
            { name: "PERN Stack", icon: "Pern", color: "#336791" }
        ]
    },
    {
        title: "Architecture & Workflows",
        skills: [
            { name: "RESTful APIs", icon: "Api", color: "#8B5CF6" },
            { name: "Git & GitHub", icon: "Git", color: "#F05032" },
            { name: "Application State", icon: "State", color: "#764ABC" },
            { name: "Clean Architecture", icon: "Architecture", color: "#3B82F6" },
            { name: "Vite & Build Tools", icon: "Vite", color: "#646CFF" },
            { name: "Database Design", icon: "Database", color: "#F59E0B" }
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
            className="w-full min-h-screen bg-transparent py-10 px-4 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden"
        >
            <div className="max-w-[90rem] mx-auto w-full relative z-10">
                {/* Header Block */}
                <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8">
                    <div className="max-w-2xl">
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
                            className="skill-card group relative bg-black/40 border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col hover:border-red-500/30 transition-all duration-500"
                            style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
                        >
                            {/* Glow Ring backdrop */}
                            <div className="absolute inset-0 rounded-2xl bg-red-500/0 group-hover:bg-red-500/[0.02] blur-xl transition-all duration-500 pointer-events-none" />

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white font-sans tracking-tight">
                                    {cat.title}
                                </h3>
                            </div>

                            {/* Inner tags grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {cat.skills.map((skill, sIdx) => {
                                    const IconComponent = ICON_MAP[skill.icon] || FaCode;
                                    return (
                                        <div
                                            key={sIdx}
                                            className="skill-item skill-item-interactive flex items-center py-3 px-4 rounded-xl border border-white/5 bg-white/[0.01] transition-all duration-300 group/item"
                                            style={{
                                                '--brand-color': skill.color,
                                                '--brand-bg': `${skill.color}0d`, // ~5% opacity
                                                '--brand-glow': `${skill.color}26`, // ~15% opacity
                                            }}
                                        >
                                            <div className="skill-icon-wrapper">
                                                <IconComponent className="w-5 h-5 transition-transform duration-300 skill-icon" />
                                            </div>
                                            <span className="skill-arrow text-red-500/60 group-hover/item:text-red-500 transition-colors font-mono text-xs font-bold select-none mr-2.5">
                                                &gt;
                                            </span>
                                            <span className="text-gray-400 group-hover/item:text-white text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors duration-300">
                                                {skill.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Ambience line-grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }}
            />

            {/* Custom Interactive Styles for Hover Icon Effects */}
            <style dangerouslySetInnerHTML={{ __html: `
                .skill-item-interactive {
                    position: relative;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .skill-item-interactive:hover {
                    border-color: var(--brand-color) !important;
                    background-color: var(--brand-bg) !important;
                    box-shadow: 0 4px 20px var(--brand-glow) !important;
                }
                .skill-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 0px;
                    opacity: 0;
                    transform: scale(0.6) rotate(-15deg);
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    color: var(--brand-color);
                }
                .skill-item-interactive:hover .skill-icon-wrapper {
                    width: 20px;
                    opacity: 1;
                    transform: scale(1.1) rotate(0deg);
                    margin-right: 10px;
                }
                .skill-arrow {
                    display: inline-block;
                    width: 12px;
                    opacity: 1;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .skill-item-interactive:hover .skill-arrow {
                    width: 0px;
                    opacity: 0;
                    margin-right: 0px;
                }
            `}} />
        </section>
    );
}
