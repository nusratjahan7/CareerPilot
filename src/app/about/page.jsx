"use client";

import React from 'react';
import Link from 'next/link';
import { Target, Rocket, ShieldCheck, ArrowRight, Radio } from 'lucide-react';

const About = () => {

    const stats = [
        { label: "Active Listeners", value: "50K+" },
        { label: "Career Openings", value: "1.2K+" },
        { label: "Tech Guests", value: "150+" },
        { label: "Success Stories", value: "800+" },
    ];


    const coreValues = [
        {
            icon: <Radio className="text-blue-400" size={24} />,
            title: "TechWave Podcast",
            description: "We host weekly deep dives with core maintainers, remote engineering leads, and tech visionaries to decode industry trends."
        },
        {
            icon: <Target className="text-purple-400" size={24} />,
            title: "Curated Career Hub",
            description: "No generic job boards. We filter and showcase high-impact, verified developer opportunities tailored to your skillset."
        },
        {
            icon: <Rocket className="text-emerald-400" size={24} />,
            title: "Skill Acceleration",
            description: "Bridging the gap between theory and high-fidelity product engineering through tech insights and architectural blogs."
        },
        {
            icon: <ShieldCheck className="text-amber-400" size={24} />,
            title: "Verified Ecosystem",
            description: "Every role, advice, and article passes through technical evaluation so you can build your career with absolute trust."
        }
    ];

    return (
        <div className="bg-black min-h-screen text-white py-16 px-5 selection:bg-blue-500/30">
            <div className="max-w-6xl mx-auto">


                <div className="grid lg:grid-cols-12 gap-8 items-center mb-24">
                    <div className="lg:col-span-7 space-y-5">
                        <span className="text-blue-500 font-semibold tracking-wider text-xs uppercase bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 inline-block">
                            Our Journey
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">Tech Knowledge</span> Meets Career Opportunities.
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl">
                            TechWave started with a simple belief: developers shouldn't have to navigate their careers in the dark. We combined a high-signal tech podcast with a curated career ecosystem to help engineers scale their skills and land impactful global roles.
                        </p>
                    </div>


                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-[#151515] border border-gray-800/60 p-6 rounded-2xl hover:border-gray-700 transition-all text-center">
                                <h3 className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                                <p className="text-gray-500 text-xs mt-1 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-950 mb-20" />


                <div className="mb-24">
                    <div className="text-center max-w-xl mx-auto mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Pillars of Career</h2>
                        <p className="text-gray-400 text-xs md:text-sm mt-2">
                            We are building more than a platform — we are establishing an engine for developer growth.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {coreValues.map((value, idx) => (
                            <div
                                key={idx}
                                className="bg-[#151515] border border-gray-800/80 p-6 md:p-8 rounded-2xl flex gap-5 hover:border-gray-700/80 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <div className="h-12 w-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center shrink-0">
                                    {value.icon}
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-lg font-bold text-white">{value.title}</h3>
                                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="bg-gradient-to-r from-[#111] via-[#16161c] to-[#111] border border-gray-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to ride the wave?</h2>
                        <p className="text-gray-400 text-xs md:text-sm max-w-md">
                            Tune into our latest podcast episode or browse curated careers waiting for your expertise.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                        <Link
                            href="/careers"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-white text-black px-5 py-3 rounded-xl hover:bg-gray-200 transition-all text-center"
                        >
                            Explore Careers <ArrowRight size={14} />
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;