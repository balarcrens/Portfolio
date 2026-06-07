import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project }) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();

        // Calculate mouse position strictly bounded within the card [-1, 1]
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Apply 3D tilt mapped against mouse offset (multiplied by degrees of max tilt)
        gsap.to(cardRef.current, {
            rotateY: x * 15, // tilt left/right up to 7.5 deg
            rotateX: -y * 15, // tilt up/down up to 7.5 deg
            transformPerspective: 1000,
            ease: 'power2.out',
            duration: 0.4
        });

        // Move the glow to follow the cursor exactly
        gsap.to(glowRef.current, {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            opacity: 1,
            duration: 0.2
        });
    };

    const handleMouseLeave = () => {
        // Snap back everything cleanly
        gsap.to(cardRef.current, {
            rotateY: 0,
            rotateX: 0,
            ease: 'power3.out',
            duration: 0.6
        });

        gsap.to(glowRef.current, {
            opacity: 0,
            duration: 0.4
        });
    };

    return (
        <div
            className="project-card relative w-full h-[450px] rounded-xl overflow-hidden cursor-default group bg-black border border-white/10"
            style={{ transformStyle: 'preserve-3d' }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >

            {/* Dynamic Hover Glow Layer Tracker */}
            <div
                ref={glowRef}
                className="absolute w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen"
            />

            {/* Laser Border overlay on Hover */}
            <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-500/40 rounded-xl transition-colors duration-500 z-20 pointer-events-none" />

            {/* Foreground Content */}
            <div className="absolute inset-0 z-30 p-8 flex flex-col justify-end pointer-events-none" style={{ transform: 'translateZ(30px)' }}> {/* Push text outward on Z axis */}

                {/* Dossier Code */}
                <div className="text-red-500/80 font-mono text-xs tracking-[0.3em] mb-2 font-bold uppercase transition-transform duration-500 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    PROJECT {project.id}
                </div>

                <h3 className="text-3xl font-bold tracking-tight text-white mb-3 leading-none drop-shadow-xl font-sans">
                    {project.name}
                </h3>

                <p className="text-gray-400 text-sm md:text-md leading-relaxed mb-4 font-light max-w-[95%] line-clamp-3">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 pointer-events-auto">
                    {project.tech.map((tool) => (
                        <span key={tool} className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-white/20 rounded-full text-gray-300 font-medium">
                            {tool}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pointer-events-auto w-fit">
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-red-500 hover:text-white transition-colors duration-300 group/link relative"
                    >
                        <span className="relative py-1 block">
                            <span>Live Project</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-red-500 group-hover/link:w-full transition-all duration-300"></span>
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300 text-red-500 group-hover/link:text-white">
                            <line x1="5" y1="19" x2="19" y2="5"></line>
                            <polyline points="10 5 19 5 19 14"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

const ProjectSkeleton = () => {
    return (
        <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-black/40 border border-white/5 p-8 flex flex-col justify-end select-none">
            {/* Dossier Code placeholder */}
            <div className="w-24 h-4 bg-white/5 rounded animate-pulse mb-3" />
            
            {/* Title placeholder */}
            <div className="w-3/4 h-8 bg-white/10 rounded animate-pulse mb-4" />
            
            {/* Description lines placeholder */}
            <div className="space-y-2 mb-6">
                <div className="w-full h-3.5 bg-white/5 rounded animate-pulse" />
                <div className="w-5/6 h-3.5 bg-white/5 rounded animate-pulse" />
                <div className="w-2/3 h-3.5 bg-white/5 rounded animate-pulse" />
            </div>
            
            {/* Tech tags placeholder */}
            <div className="flex flex-wrap gap-2 mb-6">
                <div className="w-16 h-7 bg-white/5 rounded-full animate-pulse" />
                <div className="w-20 h-7 bg-white/5 rounded-full animate-pulse" />
                <div className="w-14 h-7 bg-white/5 rounded-full animate-pulse" />
            </div>
            
            {/* Link button placeholder */}
            <div className="w-28 h-5 bg-white/5 rounded animate-pulse mt-auto" />
        </div>
    );
};

export default function Projects() {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [activeProjects, setActiveProjects] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const res = await api.get('/projects');
                if (res.data.success && res.data.data.length > 0) {
                    setActiveProjects(res.data.data);
                }
            } catch (err) {
                console.error('[PROJECTS] Backend query offline. Failed to load portfolio project dossier.', err.message);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    useEffect(() => {
        if (activeProjects.length === 0) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });

            // Header Animation
            tl.fromTo(headerRef.current.children,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
            );

            // Select cards via class
            const cards = sectionRef.current.querySelectorAll('.project-card');

            tl.fromTo(cards,
                { opacity: 0, y: 100, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" },
                "-=0.6"
            );

        }, sectionRef);

        return () => ctx.revert();
    }, [activeProjects]);

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="w-full min-h-screen bg-transparent py-10 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden"
        >
            <div className="max-w-[90rem] mx-auto w-full relative z-10">

                {/* Header Block */}
                <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold tracking-tighter text-white font-sans leading-none drop-shadow-lg mb-4">
                            Featured <span className="font-serif italic font-light opacity-80 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white pr-2">Projects</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 font-light tracking-wide text-base md:text-lg max-w-sm mt-6 md:mt-0 leading-relaxed md:text-right">
                        A selection of projects focused on performance, scalability, and user experience.
                    </p>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 place-items-center w-full">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <ProjectSkeleton key={idx} />
                        ))
                    ) : activeProjects.length > 0 ? (
                        activeProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center border border-white/5 bg-black/20 rounded-xl w-full">
                            <p className="text-red-500 font-mono text-xs tracking-widest uppercase">SYSTEM STATUS: PROJECT DOSSIER OFFLINE</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Background Ambience line-grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}
            />
        </section>
    );
}
