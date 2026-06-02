import React, { useState, useEffect } from 'react';
import api, { setAuthToken } from '../api';

export default function AdminPanel({ onNavigate }) {
    const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dashboard State
    const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'messages'
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [dashboardError, setDashboardError] = useState('');

    // Project Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null); // null for create, ID for edit
    const [formProject, setFormProject] = useState({
        name: '',
        description: '',
        tech: '',
        image: '',
        link: '',
        type: 'Web Application'
    });

    // Check token and fetch data on mount or token change
    useEffect(() => {
        if (token) {
            fetchProjects();
            fetchMessages();
        }
    }, [token]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);

        try {
            const res = await api.post('/admin/login', { username, password });
            const data = res.data;

            if (data.success) {
                localStorage.setItem('admin_token', data.token);
                setAuthToken(data.token);
                setToken(data.token);
            } else {
                setLoginError(data.message || 'Invalid administrator credentials.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Error connecting to backend authentication API.';
            setLoginError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        setAuthToken(null);
        setToken('');
        setProjects([]);
        setMessages([]);
    };

    // --- API Interactions ---

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            if (res.data.success) {
                setProjects(res.data.data);
            } else {
                setDashboardError('Failed to fetch active projects.');
            }
        } catch (err) {
            setDashboardError('Connection to project database failed.');
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contact');
            if (res.data.success) {
                setMessages(res.data.data);
            } else {
                setDashboardError('Failed to fetch inbox messages.');
            }
        } catch (err) {
            setDashboardError('Connection to message database failed.');
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Are you absolutely sure you want to delete this project? This action is irreversible.')) return;

        try {
            const res = await api.delete(`/projects/${id}`);
            if (res.data.success) {
                fetchProjects();
            } else {
                alert(res.data.message || 'Error deleting project.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to transmit deletion signal to server.';
            alert(msg);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Confirm deletion of this visitor inquiry?')) return;

        try {
            const res = await api.delete(`/contact/${id}`);
            if (res.data.success) {
                fetchMessages();
            } else {
                alert(res.data.message || 'Error deleting message.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to transmit message deletion signal to server.';
            alert(msg);
        }
    };

    const handleProjectFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const techArray = formProject.tech.split(',').map(item => item.trim()).filter(Boolean);

        const bodyData = {
            ...formProject,
            tech: techArray
        };

        try {
            const res = editingProjectId 
                ? await api.put(`/projects/${editingProjectId}`, bodyData)
                : await api.post('/projects', bodyData);

            if (res.data.success) {
                setIsFormOpen(false);
                setEditingProjectId(null);
                setFormProject({
                    name: '',
                    description: '',
                    tech: '',
                    image: '',
                    link: '',
                    type: 'Web Application'
                });
                fetchProjects();
            } else {
                alert(res.data.message || 'Validation error while saving project.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to connect to backend server for project save.';
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProjectClick = (proj) => {
        setEditingProjectId(proj._id);
        setFormProject({
            name: proj.name || '',
            description: proj.description || '',
            tech: (proj.tech || []).join(', '),
            image: proj.image || '',
            link: proj.link || '',
            type: proj.type || 'Web Application'
        });
        setIsFormOpen(true);
    };

    const handleNewProjectClick = () => {
        setEditingProjectId(null);
        setFormProject({
            name: '',
            description: '',
            tech: '',
            image: '',
            link: '',
            type: 'Web Application'
        });
        setIsFormOpen(true);
    };

    // --- RENDER PORTAL ---

    if (!token) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center py-12 px-6 overflow-hidden relative font-sans">
                {/* Cybersecurity grid ambient background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

                <div className="max-w-md w-full z-10 bg-black/60 border border-red-500/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.05)] backdrop-blur-md">
                    <div className="text-center mb-8">
                        <div className="text-red-500 font-mono text-xs tracking-[0.4em] uppercase font-bold mb-2">
                            [ System Decryption Required ]
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 uppercase">
                            Admin Login
                        </h1>
                        <p className="text-gray-500 text-xs font-mono uppercase tracking-wider">
                            Authorized personnel only
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:bg-white/10 focus:border-red-500/50 focus:shadow-[0_0_15px_rgba(239,68,68,0.15)] placeholder-gray-600 font-mono"
                                placeholder="Username"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:bg-white/10 focus:border-red-500/50 focus:shadow-[0_0_15px_rgba(239,68,68,0.15)] placeholder-gray-600 font-mono"
                                placeholder="Security Key"
                            />
                        </div>

                        {loginError && (
                            <div className="text-red-400 font-mono text-xs border border-red-500/30 bg-red-500/5 px-4 py-2.5 rounded-lg text-center uppercase tracking-wider">
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-500 text-white text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
                        >
                            <span>{isLoading ? 'DECRYPTING...' : 'DECRYPT SYSTEM'}</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => onNavigate('/')}
                            className="text-gray-500 hover:text-red-400 transition-colors text-xs font-mono uppercase tracking-[0.15em] cursor-pointer"
                        >
                            ← Return to Portfolio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030303] text-gray-300 font-sans relative flex flex-col">
            {/* Cybergrid ambient */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}
            />

            {/* Dashboard Header */}
            <header className="bg-black/80 border-b border-white/5 backdrop-blur px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
                <div className="flex items-center space-x-4">
                    <span className="text-red-500 font-mono text-lg font-bold tracking-[0.25em] uppercase">
                        [ Admin Hub ]
                    </span>
                    <span className="hidden md:inline text-xs font-mono text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        Secure Connection Enabled
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => onNavigate('/')}
                        className="text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-white px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
                    >
                        Visit Website
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-xs uppercase tracking-wider font-bold text-red-500 hover:text-white px-4 py-2 bg-red-950/10 border border-red-500/20 hover:border-red-500 rounded-lg transition-colors cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Console Layout */}
            <main className="flex-1 max-w-[90rem] w-full mx-auto p-6 relative z-10">
                {/* Console tabs */}
                <div className="flex border-b border-white/5 mb-8">
                    <button
                        onClick={() => { setActiveTab('projects'); setDashboardError(''); }}
                        className={`px-6 py-3 font-mono text-sm tracking-wider uppercase border-b-2 font-bold cursor-pointer transition-all ${
                            activeTab === 'projects' 
                                ? 'border-red-500 text-white' 
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        / Projects List
                    </button>
                    <button
                        onClick={() => { setActiveTab('messages'); setDashboardError(''); }}
                        className={`px-6 py-3 font-mono text-sm tracking-wider uppercase border-b-2 font-bold cursor-pointer transition-all ${
                            activeTab === 'messages' 
                                ? 'border-red-500 text-white' 
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        / Contact Inbox ({messages.length})
                    </button>
                </div>

                {dashboardError && (
                    <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5 text-red-400 font-mono text-xs rounded-xl uppercase tracking-wider">
                        [ ERROR ]: {dashboardError}
                    </div>
                )}

                {/* Tab: PROJECTS */}
                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                                Dynamic Portfolio Projects
                            </h2>
                            <button
                                onClick={handleNewProjectClick}
                                className="bg-red-600 hover:bg-red-500 text-white text-xs uppercase tracking-wider font-bold px-5 py-3 rounded-lg border border-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                            >
                                + Add Project Dossier
                            </button>
                        </div>

                        {/* Projects GRID/Table */}
                        {projects.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl">
                                <p className="text-gray-500 font-mono text-sm uppercase">No dynamic projects found in database. Seed data or create a project dossier.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((proj) => (
                                    <div key={proj._id} className="bg-black/40 border border-white/10 p-6 rounded-2xl flex flex-col h-full hover:border-red-500/30 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-mono text-xs text-red-500 font-bold uppercase">
                                                ID: {proj.id}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                                                {proj.type}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 truncate">
                                            {proj.name}
                                        </h3>
                                        <p className="text-gray-400 text-xs line-clamp-3 mb-4 leading-relaxed flex-1">
                                            {proj.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {proj.tech.slice(0, 4).map((tool) => (
                                                <span key={tool} className="text-[9px] uppercase tracking-wider px-2 py-0.5 border border-white/10 bg-white/5 text-gray-400 rounded-full font-medium">
                                                    {tool}
                                                </span>
                                            ))}
                                            {proj.tech.length > 4 && (
                                                <span className="text-[9px] uppercase px-2 py-0.5 text-gray-500 font-mono font-medium">
                                                    +{proj.tech.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => handleEditProjectClick(proj)}
                                                className="flex-1 text-xs uppercase tracking-wider font-bold py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer text-center"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProject(proj._id)}
                                                className="flex-1 text-xs uppercase tracking-wider font-bold py-2 bg-red-950/10 hover:bg-red-900/30 border border-red-500/20 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer text-center"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: INBOX MESSAGES */}
                {activeTab === 'messages' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
                            Encrypted Visitor Logs ({messages.length})
                        </h2>

                        {messages.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl">
                                <p className="text-gray-500 font-mono text-sm uppercase">Inbox empty. No visitor inquiries received yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-w-4xl">
                                {messages.map((msg) => (
                                    <div key={msg._id} className="bg-black/40 border border-white/5 hover:border-red-500/10 p-6 rounded-2xl relative transition-all duration-300 group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                            <div>
                                                <h3 className="text-white font-bold text-base font-sans">
                                                    {msg.name}
                                                </h3>
                                                <a 
                                                    href={`mailto:${msg.email}`} 
                                                    className="text-red-400/80 hover:text-red-400 font-mono text-xs hover:underline"
                                                >
                                                    {msg.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {new Date(msg.createdAt).toLocaleString()}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteMessage(msg._id)}
                                                    className="bg-red-950/20 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white p-2 rounded-lg transition-all cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100"
                                                    title="Delete message"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                                            {msg.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Project Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
                        <div className="border-b border-white/10 p-6 flex justify-between items-center bg-black">
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                                {editingProjectId ? `Edit Project Dossier: ${formProject.name}` : '/ Register New Project'}
                            </h3>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer font-mono font-bold"
                            >
                                [ ESC ]
                            </button>
                        </div>

                        <form onSubmit={handleProjectFormSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Project Name *</label>
                                    <input
                                        type="text"
                                        value={formProject.name}
                                        onChange={(e) => setFormProject({...formProject, name: e.target.value})}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500/50"
                                        placeholder="e.g. CartivoShop"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Category/Type *</label>
                                    <input
                                        type="text"
                                        value={formProject.type}
                                        onChange={(e) => setFormProject({...formProject, type: e.target.value})}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500/50"
                                        placeholder="e.g. Full-Stack E-Commerce"
                                    />
                                </div>
                            </div>



                            {/* Row 3 URLs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Live URL *</label>
                                    <input
                                        type="url"
                                        value={formProject.link}
                                        onChange={(e) => setFormProject({...formProject, link: e.target.value})}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500/50"
                                        placeholder="e.g. https://cartivoshop.vercel.app"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Image Link / Asset Key</label>
                                    <input
                                        type="text"
                                        value={formProject.image}
                                        onChange={(e) => setFormProject({...formProject, image: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500/50"
                                        placeholder="e.g. https://images.com/myimg.png or local ID map"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Overview Description *</label>
                                <textarea
                                    value={formProject.description}
                                    onChange={(e) => setFormProject({...formProject, description: e.target.value})}
                                    required
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500/50 resize-none"
                                    placeholder="Brief overview summary displayed on portfolio grid card..."
                                />
                            </div>

                            {/* Tech Stack comma sep */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-wider text-gray-500">Technology Stack Overview (Comma separated) *</label>
                                <input
                                    type="text"
                                    value={formProject.tech}
                                    onChange={(e) => setFormProject({...formProject, tech: e.target.value})}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500/50"
                                    placeholder="e.g. React JS, Node JS, Express JS, PostgreSQL, Tailwind CSS"
                                />
                            </div>



                            {/* Buttons */}
                            <div className="flex items-center space-x-3 pt-6 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="flex-1 text-xs uppercase tracking-wider font-bold py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs uppercase tracking-wider font-bold py-4 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all cursor-pointer text-center"
                                >
                                    {isLoading ? 'SAVING...' : 'SAVE RECORD'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
