"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CareerCard from "@/components/career/CareerCard";

const FeaturedCareers = () => {
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCareers = async () => {
            try {

                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/careers`);
                const data = await res.json();

                if (data.success) {

                    const latestFour = data.data.reverse().slice(0, 4);
                    setCareers(latestFour);
                }
            } catch (err) {
                console.error("Error fetching featured careers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCareers();
    }, []);

    return (
        <section className="relative py-20 px-5 border-t border-gray-900">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-600/5 via-transparent to-blue-600/5 dark:from-blue-600/10 dark:to-blue-600/10" />
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-blue-500 font-semibold tracking-wider text-xs uppercase bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                            Explore Opportunities
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3">
                            Featured Career Openings
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm md:text-base max-w-xl">
                            Discover high-impact roles tailored to your skillset. Propel your career forward with TechWave.
                        </p>
                    </div>

                    <Link
                        href="/career"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors self-start md:self-end"
                    >
                        View All Careers
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>


                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="bg-[#151515] rounded-2xl h-80 border border-gray-900 animate-pulse">
                                <div className="bg-gray-800 h-40 w-full rounded-t-2xl"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-gray-800 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                                    <div className="h-8 bg-gray-800 rounded w-full mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : careers.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No recent career openings found.</p>
                ) : (

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {careers.map((career) => (
                            <CareerCard key={career._id} career={career} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCareers;