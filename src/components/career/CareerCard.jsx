"use client";
import React from 'react';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CareerCard = ({ career }) => {
    const router = useRouter();
    const cleanImageUrl = career.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600";

    return (
        <div className="bg-white dark:bg-[#121214] border border-gray-100 dark:border-[#222226] shadow-sm rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
            {/* Cover Image Container */}
            <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={cleanImageUrl}
                    alt={career.title || "Career Image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600";
                    }}
                />
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Meta Row */}
                <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        {career.category || "General"}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                        <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                        <span>{career.rating || "4.5"}</span>
                    </div>
                </div>

                {/* Info Text */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {career.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                    {career.shortDescription}
                </p>

                {/* Specs Row */}
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-5">
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{career.salaryRange}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{career.location || "Remote"}</span>
                    </div>
                </div>

                {/* Action CTA */}
                <button
                    onClick={() => router.push(`/career/${career._id}`)}
                    className="w-full bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm mt-auto"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default CareerCard;