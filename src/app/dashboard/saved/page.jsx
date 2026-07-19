"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import CareerCard from "@/components/career/CareerCard";

const API =
    process.env.NEXT_PUBLIC_BACKEND_URL + "/api/saved-careers";

const Saved = () => {
    const { data: session } = authClient.useSession();

    const userId = session?.user?.id;

    const [savedCareers, setSavedCareers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const loadSaved = async () => {
            try {
                const res = await fetch(`${API}?userId=${userId}`);

                const data = await res.json();

                if (data.success) {
                    setSavedCareers(data.data);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        loadSaved();
    }, [userId]);

    if (loading) {
        return (
            <div className="text-center py-20 text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-5">
            <h1 className="text-3xl font-bold mb-8 text-white">
                My Saved Careers
            </h1>

            {savedCareers.length === 0 ? (
                <p className="text-gray-400">
                    No saved careers found.
                </p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedCareers.map((item) => (
                        <CareerCard key={item._id} career={item.career} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Saved;