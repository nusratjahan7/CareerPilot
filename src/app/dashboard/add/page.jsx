"use client";

import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast, Toaster } from 'sonner';

export default function CareerAdd() {

    const { data: sessionData } = authClient.useSession();

    const initialFormState = {
        title: '',
        category: '',
        shortDescription: '',
        fullDescription: '',
        salaryRange: '',
        experienceLevel: '',
        location: '',
        coverImage: '',
        responsibilities: '',
        skills: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClear = () => {
        setFormData(initialFormState);
        setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        toast.dismiss();

        try {
            const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            if (!sessionData?.user) {
                throw new Error("You must be logged in to submit a career listing.");
            }

            const headers = {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            };

            const submissionData = {
                ...formData,
                userId: sessionData.user.id,
                creatorEmail: sessionData.user.email,
                creatorName: sessionData.user.name,
                responsibilities: formData.responsibilities
                    ? formData.responsibilities.split('\n').map(item => item.trim()).filter(Boolean)
                    : [],
                skills: formData.skills
                    ? formData.skills.split(',').map(item => item.trim()).filter(Boolean)
                    : []
            };

            const response = await fetch(`${baseURL}/api/careers`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(submissionData),
            });

            const textData = await response.text();
            const data = textData ? JSON.parse(textData) : {};

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong while submitting.');
            }

            setStatus({ type: 'success', message: 'Career listing successfully submitted!' });
            toast.success('Career listing successfully submitted! 🎉');
            setFormData(initialFormState);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 font-sans text-gray-900 dark:text-gray-100">


            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white">Add New Career</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Contribute a career listing to the CareerPilot directory</p>
            </div>

            {/* Form Card Container */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121214] border border-gray-100 dark:border-[#222226] shadow-sm rounded-2xl p-6 md:p-8 space-y-6">

                {/* Status Messaging banner */}
                {status.message && (
                    <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${status.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}>
                        {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{status.message}</span>
                    </div>
                )}

                {/* Row 1: Career Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Career Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Cloud Solutions Architect"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category *</label>
                        <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                        >
                            <option value="" disabled hidden>Select category</option>
                            <option value="Technology">Technology & Engineering</option>
                            <option value="Design">Design & Creative</option>
                            <option value="Marketing">Marketing & Business</option>
                            <option value="Healthcare">Healthcare & Medicine</option>
                        </select>
                    </div>
                </div>

                {/* Row 2: Short Description */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Short Description *</label>
                    <input
                        type="text"
                        name="shortDescription"
                        required
                        value={formData.shortDescription}
                        onChange={handleChange}
                        placeholder="One compelling sentence describing this career..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                </div>

                {/* Row 3: Full Description */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Description *</label>
                    <textarea
                        name="fullDescription"
                        required
                        rows={4}
                        value={formData.fullDescription}
                        onChange={handleChange}
                        placeholder="Provide a detailed overview of the career, day-to-day work, industry context..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all resize-none text-gray-900 dark:text-white"
                    />
                </div>

                {/* Core Responsibilities */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Core Responsibilities *</label>
                    <textarea
                        name="responsibilities"
                        required
                        rows={4}
                        value={formData.responsibilities}
                        onChange={handleChange}
                        placeholder="Enter each responsibility on a new line&#10;- Design cloud infrastructure&#10;- Optimize database performance"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all resize-none text-gray-900 dark:text-white"
                    />
                </div>

                {/* Key Skills */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Skills *</label>
                    <input
                        type="text"
                        name="skills"
                        required
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Separate skills with commas (e.g. React, Node.js, AWS, Kubernetes)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                    />
                </div>

                {/* Row 4: Salary Range & Experience Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Salary Range *</label>
                        <input
                            type="text"
                            name="salaryRange"
                            required
                            value={formData.salaryRange}
                            onChange={handleChange}
                            placeholder="e.g. $90,000 – $150,000"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Experience Level *</label>
                        <select
                            name="experienceLevel"
                            required
                            value={formData.experienceLevel}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                        >
                            <option value="" disabled hidden>Select level</option>
                            <option value="Entry">Entry Level</option>
                            <option value="Mid">Mid Level</option>
                            <option value="Senior">Senior Level</option>
                            <option value="Lead">Lead / Executive</option>
                        </select>
                    </div>
                </div>

                {/* Row 5: Location & Cover Image URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location Setting *</label>
                        <select
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                        >
                            <option value="" disabled hidden>Select layout</option>
                            <option value="Remote">Remote</option>
                            <option value="On-site">On-site</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Image URL</label>
                        <input
                            type="url"
                            name="coverImage"
                            value={formData.coverImage}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#222226] bg-gray-50/50 dark:bg-[#18181c] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        {loading ? 'Submitting...' : 'Submit Career'}
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-[#f1f5f9] hover:bg-gray-200 dark:bg-[#1e293b] dark:hover:bg-[#2e3b52] text-[#334155] dark:text-gray-200 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                    >
                        Clear Form
                    </button>
                </div>
            </form>
        </div>
    );
}