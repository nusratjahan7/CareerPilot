"use client"
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Briefcase,
    Bookmark,
    TrendingUp,
    Clock,
    Sun,
    Moon,
    RefreshCw,
    User,
    AlertCircle,
} from "lucide-react";
import { getAuthHeaders } from "@/lib/api-auth";


const THEMES = {
    dark: {
        bg: "#0a0a0a",
        surface: "#131313",
        surfaceRaised: "#1a1a1a",
        border: "rgba(255,255,255,0.08)",
        text: "#f5f5f5",
        textMuted: "#8a8a8a",
        lime: "#3b82f6",
        limeSoft: "rgba(59,130,246,0.12)",
        purple: "#a78bfa",
        purpleSoft: "rgba(167,139,250,0.14)",
        danger: "#f87171",
        tooltipBg: "#1a1a1a",
    },
    light: {
        bg: "#f7f7f5",
        surface: "#ffffff",
        surfaceRaised: "#ffffff",
        border: "rgba(10,10,10,0.08)",
        text: "#141414",
        textMuted: "#6b6b6b",
        lime: "#2563eb",
        limeSoft: "rgba(37,99,235,0.10)",
        purple: "#7c3aed",
        purpleSoft: "rgba(124,58,237,0.10)",
        danger: "#dc2626",
        tooltipBg: "#ffffff",
    },
};

const STATUS_LABELS = {
    submitted: "Submitted",
    interview: "Interview",
    accepted: "Accepted",
    rejected: "Rejected",
};

