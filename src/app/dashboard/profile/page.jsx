"use client";
import React, { useState, useRef, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`;


function initials(name) {
    return name
        ?.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('') || '?';
}

export default function Profile() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const userId = session?.user?.id ?? null;

    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loadState, setLoadState] = useState('loading'); // loading | ready | error
    const [status, setStatus] = useState('idle'); // idle | saving | saved | error
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!userId) return;

        let cancelled = false;
        setLoadState('loading');

        fetch(`${API_BASE}/${userId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                return res.json();
            })
            .then(({ data }) => {
                if (cancelled) return;
                setUser(data);
                setName(data.name ?? '');
                setImagePreview(data.image ?? null);
                setLoadState('ready');
            })
            .catch(() => {
                if (!cancelled) setLoadState('error');
            });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
        : '';

    const hasChanges = user && (name.trim() !== user.name || !!imageFile);

    const onPickImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const onRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!hasChanges || status === 'saving') return;
        setStatus('saving');

        try {
            const body = { userId, name: name.trim() };

            if (imageFile) body.image = imagePreview;

            const res = await fetch(API_BASE, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            const { data } = await res.json();
            setUser(data);
            setStatus('saved');
            setImageFile(null);
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            setStatus('error');
        }
    };

    if (sessionPending) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white sm:px-8">
                <div className="mx-auto max-w-xl animate-pulse">
                    <div className="h-7 w-32 rounded bg-white/5" />
                    <div className="mt-2 h-4 w-56 rounded bg-white/5" />
                    <div className="mt-8 h-80 rounded-2xl border border-white/5 bg-[#131118]" />
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-white">
                <p className="text-sm text-white/50">You need to be signed in to view this page.</p>
            </div>
        );
    }

    if (loadState === 'loading') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white sm:px-8">
                <div className="mx-auto max-w-xl animate-pulse">
                    <div className="h-7 w-32 rounded bg-white/5" />
                    <div className="mt-2 h-4 w-56 rounded bg-white/5" />
                    <div className="mt-8 h-80 rounded-2xl border border-white/5 bg-[#131118]" />
                </div>
            </div>
        );
    }

    if (loadState === 'error') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-white">
                <p className="text-sm text-white/50">Couldn't load your profile. Try refreshing the page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white sm:px-8">
            <div className="mx-auto max-w-xl">
                <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
                <p className="mt-1 text-sm text-white/40">Update your photo and personal details.</p>

                <form
                    onSubmit={onSubmit}
                    className="mt-8 space-y-8 rounded-2xl border border-white/5 bg-[#131118] p-6"
                >
                    {/* Avatar / image section */}
                    <div>
                        <label className="mb-3 block text-sm font-medium text-white/70">Photo</label>
                        <div className="flex items-center gap-5">
                            <div className="relative h-20 w-20 shrink-0">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="h-20 w-20 rounded-full object-cover ring-2 ring-white/10"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-lime-300 text-lg font-semibold text-[#0a0a0a]">
                                        {initials(name)}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                                    >
                                        Upload photo
                                    </button>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={onRemoveImage}
                                            className="rounded-lg px-3 py-1.5 text-sm text-white/40 transition hover:text-white/70"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-white/30">JPG or PNG, up to 5MB.</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={onPickImage}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/70">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-2.5 text-[15px] text-white outline-none focus:border-violet-500/40"
                            placeholder="Your name"
                        />
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/70">Email</label>
                        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5">
                            <span className="text-[15px] text-white/60">{user.email}</span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.emailVerified
                                    ? 'bg-lime-300/10 text-lime-300'
                                    : 'bg-white/5 text-white/40'
                                    }`}
                            >
                                {user.emailVerified ? 'Verified' : 'Unverified'}
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs text-white/30">Contact support to change your email.</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-5">
                        <span className="text-xs text-white/30">Member since {memberSince}</span>
                        <div className="flex items-center gap-3">
                            {status === 'saved' && <span className="text-sm text-lime-300">Saved</span>}
                            {status === 'error' && <span className="text-sm text-red-400">Couldn't save</span>}
                            <button
                                type="submit"
                                disabled={!hasChanges || status === 'saving'}
                                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-30"
                            >
                                {status === 'saving' ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}