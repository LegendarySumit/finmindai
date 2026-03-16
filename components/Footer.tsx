'use client';

import { Rocket, Linkedin, Twitter, Github, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-finance-darker border-t border-finance-border pt-10 sm:pt-14 md:pt-18 lg:pt-20 pb-6 sm:pb-8 md:pb-10">
            <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                    {/* Brand Section */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-2">
                            <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-finance-gold" />
                            <div className="flex flex-col">
                                <span className="text-lg sm:text-xl font-bold text-finance-gold">
                                    FinMindAI
                                </span>
                                <span className="text-[8px] text-finance-gold/60 uppercase tracking-widest -mt-1">
                                    Financial Intelligence
                                </span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Empowering elite strategists with institutional-grade AI intelligence and comprehensive market education.
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <a href="https://twitter.com/finmindai" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-finance-card flex items-center justify-center text-slate-400 hover:bg-finance-gold hover:text-slate-900 transition-all border border-finance-border hover:border-finance-gold">
                                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                            <a href="https://www.linkedin.com/company/finmindai" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-finance-card flex items-center justify-center text-slate-400 hover:bg-finance-gold hover:text-slate-900 transition-all border border-finance-border hover:border-finance-gold">
                                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                            <a href="https://github.com/finmindai" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-finance-card flex items-center justify-center text-slate-400 hover:bg-finance-gold hover:text-slate-900 transition-all border border-finance-border hover:border-finance-gold">
                                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="text-white font-bold mb-3 sm:mb-4 text-xs sm:text-sm md:text-base uppercase tracking-wider">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link href="/#learning-hub" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">Learning Hub</Link></li>
                            <li><Link href="/#war-room" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">War Room</Link></li>
                            <li><Link href="/market-intelligence" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">News Intel</Link></li>
                            <li><Link href="/#dashboard" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">Dashboard</Link></li>
                            <li><Link href="/#community" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">Community</Link></li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Intelligence</h4>
                        <ul className="space-y-3">
                            <li><Link href="/documentation" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">API Documentation</Link></li>
                            <li><Link href="/research" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">Research Reports</Link></li>
                            <li><Link href="/guides" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">Strategy Guides</Link></li>
                            <li><Link href="/blog" className="text-slate-400 hover:text-finance-gold transition-colors text-sm">Industry News</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Command HQ</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-slate-400 text-sm">
                                <MapPin className="w-4 h-4 text-finance-gold" />
                                <a href="https://maps.google.com/?q=San+Francisco,CA" target="_blank" rel="noopener noreferrer" className="hover:text-finance-gold transition-colors">San Francisco, CA</a>
                            </li>
                            <li className="flex items-center gap-2 text-slate-400 text-sm">
                                <Phone className="w-4 h-4 text-finance-gold" />
                                <a href="tel:+15551234567" className="hover:text-finance-gold transition-colors">+1 (555) 123-4567</a>
                            </li>
                            <li className="flex items-center gap-2 text-slate-400 text-sm">
                                <Mail className="w-4 h-4 text-finance-gold" />
                                <a href="mailto:hello@finmindai.com" className="hover:text-finance-gold transition-colors">hello@finmindai.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 border-t border-finance-border flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                    <p className="text-slate-500 text-xs sm:text-sm text-center md:text-left">
                        © 2026 FinMindAI. All rights reserved. | <span className="text-finance-gold/70">MISSION: DOMINATE MARKETS</span>
                    </p>
                    <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center">
                        <Link href="/privacy" className="text-slate-500 hover:text-finance-gold transition-colors text-xs sm:text-sm">Privacy Policy</Link>
                        <Link href="/terms" className="text-slate-500 hover:text-finance-gold transition-colors text-xs sm:text-sm">Terms of Service</Link>
                        <Link href="/cookies" className="text-slate-500 hover:text-finance-gold transition-colors text-xs sm:text-sm">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
