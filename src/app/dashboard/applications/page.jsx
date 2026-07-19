"use client";
import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/applications";

const STATUS_STYLES = {
    submitted: 'bg-white/5 text-white/50',
    reviewing: 'bg-violet-500/10 text-violet-300',
    interview: 'bg-lime-300/10 text-lime-300',
    rejected: 'bg-red-500/10 text-red-300',
    offer: 'bg-lime-300/10 text-lime-300',
};

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.submitted;
    return (
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>
            {status}
        </span>
    );
}

function ApplicationCard({ app }) {
    const title = app.career?.title ?? 'Listing removed';
    const appliedDate = new Date(app.appliedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#131118] p-4 transition hover:border-white/10">
            <img
                src={app.career?.imageUrl || 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=80'}
                alt=""
                className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-medium text-white">{title}</h3>
                <p className="mt-0.5 text-sm text-white/40">
                    {app.career?.location ? `${app.career.location} · ` : ''}Applied {appliedDate}
                </p>
            </div>
            <StatusBadge status={app.status} />
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <div className="mb-3 h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-lime-300 opacity-70" />
            <h3 className="text-[15px] font-medium text-white">No applications yet</h3>
            <p className="mt-1 text-sm text-white/40">Jobs you apply to will show up here.</p>
        </div>
    );
}

function SkeletonCard() {
    return <div className="h-[76px] animate-pulse rounded-2xl border border-white/5 bg-[#131118]" />;
}

export default function Applications() {
    const { data: session, isPending: sessionPending } = authClient.useSession();


    const userId = session?.user?.id || session?.user?._id || null;

    const [applications, setApplications] = useState([]);
    const [loadState, setLoadState] = useState('loading');

    useEffect(() => {

        if (!userId || userId === 'undefined') {
            if (!sessionPending) setLoadState('ready');
            return;
        }

        let cancelled = false;
        setLoadState('loading');


        fetch(`${API_URL}?userId=${userId}`)
            .then((res) => {
                return res.json().then(data => {
                    if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
                    return data;
                });
            })
            .then((result) => {
                if (cancelled) return;

                if (result && Array.isArray(result.data)) {
                    setApplications(result.data);
                } else {
                    setApplications([]);
                }
                setLoadState('ready');
            })
            .catch((error) => {
                console.error("Frontend Fetch Error:", error);
                if (!cancelled) setLoadState('error');
            });

        return () => {
            cancelled = true;
        };
    }, [userId, sessionPending]);



    if (sessionPending) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white sm:px-8">
                <div className="mx-auto max-w-2xl animate-pulse">
                    <div className="h-7 w-40 rounded bg-white/5" />
                    <div className="mt-2 h-4 w-64 rounded bg-white/5" />
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-white">
                <p className="text-sm text-white/50">You need to be signed in to view your applications.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white sm:px-8">
            <div className="mx-auto max-w-2xl">
                <h1 className="text-2xl font-semibold tracking-tight">My Applications</h1>
                <p className="mt-1 text-sm text-white/40">
                    {loadState === 'ready' ? `${applications.length} submitted` : 'Track the roles you\'ve applied to.'}
                </p>

                <div className="mt-8 space-y-3">
                    {loadState === 'loading' && (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    )}

                    {loadState === 'error' && (
                        <p className="text-sm text-white/50">Couldn't load your applications. Try refreshing.</p>
                    )}

                    {loadState === 'ready' && applications.length === 0 && <EmptyState />}

                    {loadState === 'ready' &&
                        applications.map((app) => <ApplicationCard key={app._id} app={app} />)}
                </div>
            </div>
        </div>
    );
}