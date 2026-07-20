"use client"
import React, { useCallback, useRef, useState } from "react";
import { Upload, Image as ImageIcon, Sparkles, Tag, X, Loader2, AlertCircle } from "lucide-react";

const THEME = {
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
};

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("Could not read file."));
        reader.readAsDataURL(file);
    });
}

export default function ImageUnderstanding({ apiBaseUrl = "" }) {
    const t = THEME;
    const inputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleFile = useCallback((f) => {
        if (!f || !f.type.startsWith("image/")) {
            setError("Please choose an image file.");
            return;
        }
        setError(null);
        setResult(null);
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    }, []);

    const onDrop = useCallback(
        (e) => {
            e.preventDefault();
            setDragActive(false);
            const f = e.dataTransfer.files?.[0];
            handleFile(f);
        },
        [handleFile]
    );

    const analyze = useCallback(async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const imageBase64 = await fileToBase64(file);
            const res = await fetch(`${apiBaseUrl}/api/image-understanding`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64, mimeType: file.type }),
            });
            const json = await res.json();
            if (!res.ok || json.success === false) {
                throw new Error(json.error || "Analysis failed.");
            }
            setResult(json.data);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [file, apiBaseUrl]);

    const reset = () => {
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const card = {
        background: t.surface,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: t.border,
        borderRadius: "1.25rem",
    };

    return (
        <div
            style={{ background: t.bg, color: t.text, minHeight: "100%", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
            className="w-full p-4 sm:p-6 lg:p-8"
        >
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                <div>
                    <p style={{ color: t.textMuted }} className="text-xs uppercase tracking-wide mb-1">
                        AI tools
                    </p>
                    <h1 className="text-xl sm:text-2xl font-semibold">Image understanding</h1>
                    <p style={{ color: t.textMuted }} className="text-sm mt-1">
                        Upload an image to get a caption, a plain-language explanation, and the objects detected in it.
                    </p>
                </div>

                {/* Upload zone */}
                {!previewUrl ? (
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={onDrop}
                        onClick={() => inputRef.current?.click()}
                        style={{
                            ...card,
                            borderStyle: "dashed",
                            borderColor: dragActive ? t.lime : t.border,
                            background: dragActive ? t.limeSoft : t.surface,
                            cursor: "pointer",
                        }}
                        className="p-10 flex flex-col items-center justify-center gap-3 text-center transition-colors"
                    >
                        <div
                            style={{ background: t.limeSoft, borderRadius: "9999px" }}
                            className="w-12 h-12 flex items-center justify-center"
                        >
                            <Upload size={20} color={t.lime} />
                        </div>
                        <p className="text-sm font-medium">Drop an image here, or click to browse</p>
                        <p style={{ color: t.textMuted }} className="text-xs">
                            PNG, JPG, or WEBP
                        </p>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                    </div>
                ) : (
                    <div style={card} className="p-4 sm:p-5 flex flex-col gap-4">
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Selected upload"
                                style={{ borderRadius: "1rem", border: `1px solid ${t.border}` }}
                                className="w-full max-h-96 object-contain bg-black"
                            />
                            <button
                                onClick={reset}
                                style={{ background: t.surfaceRaised, border: `1px solid ${t.border}` }}
                                className="absolute top-2 right-2 p-1.5 rounded-full hover:opacity-80"
                                aria-label="Remove image"
                            >
                                <X size={14} color={t.text} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs" style={{ color: t.textMuted }}>
                            <ImageIcon size={14} />
                            <span className="truncate">{file?.name}</span>
                        </div>

                        {!result && (
                            <button
                                onClick={analyze}
                                disabled={loading}
                                style={{ background: t.lime, color: "#0a0a0a" }}
                                className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Analyzing…
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} /> Analyze image
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{ ...card, borderColor: t.danger }} className="p-4 flex items-start gap-3">
                        <AlertCircle size={18} color={t.danger} className="mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Loading skeleton for results */}
                {loading && (
                    <div style={card} className="p-5 flex flex-col gap-3 animate-pulse">
                        <div style={{ background: t.surfaceRaised, borderRadius: 6 }} className="h-5 w-2/3" />
                        <div style={{ background: t.surfaceRaised, borderRadius: 6 }} className="h-3 w-full" />
                        <div style={{ background: t.surfaceRaised, borderRadius: 6 }} className="h-3 w-5/6" />
                        <div className="flex gap-2 mt-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} style={{ background: t.surfaceRaised, borderRadius: 9999 }} className="h-6 w-16" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && !loading && (
                    <div className="flex flex-col gap-4">
                        <div style={card} className="p-5">
                            <p style={{ color: t.textMuted }} className="text-xs uppercase tracking-wide mb-2">
                                Caption
                            </p>
                            <h2 className="text-lg font-semibold leading-snug">{result.caption}</h2>
                        </div>

                        <div style={card} className="p-5">
                            <p style={{ color: t.textMuted }} className="text-xs uppercase tracking-wide mb-2">
                                Explanation
                            </p>
                            <p className="text-sm leading-relaxed">{result.description}</p>
                        </div>

                        <div style={card} className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag size={14} color={t.purple} />
                                <p style={{ color: t.textMuted }} className="text-xs uppercase tracking-wide">
                                    Detected objects
                                </p>
                            </div>
                            {result.objects?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {result.objects.map((obj, i) => (
                                        <span
                                            key={i}
                                            style={{ background: t.purpleSoft, color: t.purple }}
                                            className="text-xs font-medium px-3 py-1.5 rounded-full"
                                        >
                                            {obj}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: t.textMuted }} className="text-sm">
                                    No distinct objects identified.
                                </p>
                            )}
                        </div>

                        <button
                            onClick={reset}
                            style={{ ...card, color: t.text }}
                            className="py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition"
                        >
                            Analyze another image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}