function prettyStatus(status) {
    if (!status) return "Unknown";
    return STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

function monthKey(date) {
    const d = new Date(date);
    return `${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
}

// ---------------------------------------------------------------------------

export default function Dashboard({ userId = null, apiBaseUrl = "" }) {
    const [mode, setMode] = useState("dark");
    const t = THEMES[mode];

    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [savedCareers, setSavedCareers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const load = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            setError("no-user");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const headers = await getAuthHeaders();
            const [profileRes, applicationsRes, savedRes] = await Promise.all([
                fetch(`${apiBaseUrl}/api/profile/${userId}`, { headers }),
                fetch(`${apiBaseUrl}/api/applications?userId=${userId}`, { headers }),
                fetch(`${apiBaseUrl}/api/saved-careers?userId=${userId}`, { headers }),
            ]);

            const [profileJson, applicationsJson, savedJson] = await Promise.all([
                profileRes.json(),
                applicationsRes.json(),
                savedRes.json(),
            ]);

            if (!profileRes.ok || profileJson.success === false) {
                throw new Error(profileJson.error || "Failed to load profile.");
            }
            if (!applicationsRes.ok || applicationsJson.success === false) {
                throw new Error(applicationsJson.error || "Failed to load applications.");
            }
            if (!savedRes.ok || savedJson.success === false) {
                throw new Error(savedJson.error || "Failed to load saved careers.");
            }

            setProfile(profileJson.data);
            setApplications(applicationsJson.data || []);
            setSavedCareers(savedJson.data || []);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [userId, apiBaseUrl]);

    useEffect(() => {
        load();
    }, [load]);

    // ---- derive everything from live data, nothing hardcoded ----
    const stats = useMemo(() => {
        const total = applications.length;
        const statusCounts = applications.reduce((acc, a) => {
            const key = a.status || "submitted";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const submitted = statusCounts.submitted || 0;
        const responded = total - submitted;
        const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

        return { total, statusCounts, responseRate };
    }, [applications]);

    const pieData = useMemo(() => {
        return Object.entries(stats.statusCounts).map(([status, count]) => ({
            name: prettyStatus(status),
            value: count,
        }));
    }, [stats.statusCounts]);

    const trendData = useMemo(() => {
        const buckets = {};
        applications.forEach((a) => {
            if (!a.appliedAt) return;
            const key = monthKey(a.appliedAt);
            buckets[key] = (buckets[key] || 0) + 1;
        });
        return Object.entries(buckets)
            .map(([month, count]) => ({ month, count, _t: new Date(month).getTime() }))
            .sort((a, b) => a._t - b._t)
            .map(({ month, count }) => ({ month, count }));
    }, [applications]);

    const pieColors = [t.lime, t.purple, t.textMuted, t.danger];

    // ---- shared styles ----
    const page = {
        minHeight: "100%",
        background: t.bg,
        color: t.text,
        fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        transition: "background 0.2s ease, color 0.2s ease",
    };
    const card = {
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: "1.25rem",
    };

    return (
        <div style={page} className="w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: "9999px",
                                background: profile?.image ? "transparent" : t.limeSoft,
                                border: `1px solid ${t.border}`,
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            {profile?.image ? (
                                <img
                                    src={profile.image}
                                    alt=""
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <User size={20} color={t.lime} />
                            )}
                        </div>
                        <div>
                            <p style={{ color: t.textMuted }} className="text-xs uppercase tracking-wide">
                                Welcome back
                            </p>
                            <h1 className="text-lg sm:text-xl font-semibold leading-tight">
                                {loading ? "Loading…" : profile?.name || "Guest"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {lastUpdated && (
                            <span style={{ color: t.textMuted }} className="hidden sm:inline text-xs font-mono">
                                Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        )}
                        <button
                            onClick={load}
                            disabled={loading}
                            style={{ ...card, color: t.text }}
                            className="p-2.5 hover:opacity-80 transition disabled:opacity-40"
                            aria-label="Refresh dashboard"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                            style={{ ...card, color: t.text }}
                            className="p-2.5 hover:opacity-80 transition"
                            aria-label="Toggle theme"
                        >
                            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>
                </div>

                {/* Error / empty state */}
                {error && (
                    <div
                        style={{ ...card, borderColor: error === "no-user" ? t.border : t.danger }}
                        className="p-5 flex items-start gap-3"
                    >
                        <AlertCircle size={18} color={t.danger} className="mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium text-sm">
                                {error === "no-user" ? "No user signed in" : "Couldn't load your dashboard"}
                            </p>
                            <p style={{ color: t.textMuted }} className="text-sm mt-0.5">
                                {error === "no-user"
                                    ? "Pass a userId prop once auth resolves to load live data."
                                    : error}
                            </p>
                        </div>
                    </div>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        theme={t}
                        icon={<Briefcase size={18} color={t.lime} />}
                        iconBg={t.limeSoft}
                        label="Applications"
                        value={loading ? "—" : stats.total}
                    />
                    <StatCard
                        theme={t}
                        icon={<Bookmark size={18} color={t.purple} />}
                        iconBg={t.purpleSoft}
                        label="Saved careers"
                        value={loading ? "—" : savedCareers.length}
                    />
                    <StatCard
                        theme={t}
                        icon={<Clock size={18} color={t.lime} />}
                        iconBg={t.limeSoft}
                        label="Submitted"
                        value={loading ? "—" : stats.statusCounts.submitted || 0}
                    />
                    <StatCard
                        theme={t}
                        icon={<TrendingUp size={18} color={t.purple} />}
                        iconBg={t.purpleSoft}
                        label="Response rate"
                        value={loading ? "—" : `${stats.responseRate}%`}
                        ring={!loading ? stats.responseRate : null}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div style={card} className="p-5 lg:col-span-2">
                        <h2 className="text-sm font-semibold mb-1">Applications over time</h2>
                        <p style={{ color: t.textMuted }} className="text-xs mb-4">
                            Submissions grouped by month
                        </p>
                        <div style={{ width: "100%", height: 240 }}>
                            {trendData.length === 0 ? (
                                <EmptyChart theme={t} text={loading ? "Loading chart…" : "No applications yet"} />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={t.lime} stopOpacity={0.35} />
                                                <stop offset="100%" stopColor={t.lime} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke={t.border} vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            stroke={t.textMuted}
                                            tick={{ fontSize: 11, fill: t.textMuted }}
                                            axisLine={{ stroke: t.border }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            stroke={t.textMuted}
                                            tick={{ fontSize: 11, fill: t.textMuted }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: t.tooltipBg,
                                                border: `1px solid ${t.border}`,
                                                borderRadius: 12,
                                                fontSize: 12,
                                                color: t.text,
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke={t.lime}
                                            strokeWidth={2}
                                            fill="url(#trendFill)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div style={card} className="p-5">
                        <h2 className="text-sm font-semibold mb-1">Status breakdown</h2>
                        <p style={{ color: t.textMuted }} className="text-xs mb-4">
                            Where your applications stand
                        </p>
                        <div style={{ width: "100%", height: 200 }}>
                            {pieData.length === 0 ? (
                                <EmptyChart theme={t} text={loading ? "Loading chart…" : "Nothing to show"} />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={45}
                                            outerRadius={72}
                                            paddingAngle={3}
                                            stroke="none"
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell key={i} fill={pieColors[i % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: t.tooltipBg,
                                                border: `1px solid ${t.border}`,
                                                borderRadius: 12,
                                                fontSize: 12,
                                                color: t.text,
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                            {pieData.map((d, i) => (
                                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                                    <span
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 9999,
                                            background: pieColors[i % pieColors.length],
                                        }}
                                    />
                                    <span style={{ color: t.textMuted }}>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent applications + saved careers */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div style={card} className="p-5 lg:col-span-2">
                        <h2 className="text-sm font-semibold mb-4">Recent applications</h2>
                        {loading ? (
                            <SkeletonRows theme={t} rows={4} />
                        ) : applications.length === 0 ? (
                            <p style={{ color: t.textMuted }} className="text-sm">
                                You haven't applied to anything yet.
                            </p>
                        ) : (
                            <div className="flex flex-col divide-y" style={{ borderColor: t.border }}>
                                {applications.slice(0, 6).map((a) => (
                                    <div
                                        key={a._id}
                                        className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                                        style={{ borderColor: t.border }}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={a.career?.coverImage}
                                                alt=""
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 10,
                                                    objectFit: "cover",
                                                    border: `1px solid ${t.border}`,
                                                }}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {a.career?.title || "Listing removed"}
                                                </p>
                                                <p style={{ color: t.textMuted }} className="text-xs truncate">
                                                    {a.career?.location || "—"}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge theme={t} status={a.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={card} className="p-5">
                        <h2 className="text-sm font-semibold mb-4">Saved careers</h2>
                        {loading ? (
                            <SkeletonRows theme={t} rows={3} />
                        ) : savedCareers.length === 0 ? (
                            <p style={{ color: t.textMuted }} className="text-sm">
                                Nothing saved yet.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {savedCareers.slice(0, 5).map((s) => (
                                    <div key={s._id} className="flex items-center gap-3">
                                        <img
                                            src={s.career?.coverImage}
                                            alt=""
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                border: `1px solid ${t.border}`,
                                            }}
                                        />
                                        <p className="text-sm truncate">{s.career?.title || "Listing removed"}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function StatCard({ theme: t, icon, iconBg, label, value, ring }) {
    return (
        <div
            style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: "1.25rem" }}
            className="p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden"
        >
            <div
                style={{ background: iconBg, borderRadius: "0.75rem", width: 36, height: 36 }}
                className="flex items-center justify-center"
            >
                {icon}
            </div>
            <div>
                <p style={{ color: t.textMuted }} className="text-xs mb-0.5">
                    {label}
                </p>
                <p className="text-2xl font-semibold font-mono tabular-nums">{value}</p>
            </div>
            {ring !== null && ring !== undefined && (
                <svg
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    className="absolute top-4 right-4 opacity-90"
                >
                    <circle cx="26" cy="26" r="22" fill="none" stroke={t.border} strokeWidth="4" />
                    <circle
                        cx="26"
                        cy="26"
                        r="22"
                        fill="none"
                        stroke={t.purple}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 22}`}
                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - ring / 100)}`}
                        transform="rotate(-90 26 26)"
                    />
                </svg>
            )}
        </div>
    );
}

function StatusBadge({ theme: t, status }) {
    const key = status || "submitted";
    const palette = {
        submitted: { bg: t.limeSoft, fg: t.lime },
        interview: { bg: t.purpleSoft, fg: t.purple },
        accepted: { bg: t.limeSoft, fg: t.lime },
        rejected: { bg: "rgba(248,113,113,0.14)", fg: t.danger },
    };
    const c = palette[key] || { bg: t.surfaceRaised, fg: t.textMuted };
    return (
        <span
            style={{ background: c.bg, color: c.fg }}
            className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
        >
            {prettyStatus(key)}
        </span>
    );
}

function EmptyChart({ theme: t, text }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <p style={{ color: t.textMuted }} className="text-xs">
                {text}
            </p>
        </div>
    );
}

function SkeletonRows({ theme: t, rows = 3 }) {
    return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div style={{ background: t.surfaceRaised, borderRadius: 10 }} className="w-9 h-9 flex-shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                        <div style={{ background: t.surfaceRaised, borderRadius: 4 }} className="h-3 w-2/3" />
                        <div style={{ background: t.surfaceRaised, borderRadius: 4 }} className="h-2.5 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
