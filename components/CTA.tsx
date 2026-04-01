'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';

const CTA = () => {
    const handleLaunchPlatform = () => {
        window.location.hash = '#dashboard';
    };

    return (
        <section className="py-10 sm:py-14 md:py-20 lg:py-24 bg-finance-darker relative overflow-hidden px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
            {/* Background effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-120 sm:w-160 h-52 sm:h-96 bg-finance-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 sm:w-125 h-80 sm:h-125 bg-emerald-500/5 rounded-full blur-3xl" />
            
            <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 relative">
                <motion.div
                    className="text-center space-y-6 sm:space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-finance-gold/10 border border-finance-gold/20 rounded-full">
                        <Rocket className="w-4 h-4 text-finance-gold" />
                        <span className="text-xs sm:text-sm text-finance-gold font-bold uppercase tracking-wider">Deploy Your Strategy</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Ready to Dominate{' '}
                        <span className="text-finance-gold glow-gold">
                            Financial Markets?
                        </span>
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto">
                        Join elite strategists mastering markets with institutional-grade AI intelligence and real-time analytics.
                    </p>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <button onClick={handleLaunchPlatform} className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-finance-gold hover:bg-finance-gold-bright rounded-xl text-slate-900 font-bold text-sm sm:text-base lg:text-lg transition-all hover:shadow-lg hover:shadow-finance-gold/50 uppercase tracking-wide cursor-pointer">
                            Launch Platform
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-5 sm:gap-8 md:gap-12 text-sm text-slate-400 pt-4 sm:pt-6 flex-wrap">
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-finance-gold">50K+</p>
                            <p className="text-xs uppercase tracking-wider">Elite Members</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-finance-gold">1M+</p>
                            <p className="text-xs uppercase tracking-wider">Battle-Tested Predictions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-finance-gold">98%</p>
                            <p className="text-xs uppercase tracking-wider">Mission Success Rate</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
