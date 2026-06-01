/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api';

// Import our custom high-fidelity generated cyberpunk mockups
import imgCartivoshop from '../assets/projects/cartivoshop.png';
import imgIflexpdf from '../assets/projects/iflexpdf.png';
import imgNexoranews from '../assets/projects/nexoranews.png';
import imgHelpyzo from '../assets/projects/helpyzo.png';
import imgRestaurantPos from '../assets/projects/restaurant_pos.png';
import imgShreeexpress from '../assets/projects/shreeexpress.png';
import imgMoviela from '../assets/projects/moviela.png';
import imgFinalDestination from '../assets/projects/final_destination.png';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
    {
        id: '01',
        name: 'CartivoShop',
        description:
            'A full-stack e-commerce platform featuring secure authentication, product management, shopping cart functionality, order processing, and an intuitive shopping experience across all devices.',
        tech: [
            'React JS',
            'Node JS',
            'Express JS',
            'PostgreSQL',
            'Tailwind CSS'
        ],
        image: imgCartivoshop,
        link: 'https://cartivoshop.vercel.app',
        type: 'Full-Stack E-Commerce',
        role: 'Lead Full-Stack Developer',
        timeline: '3 Months (Q1 2026)',
        challenge: 'Synchronizing shopping cart states across concurrent multi-user sessions and database locks during peak checkout orders without introducing layout render lag.',
        solution: 'Developed transactional synchronization handlers in Express.js backed by strict index querying on PostgreSQL schemas, achieving sub-100ms response timelines.',
        features: [
            'Dynamic multi-role checkout admin controls panel',
            'JWT encryption session session protection tokens',
            'Responsive custom dashboard product inventory tracking',
            'Fluid client-side invoice and billing receipts generator'
        ],
        stackFront: ['React JS', 'Tailwind CSS', 'Redux', 'GSAP'],
        stackBack: ['Node JS', 'Express JS', 'RESTful API', 'JWT'],
        stackDb: ['PostgreSQL Database', 'Sequelize ORM', 'SQL Indexing'],
        stackDevOps: ['Vercel Cloud', 'Render APIs', 'GitHub Actions'],
        metricPerf: '97%',
        metricResp: '100%',
        metricArch: '96%',
        blend: 'mix-blend-screen opacity-70'
    },

    {
        id: '02',
        name: 'iFlexPDF',
        description:
            'A web-based PDF toolkit that allows users to merge, split, compress, convert, lock, unlock, and organize PDF documents through a secure and user-friendly interface.',
        tech: [
            'React JS',
            'PDF Processing',
            'Tailwind CSS',
            'Local Storage'
        ],
        image: imgIflexpdf,
        link: 'https://iflexpdf.online',
        type: 'Web Utility Toolkit',
        role: 'Sole Architect & Developer',
        timeline: '2 Months (Q4 2025)',
        challenge: 'Manipulating raw PDF binary documents directly in the user browser within strict memory ceilings to avoid tab crashes during split and compression processes.',
        solution: 'Built client-side binary buffer pipeline managers powered by web worker threads and progressive garbage collection heap clearing.',
        features: [
            'High-efficiency progressive client-side file merging',
            'Lossless file compression and optimization utilities',
            'Secure document encryption locks and key managers',
            'Drag-and-drop structural page reordering interface'
        ],
        stackFront: ['React JS', 'Tailwind CSS', 'Vite', 'Canvas API'],
        stackBack: ['Browser Engine', 'Web Workers', 'Progressive Buffers'],
        stackDb: ['IndexedDB Store', 'Browser LocalStorage'],
        stackDevOps: ['Netlify Hosting', 'GitHub Actions', 'ESLint CI'],
        metricPerf: '99%',
        metricResp: '100%',
        metricArch: '98%',
        blend: 'mix-blend-screen opacity-70'
    },

    {
        id: '03',
        name: 'NexoraNews',
        description:
            'A modern news platform delivering categorized content, responsive layouts, optimized performance, and an engaging reading experience for users across devices.',
        tech: [
            'React JS',
            'Node JS',
            'Express JS',
            'MongoDB',
            'REST API'
        ],
        image: imgNexoranews,
        link: 'https://nexoranews.netlify.app',
        type: 'Modern News Portal',
        role: 'Full-Stack Developer',
        timeline: '3 Months (Q3 2025)',
        challenge: 'Maintaining high Core Web Vitals speeds (LCP & CLS) while handling thousands of search requests and asynchronous article catalog ingestion queries.',
        solution: 'Implemented progressive dynamic DOM hydration, aggressive server-side debounced endpoints, and Redis caching blocks for frequent catalog queries.',
        features: [
            'Real-time article classification and tagging',
            'Integrated OAuth authentication adapters (Google & GitHub)',
            'Intuitive authoring dashboard rich-text workspace',
            'Complete custom meta-tags header SEO config engine'
        ],
        stackFront: ['React JS', 'Tailwind CSS', 'Redux Toolkit', 'GSAP'],
        stackBack: ['Node JS', 'Express JS', 'OAuth API', 'REST'],
        stackDb: ['MongoDB Atlas', 'Mongoose schemas', 'Redis Cache'],
        stackDevOps: ['Netlify CDN', 'Vercel Functions', 'GitHub CI'],
        metricPerf: '95%',
        metricResp: '98%',
        metricArch: '95%',
        blend: 'mix-blend-screen opacity-70'
    },

    {
        id: '04',
        name: 'Helpyzo',
        description:
            'A home services marketplace that connects customers with verified service professionals, including plumbers, electricians, technicians, and other local service providers.',
        tech: [
            'React JS',
            'Node JS',
            'Express JS',
            'MongoDB',
            'Geo-Filtering'
        ],
        image: imgHelpyzo,
        link: 'https://helpyzo.netlify.app',
        type: 'Services Marketplace',
        role: 'Lead Full-Stack Developer',
        timeline: '4 Months (Q2 2025)',
        challenge: 'Building a responsive spatial geolocation search engine to query local service technicians in real time without causing slow database indexes queries.',
        solution: 'Engineered optimized 2dsphere geospatial search parameters within MongoDB Atlas, feeding a reactive progressive service update schedule.',
        features: [
            'Marketplace geospatial proximity technician routing',
            'Interactive scheduler for appointment slot bookings',
            'Secure service worker profiles credential manager',
            'Complete verified user feedback and ratings block'
        ],
        stackFront: ['React JS', 'Tailwind CSS', 'React Context API', 'Vite'],
        stackBack: ['Node JS', 'Express JS', 'Geo-JSON REST APIs'],
        stackDb: ['MongoDB Database', 'Mongoose Schemas', 'Geospatial Indexes'],
        stackDevOps: ['Netlify Hosting', 'Heroku Cloud', 'GitHub CI'],
        metricPerf: '96%',
        metricResp: '100%',
        metricArch: '94%',
        blend: 'mix-blend-screen opacity-70'
    },

    {
        id: '05',
        name: 'Restaurant POS',
        description:
            'A restaurant management and point-of-sale system designed to streamline order processing, billing, menu management, and operational workflows.',
        tech: [
            'React JS',
            'Node JS',
            'Express JS',
            'PostgreSQL',
            'Dashboard'
        ],
        image: imgRestaurantPos,
        link: 'https://restaurant-pos-crens.vercel.app',
        type: 'Restaurant Management & POS',
        role: 'Full-Stack Developer',
        timeline: '3 Months (Q1 2025)',
        challenge: 'Ensuring transaction integrity during high-frequency peak hours on relational dining order tables, eliminating concurrency conflicts.',
        solution: 'Designed robust database level transactional locking inside PostgreSQL tied with optimistic UI state rendering on the POS dashboard.',
        features: [
            'Highly interactive touchscreen point-of-sale layout',
            'Optimistic offline transactional buffer caching',
            'Real-time inventory ingredient depletion signals',
            'Analytical visual sales and tax report charts'
        ],
        stackFront: ['React JS', 'Tailwind CSS', 'Chart.js', 'Vite'],
        stackBack: ['Node JS', 'Express JS', 'REST APIs', 'JWT Tokens'],
        stackDb: ['PostgreSQL DB', 'Sequelize ORM', 'Relational Lockings'],
        stackDevOps: ['Vercel Cloud', 'Render Engine', 'GitHub Actions'],
        metricPerf: '98%',
        metricResp: '97%',
        metricArch: '96%',
        blend: 'mix-blend-screen opacity-70'
    },

    {
        id: '06',
        name: 'ShreeExpress',
        description:
            'A courier and logistics management platform providing shipment tracking, delivery management, customer records, and operational monitoring tools.',
        tech: [
            'React JS',
            'Node JS',
            'Express JS',
            'MongoDB',
            'Audit Logging'
        ],
        image: imgShreeexpress,
        link: 'https://shreexpresscourier.netlify.app',
        type: 'Courier & Logistics Tracker',
        role: 'Full-Stack Developer',
        timeline: '2.5 Months (Q4 2024)',
        challenge: 'Managing tracking audit event logs across multiple courier transfer hubs without incurring database read and write blocks.',
        solution: 'Structured a MongoDB event-driven document tracking collection utilizing progressive bulk updates and decoupled index logging.',
        features: [
            'Centralized dispatch parcel hub timeline auditing',
            'Driver mobile panel quick check-in state switchers',
            'Interactive client-facing shipment delivery map',
            'Complete administration parcel reports metrics dashboard'
        ],
        stackFront: ['React JS', 'Tailwind CSS', 'Context API', 'GSAP'],
        stackBack: ['Node JS', 'Express JS', 'Audit Log REST APIs'],
        stackDb: ['MongoDB Atlas', 'Mongoose Schemas', 'Audit Indexes'],
        stackDevOps: ['Netlify CDN', 'Render Hosting', 'GitHub Actions'],
        metricPerf: '97%',
        metricResp: '99%',
        metricArch: '95%',
        blend: 'mix-blend-screen opacity-70'
    },

    {
        id: '07',
        name: 'Moviela',
        description:
            'A movie discovery platform that enables users to explore movie information, ratings, categories, trending content, and detailed entertainment insights.',
        tech: [
            'React JS',
            'Tailwind CSS',
            'Vite',
            'Dynamic Search'
        ],
        image: imgMoviela,
        link: 'https://moviela.vercel.app',
        type: 'Movie Discovery Interface',
        role: 'Frontend Architect',
        timeline: '2 Months (Q3 2024)',
        challenge: 'Delivering buttery smooth micro-animations, lazy loading grids, and filters while integrating continuous TMDB REST APIs.',
        solution: 'Built client-side search caching buffers, debounced input triggers, and utilized CSS hardware transforms via GSAP for animation timelines.',
        features: [
            'Premium cinematic glassmorphic dark-theme design',
            'Debounced instant movie titles query system',
            'Dynamic filter categories and catalog sorting grids',
            'Rich media carousel preview details page overlay'
        ],
        stackFront: ['React JS', 'Tailwind CSS', 'GSAP Animations', 'Vite'],
        stackBack: ['Node JS', 'Express API Proxy Adapters'],
        stackDb: ['Browser Cache Engine', 'TMDB REST API Integration'],
        stackDevOps: ['Vercel Cloud', 'GitHub CI/CD', 'ESLint Engine'],
        metricPerf: '99%',
        metricResp: '100%',
        metricArch: '97%',
        blend: 'mix-blend-screen opacity-70'
    },
    {
        id: '08',
        name: 'Final Destination Tour',
        description:
            'A tour and travel booking platform that allows users to explore destinations, browse tour packages, view travel details, and submit booking inquiries through a responsive and user-friendly interface.',
        tech: [
            'React JS',
            'PHP',
            'MySQL',
            'Travel Booking'
        ],
        image: imgFinalDestination,
        link: 'https://finaldestinationtour.vercel.app/',
        type: 'Travel Tour Booking Platform',
        role: 'Sole Architect & Developer',
        timeline: '3 Months (Q2 2024)',
        challenge: 'Designing a content-dense visual exploration grid with highly interactive scheduling and tour packages selection while keeping page sizes low.',
        solution: 'Established clear MVC architecture separations under a PHP processing controller layer, coupled with indexed MySQL relational search queries.',
        features: [
            'Immersive layout destination search discovery cards',
            'Asynchronous reservation booking pipeline triggers',
            'Dynamic tour pricing search filter categories',
            'Responsive custom contact and interactive booking form'
        ],
        stackFront: ['React JS', 'Tailwind CSS', 'Vanilla JavaScript', 'CSS Grid'],
        stackBack: ['PHP Controller', 'REST API endpoints', 'MVC Pattern'],
        stackDb: ['MySQL Database', 'SQL Query Index Optimizations'],
        stackDevOps: ['Shared Cloud Web Host', 'Vercel APIs', 'Git Hooks'],
        metricPerf: '96%',
        metricResp: '100%',
        metricArch: '95%',
        blend: 'mix-blend-screen opacity-70'
    }
];

