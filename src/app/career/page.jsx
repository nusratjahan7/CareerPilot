"use client"
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import CareerCard from '@/components/career/CareerCard';

const Career = () => {
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedLevel, setSelectedLevel] = useState('All Experience Levels');
    const [selectedLocation, setSelectedLocation] = useState('All Locations'); 

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                setLoading(true);
                const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

                const response = await fetch(`${baseURL}/api/careers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch career directory data');
                }

                const resData = await response.json();

                if (resData && Array.isArray(resData.data)) {
                    setCareers(resData.data);
                } else if (Array.isArray(resData)) {
                    setCareers(resData);
                } else {
                    setCareers([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCareers();
    }, []);

const filteredCareers = careers.filter((item) => {
   
    if (!item) return false;

  
    const matchesSearch =
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
        selectedCategory === 'All Categories' ||
        item.category === selectedCategory;

    const matchesLevel =
        selectedLevel === 'All Experience Levels' ||
        item.experienceLevel === selectedLevel;

    const matchesLocation =
        selectedLocation === 'All Locations' ||
        item.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLevel && matchesLocation;
});

    
const categories = ['All Categories', ...new Set(careers.map(c => c && c.category ? c.category.trim() : null).filter(Boolean))];
const levels = ['All Experience Levels', ...new Set(careers.map(c => c && c.experienceLevel ? c.experienceLevel.trim() : null).filter(Boolean))];
const locations = ['All Locations', ...new Set(careers.map(c => c && c.location ? c.location.trim() : null).filter(Boolean))];

    return (
        <div className="w-full bg-[#f8fafc] dark:bg-[#09090b] min-h-screen">

            {/* Header Hero Section */}
            <div className="bg-white dark:bg-[#121214] border-b border-gray-100 dark:border-[#222226] py-10 px-6 md:px-12">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Explore Careers
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
                            Discover career paths matched to your ambitions
                        </p>
                    </div>

                    {/* Integrated Search Container */}
                    <div className="max-w-xl relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search careers, skills, or locations..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Directory Layout */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">

                {/* Global Filters bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300 mr-1">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filter:</span>
                        </div>

                        {/* Category Select */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-[#121214] border border-gray-200 dark:border-[#222226] rounded-full focus:outline-none focus:border-blue-500 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>

                        {/* Experience Level Select */}
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-[#121214] border border-gray-200 dark:border-[#222226] rounded-full focus:outline-none focus:border-blue-500 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                            {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>

                       
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-[#121214] border border-gray-200 dark:border-[#222226] rounded-full focus:outline-none focus:border-blue-500 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                </div>

                {/* Loading State UI */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm text-gray-500 font-medium">Loading catalog paths...</p>
                    </div>
                )}

                {/* Error Banner State */}
                {error && !loading && (
                    <div className="p-4 rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                        {error}. Please check if your backend API is online.
                    </div>
                )}

                {/* Directory Content Results */}
                {!loading && !error && (
                    <>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                            {filteredCareers.length} {filteredCareers.length === 1 ? 'career' : 'careers'} found
                        </div>

                        {filteredCareers.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 border border-dashed rounded-2xl border-gray-200 dark:border-[#222226]">
                                No career fields found matching your criteria.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredCareers.map((item) => (
                                    <CareerCard key={item._id || item.id} career={item} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Career;