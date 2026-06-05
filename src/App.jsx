import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import FloatingSocials from './components/FloatingSocials';
import BlackHole from './components/BlackHole';
import AdminPanel from './components/AdminPanel';
import NotFound from './components/NotFound';
import ProgressBar from './components/ProgressBar';
import SpaceBackground from './components/SpaceBackground';
import Skills from './components/Skills';

function App() {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const handleLocationChange = () => {
            setPath(window.location.pathname);
        };
        
        window.addEventListener('popstate', handleLocationChange);
        window.addEventListener('pushstate-change', handleLocationChange);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            window.removeEventListener('pushstate-change', handleLocationChange);
        };
    }, []);

    // Dynamic Title and Robots Index Management Side-Effect
    useEffect(() => {
        if (path === '/') {
            document.title = 'Crens Balar | Full-Stack Developer Portfolio';
        } else if (path === '/admin') {
            document.title = 'Admin Workspace | Secure Portal';
        } else {
            document.title = '404 - Gravity Anomaly | Crens Balar';
        }

        let robotsMeta = document.querySelector('meta[name="robots"]');
        if (path === '/admin' || (path !== '/' && path !== '/admin')) {
            if (robotsMeta) {
                robotsMeta.setAttribute('content', 'noindex, nofollow');
            } else {
                robotsMeta = document.createElement('meta');
                robotsMeta.name = 'robots';
                robotsMeta.content = 'noindex, nofollow';
                document.head.appendChild(robotsMeta);
            }
        } else {
            if (robotsMeta) {
                robotsMeta.setAttribute('content', 'index, follow');
            }
        }
    }, [path]);

    const navigate = (toPath) => {
        window.history.pushState({}, '', toPath);
        window.dispatchEvent(new Event('pushstate-change'));
    };

    if (path === '/admin') {
        return (
            <>
                <SpaceBackground />
                <AdminPanel onNavigate={navigate} />
            </>
        );
    }

    if (path === '/') {
        return (
            <>
                <SpaceBackground />
                <Navbar />
                <FloatingSocials />
                <ProgressBar />
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Contact />
                <BlackHole />
            </>
        );
    }

    // Intercept any invalid paths and pipe them into the Gravity Singularity 404 Vortex
    return (
        <>
            <SpaceBackground />
            <NotFound onNavigate={navigate} />
        </>
    );
}

export default App;

