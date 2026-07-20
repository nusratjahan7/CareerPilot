"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { getAuthHeaders } from '@/lib/api-auth';

const Details = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const userId = session?.user?.id || session?.user?._id || null;

    const [career, setCareer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', resumeUrl: '', coverLetter: '' });
    const [submitting, setSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (!sessionLoading && !userId) {
            router.push(`/login?redirect=/careers/${id}`);
        }
    }, [sessionLoading, userId, id, router]);

    useEffect(() => {
        const fetchCareerDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${baseURL}/api/careers/${id}`, {
                    headers: await getAuthHeaders(),
                });
                if (!response.ok) {
                    throw new Error('Career details not found or Server Error');
                }

                const resData = await response.json();
                const data = resData.data ? resData.data : resData;

                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid data format received from server');
                }

                setCareer({
                    ...data,
                    responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
                    skills: Array.isArray(data.skills) ? data.skills : []
                });
            } catch (err) {
                console.error("Frontend Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCareerDetails();
        }
    }, [id, baseURL]);


    const handleSaveCareer = async () => {

        if (!userId) {
            toast.error("Please login to save this career!");
            return;
        }

        if (isSaved) {
            setIsSaved(false);
            toast.dismiss();
            toast.success('Removed from saved careers!', {
                description: 'This role has been removed from your list.'
            });
            return;
        }

        const savePromise = new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseURL}/api/saved-careers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(await getAuthHeaders()),
                    },

                    body: JSON.stringify({ careerId: id, userId: userId }),
                });

                const data = await res.json();
                if (!res.ok) {
                    return reject(data.error || 'Failed to save');
                }

                setIsSaved(true);
                resolve(data);
            } catch (err) {
                reject(err.message || 'Network error occurred');
            }
        });

        toast.promise(savePromise, {
            loading: 'Saving career...',
            success: 'Career successfully saved! 🔖',
            error: (err) => err,
        });
    };


    const handleApplySubmit = async (e) => {
        e.preventDefault();


        const currentUserId = session?.user?.id || session?.user?._id || session?.session?.userId;

        console.log("Checking session object:", session);
        console.log("Submitting with User ID:", currentUserId);

        if (!currentUserId) {
            toast.error("You must be logged in to apply! Your session was not found.");
            return;
        }

        setSubmitting(true);

        const submitPromise = new Promise(async (resolve, reject) => {
            try {
                const bodyData = {
                    careerId: id,
                    userId: currentUserId,
                    fullName: formData.fullName,
                    email: formData.email,
                    resumeUrl: formData.resumeUrl,
                    coverLetter: formData.coverLetter || ""
                };

                console.log("Sending payload to backend:", bodyData);

                const response = await fetch(`${baseURL}/api/applications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(await getAuthHeaders()),
                    },
                    body: JSON.stringify(bodyData),
                });

                const data = await response.json();
                if (!response.ok) {
                    return reject(data.error || 'Failed to submit');
                }
                setIsModalOpen(false);
                setFormData({ fullName: '', email: '', resumeUrl: '', coverLetter: '' });
                resolve(data);
            } catch (err) {
                reject(err.message || 'Network error occurred');
            }
        });

        toast.promise(submitPromise, {
            loading: 'Submitting your application...',
            success: 'Application successfully processed! 🎉',
            error: (err) => err,
        });

        submitPromise.finally(() => {
            setSubmitting(false);
        });
    };

    if (loading || sessionLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#0f172a] text-slate-400">
                <p className="text-xl animate-pulse font-medium">Loading career insights...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f172a] p-6">
                <p className="text-red-400 text-xl mb-4 font-semibold">Error: {error}</p>
                <button onClick={() => router.back()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Go Back
                </button>
            </div>
        );
    }

    if (!career) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
                <p className="text-xl text-slate-500">No career details found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] font-sans antialiased pb-12">


            {/* Banner Section */}
            <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 bg-cover bg-center h-[340px] flex items-end text-white pb-8 px-6 md:px-16" style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1200')" }}>
                <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white mb-4 transition">
                            <span>←</span> Back to Explore
                        </button>
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                            {career.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight md:pb-10 text-white">{career.title}</h1>
                    </div>

                    <div className="flex items-center pb-8 md:pb-0 gap-4">
                        <button
                            onClick={handleSaveCareer}
                            className={`px-6 py-3 font-semibold rounded-full transition shadow-sm border text-sm ${isSaved
                                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
                                }`}
                        >
                            {isSaved ? 'Saved' : 'Save Career'}
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="px-7 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-md text-sm">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Body */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-[-30px] relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 md:p-8 shadow-sm grid grid-cols-3 text-center divide-x divide-slate-800">
                        <div>
                            <span className="text-xs font-medium text-slate-400 block mb-1">Salary Range</span>
                            <span className="text-base md:text-xl font-bold text-slate-200">{career.salaryRange || '$80,000 – $140,000'}</span>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-slate-400 block mb-1">Growth Rate</span>
                            <span className="text-base md:text-xl font-bold text-emerald-400">+18%/yr</span>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-slate-400 block mb-1">Experience</span>
                            <span className="text-base md:text-xl font-bold text-slate-200 capitalize">{career.experienceLevel || 'Entry-level'}</span>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 md:p-8 shadow-sm">
                        <div className="flex gap-2 p-1 bg-slate-900 rounded-xl max-w-sm mb-6 border border-slate-800/50">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${activeTab === 'overview' ? 'bg-[#1e293b] text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${activeTab === 'details' ? 'bg-[#1e293b] text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                Responsibilities & Skills
                            </button>
                        </div>

                        <div className="min-h-[200px]">
                            {activeTab === 'overview' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-200">About This Career</h3>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                        {career.fullDescription || career.shortDescription || "Create intuitive, accessible digital experiences through user research, prototyping, and systematic design thinking."}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-200 mb-3">Key Responsibilities</h3>
                                        {career.responsibilities.length > 0 ? (
                                            <ul className="space-y-2.5 text-slate-300 text-sm md:text-base">
                                                {career.responsibilities.map((item, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="text-blue-400 mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0"></span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-slate-500 italic text-sm">No specific responsibilities listed.</p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-200 mb-3">Required Skills</h3>
                                        {career.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {career.skills.map((skill, index) => (
                                                    <span key={index} className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-500/20">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 italic text-sm">No specific skills listed.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 shadow-sm space-y-5">
                        <div className="flex items-center gap-1 text-amber-400">
                            {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                            <span className="text-slate-200 font-bold ml-1 text-sm">4.6</span>
                            <span className="text-slate-500 text-xs">(1,340)</span>
                        </div>

                        <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Location</span>
                                <span className="font-semibold text-slate-200">{career.location || 'Austin, TX / Remote'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Experience</span>
                                <span className="font-semibold text-slate-200 capitalize">{career.experienceLevel || 'Entry-level'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Growth Rate</span>
                                <span className="font-semibold text-emerald-400">+18%/yr</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* APPLICATION MODAL POPUP */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-white">Apply for Job</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{career.title}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 p-1 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                                <input
                                    type="text" required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder-slate-600"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                                <input
                                    type="email" required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder-slate-600"
                                    placeholder="johndoe@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Resume Link (URL)</label>
                                <input
                                    type="url" required
                                    value={formData.resumeUrl}
                                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder-slate-600"
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cover Letter</label>
                                <textarea
                                    rows="4"
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none placeholder-slate-600"
                                    placeholder="Tell the hiring manager why you're a perfect fit..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl text-xs text-slate-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-xs text-white transition disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Details;
