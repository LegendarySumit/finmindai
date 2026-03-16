'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';
import Features from '@/components/Features';
import StockPlayground from '@/components/StockPlayground';
import WarRoomPreview from '@/components/WarRoomPreview';
import MarketIntelligenceReal from '@/components/MarketIntelligenceReal';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import LearningHub from '@/components/LearningHub';
import Community from '@/components/Community';

const PageContent = () => {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        // Handle hash changes
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1); // Remove the '#'
            
            // Different sections: home, dashboard, war-room
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

        // Set initial section
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeSection]);

    return (
        <>
            {activeSection === 'home' ? (
                <>
                    <Hero />
                    <div id="learning">
                        <Features />
                    </div>
                    <div id="playground">
                        <WarRoomPreview />
                    </div>
                    <div id="news">
                        <MarketIntelligenceReal />
                    </div>
                    <CTA />
                    <Footer />
                </>
            ) : activeSection === 'war-room' ? (
                <>
                    <div className="pt-14 sm:pt-16 md:pt-20 lg:pt-24">
                        <StockPlayground />
                    </div>
                    <Footer />
                </>
            ) : activeSection === 'learning-hub' ? (
                <>
                    <div className="pt-14 sm:pt-16 md:pt-20 lg:pt-24">
                        <LearningHub />
                    </div>
                    <Footer />
                </>
            ) : activeSection === 'community' ? (
                <>
                    <div className="pt-14 sm:pt-16 md:pt-20 lg:pt-24">
                        <Community />
                    </div>
                    <Footer/>
                </>
            ) : (
                <>
                    <Dashboard />
                    <Footer />
                </>
            )}
        </>
    );
};

export default PageContent;