const IMAGE_MAP = {
    '01': imgCartivoshop,
    '02': imgIflexpdf,
    '03': imgNexoranews,
    '04': imgHelpyzo,
    '05': imgRestaurantPos,
    '06': imgShreeexpress,
    '07': imgMoviela,
    '08': imgFinalDestination
};

const ProjectCard = ({ project }) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const imageRef = useRef(null);
    const projectImage = IMAGE_MAP[project.id] || project.image || 'https://via.placeholder.com/600x400';

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

        // Inverse parallax on the image inside
        gsap.to(imageRef.current, {
            x: -x * 20,
            y: -y * 20,
            scale: 1.1,
            ease: 'power2.out',
            duration: 0.4
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

        gsap.to(imageRef.current, {
            x: 0,
            y: 0,
            scale: 1.0,
            ease: 'power3.out',
            duration: 0.6
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
            {/* Background Image Layer
            <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-900">
                <img
                    ref={imageRef}
                    src={projectImage}
                    alt={project.name}
                    className={`absolute inset-0 w-full h-[120%] -top-[10%] object-cover object-center ${project.blend || 'mix-blend-screen opacity-70'} transition-all duration-[1.5s]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
            </div> */}

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

                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 font-light max-w-[95%] line-clamp-3">
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

export default function Projects() {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const [activeProjects, setActiveProjects] = useState(PROJECTS);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const res = await api.get('/projects');
                if (res.data.success && res.data.data.length > 0) {
                    setActiveProjects(res.data.data);
                }
            } catch (err) {
                console.warn('[PROJECTS] Backend query offline. Loading local fallback project list.', err.message);
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
            className="w-full min-h-screen bg-[#030303] py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 place-items-center">
                    {activeProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

            </div>

            {/* Background Ambience line-grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}
            />
        </section>
    );
}
