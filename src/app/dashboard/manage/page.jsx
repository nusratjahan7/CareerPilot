"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Trash2 } from 'lucide-react';
const Manage = () => {
    const router = useRouter();
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const { data: sessionData, isPending } = authClient.useSession();
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchCareers = async () => {

        if (isPending) return;
        if (!sessionData?.user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);


            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            const response = await fetch(`${baseURL}/api/my-careers`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                }
            });

            if (!response.ok) throw new Error('Failed to fetch careers');
            const result = await response.json();


            if (result.success && Array.isArray(result.data)) {
                setCareers(result.data);
            } else {
                setCareers([]);
            }
        } catch (err) {
            console.error(err);
            toast.error('Could not load career listings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCareers();
    }, [baseURL, sessionData, isPending]);


    const handleDelete = (careerId) => {
        toast.dismiss();


        toast.custom((t) => (
            <div className="bg-[#1e293b] border border-slate-800 p-4 rounded-xl shadow-2xl text-slate-200 max-w-sm w-full font-sans">
                <h3 className="font-bold text-base text-white mb-1">Delete Career Listing?</h3>
                <p className="text-xs text-slate-400 mb-4">Are you sure you want to delete this listing? This action cannot be undone.</p>

                <div className="flex items-center justify-end gap-2 text-xs">

                    <button
                        onClick={() => toast.dismiss(t)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors"
                    >
                        Cancel
                    </button>


                    <button
                        onClick={async () => {
                            toast.dismiss(t);
                            executeDelete(careerId);
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center'
        });
    };


    const executeDelete = async (careerId) => {
        const deletePromise = new Promise(async (resolve, reject) => {
            try {
                const tokenResponse = await authClient.token();
                const token = tokenResponse?.data?.token;

                const res = await fetch(`${baseURL}/api/careers/${careerId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` })
                    }
                });
                const data = await res.json();

                if (!res.ok) {
                    return reject(data.error || 'Failed to delete');
                }

                setCareers(prev => prev.filter(c => c._id !== careerId));
                resolve(data);
            } catch (err) {
                reject(err.message || 'Network error');
            }
        });

        toast.promise(deletePromise, {
            loading: 'Deleting career listing...',
            success: 'Career listing deleted successfully! 🗑️',
            error: (err) => err,
        });
    };

    const getCategoryStyles = (category) => {
        const cat = category?.toLowerCase();
        if (cat === 'technology') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (cat === 'design') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        if (cat === 'business' || cat === 'marketing') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        if (cat === 'healthcare') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };


    if (!isPending && !sessionData?.user) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-[#f1f5f9]">
                <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 text-center max-w-md">
                    <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                    <p className="text-slate-400 text-sm mb-4">Please log in to manage your contributed career listings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  p-6 md:p-12 font-sans text-[#f1f5f9] antialiased">

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Manage Careers</h1>
                        <p className="text-slate-400 text-sm md:text-base mt-1">Review and manage all career listings</p>
                    </div>
                    <div className="text-sm font-semibold text-slate-400 self-end sm:self-center bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-800">
                        {careers.length} listings
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-12 text-center text-slate-400 font-medium shadow-sm">
                        <p className="animate-pulse">Loading listings...</p>
                    </div>
                ) : careers.length === 0 ? (
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-12 text-center text-slate-500 font-medium shadow-sm">
                        <p>No career listings found. Post a career to get started!</p>
                    </div>
                ) : (
                    /* Table Container */
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-lg overflow-hidden overflow-x-auto">
                        <table className="w-full border-collapse text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/50">
                                    <th className="py-4 px-6">Career</th>
                                    <th className="py-4 px-6">Category</th>
                                    <th className="py-4 px-6">Salary</th>
                                    <th className="py-4 px-6">Date Added</th>
                                    <th className="py-4 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm">
                                {careers.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-800/50 transition-colors">
                                        {/* Career Info */}
                                        <td className="py-4 px-6 flex items-center gap-4">
                                            <img
                                                src={item.coverImage}
                                                alt={item.title}
                                                className="w-11 h-11 rounded-full object-cover border border-slate-700 shrink-0"
                                            />
                                            <div>
                                                <div className="font-bold text-white text-base">{item.title}</div>
                                                <div className="text-slate-400 text-xs mt-0.5 capitalize">{item.experienceLevel || 'Entry-level'}</div>
                                            </div>
                                        </td>

                                        {/* Category Badge */}
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryStyles(item.category)}`}>
                                                {item.category || 'General'}
                                            </span>
                                        </td>

                                        {/* Salary Range */}
                                        <td className="py-4 px-6 font-medium text-slate-200">
                                            {item.salaryRange || '$80,000 – $140,000'}
                                        </td>

                                        {/* Date Added */}
                                        <td className="py-4 px-6 text-slate-400">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            }) : new Date().toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </td>

                                        {/* Action Buttons */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-3">
                                                {/* View Detail Button */}
                                                <button
                                                    onClick={() => router.push(`/career/${item._id}`)}
                                                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                </button>

                                                {/* Clean Fixed Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Listing"
                                                >
                                                    <Trash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Manage;