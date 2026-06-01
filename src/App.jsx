import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import FloatingSocials from './components/FloatingSocials';
import BlackHole from './components/BlackHole';
import AdminPanel from './components/AdminPanel';

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

    const navigate = (toPath) => {
        window.history.pushState({}, '', toPath);
        window.dispatchEvent(new Event('pushstate-change'));
    };

    if (path === '/admin') {
        return <AdminPanel onNavigate={navigate} />;
    }

    return (
        <>
            <Navbar />
            <FloatingSocials />
            <Hero />
            <About />
            <Projects />
            <Contact />
            <BlackHole />
        </>
    );
}

export default App;

