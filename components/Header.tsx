'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, LineChart, BookOpen, Newspaper, Users, Wallet, LayoutDashboard, Compass, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [scrolledSection, setScrolledSection] = useState('home');

    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleHashChange = () => {
            if (!isHomePage) return;
            
            const hash = window.location.hash.slice(1);
            if (hash === 'dashboard') {
                setActiveSection('dashboard');
            } else if (hash === 'war-room') {
                setActiveSection('war-room');
            } else if (hash === 'learning-hub') {
                setActiveSection('learning-hub');
            } else if (hash === 'community') {
                setActiveSection('community');
            } else {
                setActiveSection('home');
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [isHomePage]);

    // Track scroll position to highlight active section
    useEffect(() => {
        if (!isHomePage || activeSection !== 'home') return; 

        const handleScroll = () => {
            const sections = ['learning', 'playground', 'news'];
            const scrollPosition = window.scrollY + 100; // Offset for header

            // Check if we're at the top (hero section)
            if (window.scrollY < 300) {
                setScrolledSection('home');
                return;
            }

            // Check each section
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = window.scrollY + rect.top;
                    const elementBottom = elementTop + element.offsetHeight;

                    if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                        setScrolledSection(sectionId);
                        return;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection, isHomePage]);

    const exploreLinks = [
        { name: 'Learning Hub', href: '#learning-hub', Icon: BookOpen },
        { name: 'War Room Analysis', href: '#war-room', Icon: LineChart },
        { name: 'Community', href: '#community', Icon: Users },
    ];

    const navigateToHashSection = (hash: string) => {
        window.location.assign(`/${hash}`);
        setExploreDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <header className="fixed w-full z-50 bg-finance-dark/95 backdrop-blur-md border-b border-finance-border shadow-lg">
            <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
                <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
                    {/* Logo */}
                    <motion.a
                        href="#home"
                        className="flex items-center gap-1 sm:gap-1.5 md:gap-2 cursor-pointer min-w-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Rocket className="w-5 sm:w-7 md:w-8 h-5 sm:h-7 md:h-8 text-finance-gold shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] sm:text-sm md:text-lg lg:text-xl font-bold bg-linear-to-r from-finance-gold to-finance-gold-bright bg-clip-text text-transparent truncate">
                                FinMindAI
                            </span>
                            <span className="hidden min-[375px]:block text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest -mt-0.5 sm:-mt-0.5 md:-mt-1">Financial Intel</span>
                        </div>
                    </motion.a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
                        {/* Home Link */}
                        <motion.a
                            href="/"
                            className={`flex items-center gap-1.5 lg:gap-2 transition-all ${
                                isHomePage && activeSection === 'home' && scrolledSection === 'home'
                                    ? 'text-finance-gold font-semibold' 
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Rocket className="w-3.5 md:w-4 h-3.5 md:h-4" />
                            <span className="text-xs md:text-sm lg:text-base font-medium">Home</span>
                        </motion.a>

                        {/* Dashboard Link */}
                        <motion.a
                            href="/#dashboard"
                            className={`flex items-center gap-1.5 lg:gap-2 transition-all ${
                                isHomePage && activeSection === 'dashboard'
                                    ? 'text-finance-gold font-semibold' 
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <LayoutDashboard className="w-3.5 md:w-4 h-3.5 md:h-4" />
                            <span className="text-xs md:text-sm lg:text-base font-medium">Dashboard</span>
                        </motion.a>

                        {/* News Intelligence Link */}
                        <motion.a
                            href="/market-intelligence"
                            className={`flex items-center gap-1.5 lg:gap-2 transition-all ${
                                pathname === '/market-intelligence'
                                    ? 'text-finance-gold font-semibold' 
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <Newspaper className="w-3.5 md:w-4 h-3.5 md:h-4" />
                            <span className="text-xs md:text-sm lg:text-base font-medium">News Intel</span>
                        </motion.a>

                        {/* Explore Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setExploreDropdownOpen(true)}
                            onMouseLeave={() => setExploreDropdownOpen(false)}
                        >
                            <motion.button
                                className={`flex items-center gap-1.5 lg:gap-2 transition-all ${
                                    (isHomePage && (activeSection === 'war-room' || (activeSection === 'home' && ['learning', 'playground', 'news', 'community'].includes(scrolledSection)))) || activeSection === 'learning-hub'
                                        ? 'text-finance-gold font-semibold'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Compass className="w-3.5 md:w-4 h-3.5 md:h-4" />
                                <span className="text-xs md:text-sm lg:text-base font-medium">Explore</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${exploreDropdownOpen ? 'rotate-180' : ''}`} />
                            </motion.button>


                            <AnimatePresence>
                                {exploreDropdownOpen && (
                                    <motion.div
                                        className="absolute top-full left-0 mt-2 w-56 sm:w-64 p-2 bg-linear-to-b from-finance-card/95 to-finance-darker/95 border border-finance-border/70 rounded-2xl shadow-2xl shadow-black/40 backdrop-blur-xl"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {exploreLinks.map((link) => {
                                            const Icon = link.Icon;
                                            const sectionId = link.href.replace('#', '');
                                            const isActive = isHomePage && ((activeSection === 'home' && scrolledSection === sectionId) || activeSection === sectionId);
                                            
                                            return (
                                                <button
                                                    type="button"
                                                    key={link.name}
                                                    onClick={() => navigateToHashSection(link.href)}
                                                    className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left transition-all ${
                                                        isActive
                                                            ? 'bg-finance-gold/10 text-finance-gold border border-finance-gold/30'
                                                            : 'text-slate-300 border border-transparent hover:bg-slate-800/50 hover:border-slate-700 hover:text-white'
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span className="text-xs sm:text-sm font-medium">{link.name}</span>
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* Auth Section */}
                    {user ? (
                        <motion.div
                            className="relative"
                            onMouseEnter={() => setUserDropdownOpen(true)}
                            onMouseLeave={() => setUserDropdownOpen(false)}
                        >
                            <button className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-semibold transition-all">
                                <div className="w-5 lg:w-6 h-5 lg:h-6 rounded-full bg-linear-to-r from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-slate-900">
                                    {user.email?.charAt(0) || user.address?.slice(2, 4)}
                                </div>
                                <span className="text-xs md:text-xs lg:text-sm">
                                    {user.email
                                        ? user.email.split('@')[0]
                                        : `${user.address?.slice(0, 6)}...`}
                                </span>
                                <ChevronDown className="w-3 h-3" />
                            </button>

                            <AnimatePresence>
                                {userDropdownOpen && (
                                    <motion.div
                                        className="absolute top-full right-0 mt-2 w-44 md:w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="px-3 md:px-4 py-2 md:py-3 border-b border-slate-700 bg-slate-800/50">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">Account</p>
                                            <p className="text-xs md:text-sm font-semibold text-white mt-1">
                                                {user.email
                                                    ? user.email
                                                    : `${user.address?.slice(0, 10)}...`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setUserDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-xs md:text-sm font-medium">Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.button
                            onClick={() => router.push('/auth')}
                            className="hidden md:flex items-center gap-2 px-3 lg:px-5 py-2 lg:py-2.5 bg-linear-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 rounded-lg text-slate-900 font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all text-xs lg:text-base"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Wallet className="w-4 h-4" />
                            <span className="hidden lg:inline">Connect Wallet</span>
                            <span className="lg:hidden">Connect</span>
                        </motion.button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-1.5 text-slate-300 hover:text-white transition-colors shrink-0"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="md:hidden bg-finance-card border-t border-finance-border max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-3.5rem)] overflow-y-auto"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="px-2 sm:px-3 py-3 sm:py-4 space-y-2 sm:space-y-3">
                            {/* Home Link */}
                            <Link
                                href="/"
                                className={`flex items-center gap-2 sm:gap-3 py-2 transition-colors ${
                                    activeSection === 'home' && scrolledSection === 'home'
                                        ? 'text-finance-gold font-semibold'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Rocket className="w-4 sm:w-5 h-4 sm:h-5" />
                                <span className="font-medium text-xs sm:text-sm">Home</span>
                            </Link>

                            {/* Dashboard Link */}
                            <Link
                                href="/#dashboard"
                                className={`flex items-center gap-2 sm:gap-3 py-2 transition-colors ${
                                    activeSection === 'dashboard'
                                        ? 'text-finance-gold font-semibold'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <LayoutDashboard className="w-4 sm:w-5 h-4 sm:h-5" />
                                <span className="font-medium text-xs sm:text-sm">Dashboard</span>
                            </Link>

                            {/* News Intelligence Link */}
                            <Link
                                href="/market-intelligence"
                                className={`flex items-center gap-2 sm:gap-3 py-2 transition-colors ${
                                    pathname === '/market-intelligence'
                                        ? 'text-finance-gold font-semibold'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Newspaper className="w-4 sm:w-5 h-4 sm:h-5" />
                                <span className="font-medium text-xs sm:text-sm">News Intel</span>
                            </Link>

                            {/* Explore Section */}
                            <div className="border-t border-finance-border pt-2 sm:pt-3">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-2 sm:mb-2.5 text-xs uppercase tracking-wider">
                                    <Compass className="w-4 h-4" />
                                    <span>Explore</span>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2 pl-4 sm:pl-6">
                                    {exploreLinks.map((link) => {
                                        const Icon = link.Icon;
                                        const sectionId = link.href.replace('#', '');
                                        const isActive = (activeSection === 'home' && scrolledSection === sectionId) || activeSection === sectionId;
                                        
                                        return (
                                            <a
                                                key={link.name}
                                                href={`/${link.href}`}
                                                className={`flex items-center gap-2 sm:gap-3 py-2 transition-colors ${
                                                    isActive
                                                        ? 'text-finance-gold font-semibold'
                                                        : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="font-medium text-xs sm:text-sm">{link.name}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                            {user ? (
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-lg mt-3 sm:mt-4 text-xs sm:text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        router.push('/auth');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-amber-400 to-amber-600 text-slate-900 font-bold rounded-lg mt-3 sm:mt-4 text-xs sm:text-sm"
                                >
                                    <Wallet className="w-4 h-4" />
                                    <span className="hidden sm:inline">Connect Wallet</span>
                                    <span className="sm:hidden">Connect</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    );
};

export default Header;
