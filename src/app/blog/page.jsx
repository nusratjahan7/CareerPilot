"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

const ALL_POSTS = [
    {
        _id: "1",
        title: "The Future of Web Development: Next.js 16 and Beyond",
        excerpt: "Explore the upcoming features in modern frontend framework ecosystems, focusing on server components, edge rendering, and AI integration.",
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
        category: "Tech",
        author: "Anik Rahman",
        date: "July 15, 2026",
        featured: true
    },
    {
        _id: "2",
        title: "Mastering Tailwind CSS for High-Fidelity Micro-interactions",
        excerpt: "How to use Tailwind utility classes combined with CSS variables to create smooth, application-like interactions without heavy JS.",
        coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600",
        category: "Design",
        author: "Sarah Smith",
        date: "July 12, 2026",
        featured: false
    },
    {
        _id: "3",
        title: "How to Land Your First Remote Front-End Developer Role",
        excerpt: "A comprehensive roadmap covering portfolio structure, essential open-source contributions, and tackling async interviews.",
        coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600",
        category: "Career",
        author: "Tanvir Hasan",
        date: "July 10, 2026",
        featured: false
    },
    {
        _id: "4",
        title: "Building Scalable Real-time Apps with Node.js and WebSockets",
        excerpt: "A deep dive into architecture synchronization, handling horizontal scaling, and managing redis adapter connection states.",
        coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600",
        category: "Tech",
        author: "Rayan Ahmed",
        date: "July 05, 2026",
        featured: false
    }
];

const CATEGORIES = ["All", "Tech", "Design", "Career"];

const Blog = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const featuredPost = ALL_POSTS.find(post => post.featured);


    const filteredPosts = ALL_POSTS.filter(post => {
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-black min-h-screen text-white py-12 px-5">
            <div className="max-w-7xl mx-auto">


                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-blue-500 font-semibold tracking-wider text-xs uppercase bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                        TechWave Insights
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 mb-3">
                        Stories & Technical Knowledge
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Deep dives into modern frameworks, frontend engineering architecture, and remote career strategies.
                    </p>
                </div>


                {featuredPost && searchQuery === "" && selectedCategory === "All" && (
                    <div className="group bg-[#151515] border border-gray-800 rounded-3xl overflow-hidden grid lg:grid-cols-2 gap-8 mb-16 hover:border-gray-700 transition-all duration-300">
                        <div className="relative h-64 lg:h-full bg-gray-900 overflow-hidden">
                            <img
                                src={featuredPost.coverImage}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                            />
                            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                                Featured Post
                            </span>
                        </div>
                        <div className="p-6 md:p-10 flex flex-col justify-center">
                            <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">{featuredPost.category}</span>
                            <h2 className="text-2xl md:text-4xl font-bold mt-2 mb-4 group-hover:text-blue-400 transition-colors duration-200 leading-tight">
                                {featuredPost.title}
                            </h2>
                            <p className="text-gray-400 text-sm md:text-base mb-6 line-clamp-3">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-800/60">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><User size={12} /> {featuredPost.author}</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {featuredPost.date}</span>
                                </div>
                                <Link href={`/blog/${featuredPost._id}`} className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-black px-4 py-2 rounded-xl hover:bg-gray-200 transition-all">
                                    Read Article <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}


                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-gray-900 pb-6">

                    <div className="flex flex-wrap gap-2 order-2 md:order-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${selectedCategory === cat
                                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                    : "bg-[#151515] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>


                    <div className="relative order-1 md:order-2 w-full md:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#151515] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>


                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-[#111] rounded-2xl border border-gray-900">
                        <p className="text-gray-500 text-sm">No articles matched your criteria.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <div
                                key={post._id}
                                className="group bg-[#151515] border border-gray-800/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gray-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1"
                            >
                                <div className="h-48 bg-gray-900 overflow-hidden relative">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90"
                                    />
                                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded border border-white/5 text-blue-400">
                                        {post.category}
                                    </span>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-800/60 flex items-center justify-between">
                                        <div className="flex flex-col gap-0.5 text-[10px] text-gray-500">
                                            <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
                                            <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                                        </div>

                                        <Link
                                            href={`/blog/${post._id}`}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gray-800 group-hover:bg-blue-600 px-3.5 py-2 rounded-lg transition-all"
                                        >
                                            Read
                                            <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                <div className="mt-24 bg-gradient-to-r from-[#111] via-[#16161c] to-[#111] border border-gray-800 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Keep Up to Date</h2>
                    <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto mb-6">
                        Join our engineering mailing list to receive modular articles, design tokens, and hot remote job signals.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                        <button type="submit" className="bg-white text-black font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-all shrink-0">
                            Subscribe
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Blog;