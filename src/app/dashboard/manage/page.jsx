"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Trash2, Edit, AlertCircle, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast, Toaster } from 'sonner';

export default function ManageCareers() {

    const { data: sessionData, isPending: isSessionPending } = authClient.useSession();

    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        // ১. সেশন ডাটা লোড হওয়া পর্যন্ত অপেক্ষা করবে
        if (isSessionPending) return;

        // ২. সেশন লোড শেষ কিন্তু ইউজার লগইন করা নেই
        if (!sessionData?.user?.id) {
            setLoading(false);
            setStatus({ type: 'error', message: 'Please log in to manage your career listings.' });
            return;
        }

        const fetchUserCareers = async () => {
            try {
                setLoading(true);
                setStatus({ type: '', message: '' });

                const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';


                const response = await fetch(`${baseURL}/api/my-careers?userId=${sessionData.user.id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch your listings.');
                }

                if (data.success) {
                    setCareers(data.data);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                setStatus({ type: 'error', message: error.message });
                toast.error(error.message);
            } finally {

                setLoading(false);
            }
        };

        fetchUserCareers();
    }, [sessionData, isSessionPending]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this career listing?")) return;

        try {
            const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${baseURL}/api/careers/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("Listing deleted successfully! 🗑️");
                setCareers(prev => prev.filter(career => career._id !== id));
            } else {
                throw new Error(data.error || "Could not delete.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    if (isSessionPending || loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                    Loading your career listings...
                </p>
            </div>
        );
    }


    if (status.type === 'error' && careers.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="p-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{status.message}</span>
                </div>
            </div>
        );
    }


    return (
        <div className="max-w-6xl mx-auto px-4 py-8 font-sans text-gray-900 dark:text-gray-100">


            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white">Manage Careers</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Review, update, or remove the career paths you have contributed.
                    </p>
                </div>
                <div className="text-sm bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl font-semibold w-fit">
                    Total Posted: {careers.length}
                </div>
            </div>


            {careers.length === 0 ? (
                <div className="border border-dashed border-gray-200 dark:border-[#222226] rounded-2xl p-12 text-center bg-white dark:bg-[#121214]">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4 stroke-[1.5]" />
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No careers posted yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                        You haven't added any career opportunities to our system. Get started by contributing one!
                    </p>
                </div>
            ) : (
                /* Career Grid Lists */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {careers.map((career) => (
                        <div
                            key={career._id}
                            className="bg-white dark:bg-[#121214] border border-gray-100 dark:border-[#222226] hover:border-gray-200 dark:hover:border-[#2f2f36] shadow-sm rounded-2xl p-6 transition-all flex flex-col justify-between"
                        >
                            <div>
                                {/* Category Badge & Actions */}
                                <div className="flex justify-between items-start gap-2 mb-4">
                                    <span className="bg-gray-100 dark:bg-[#1e1e22] text-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-md">
                                        {career.category}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            title="Edit listing"
                                            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(career._id)}
                                            title="Delete listing"
                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Job Title */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2">
                                    {career.title}
                                </h3>

                                {/* Short Description */}
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    {career.shortDescription}
                                </p>
                            </div>

                            {/* Info Badges Row */}
                            <div className="border-t border-gray-50 dark:border-[#1c1c20] pt-4 mt-auto space-y-2.5">
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="truncate">{career.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <DollarSign className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="truncate">{career.salaryRange}</span>
                                    </div>
                                </div>

                                {/* Metadata Date */}
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                                    <span>
                                        Posted on: {career.createdAt?.$date
                                            ? new Date(career.createdAt.$date).toLocaleDateString()
                                            : new Date(career.createdAt).toLocaleDateString()
                                        }
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}