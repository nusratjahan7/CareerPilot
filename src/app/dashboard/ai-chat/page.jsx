"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`;

const SUGGESTED_PROMPTS = [
    'Explain this codebase to me like I just joined',
    'Draft a launch checklist for a side project',
    'Help me debug a race condition in React state',
    'Summarize the tradeoffs of REST vs GraphQL',
];

const uid = () => Math.random().toString(36).slice(2, 10);

const newSession = () => ({
    id: uid(),
    title: 'New chat',
    messages: [],
});

function Avatar({ role, thinking }) {
    if (role === 'user') {
        return (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/70">
                You
            </div>
        );
    }
    return (
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-lime-300 ${thinking ? 'animate-spin-slow opacity-90 blur-[2px]' : 'opacity-70'
                    }`}
            />
            <div className="relative h-6 w-6 rounded-full bg-[#0a0a0a]" />
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex items-center gap-3">
            <Avatar role="assistant" thinking />
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-white/5 bg-[#141018] px-4 py-3">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300/80"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

function Message({ role, content }) {
    const isUser = role === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <Avatar role={role} />
            <div
                className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${isUser
                    ? 'rounded-tr-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                    : 'rounded-tl-sm border border-white/5 bg-[#141018] text-white/90'
                    }`}
            >
                {content}
                {!isUser && content === '' && <span className="inline-block h-4 w-1 animate-pulse bg-blue-300/70 align-middle" />}
            </div>
        </div>
    );
}

export default function AiChat() {
    const [sessions, setSessions] = useState([newSession()]);
    const [activeId, setActiveId] = useState(sessions[0].id);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const abortRef = useRef(null);

    const active = sessions.find((s) => s.id === activeId) ?? sessions[0];

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [active?.messages, isTyping]);

    const updateSession = useCallback((id, updater) => {
        setSessions((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
    }, []);

    const handleNewChat = () => {
        const s = newSession();
        setSessions((prev) => [s, ...prev]);
        setActiveId(s.id);
    };

    const sendMessage = async (text) => {
        const trimmed = text.trim();
        if (!trimmed || isTyping) return;

        const sessionId = active.id;
        const userMsg = { role: 'user', content: trimmed };

        updateSession(sessionId, (s) => ({
            ...s,
            title: s.messages.length === 0 ? trimmed.slice(0, 40) : s.title,
            messages: [...s.messages, userMsg],
        }));
        setInput('');
        setIsTyping(true);

        // Placeholder assistant message we stream tokens into.
        updateSession(sessionId, (s) => ({ ...s, messages: [...s.messages, { role: 'assistant', content: '' }] }));

        try {
            const controller = new AbortController();
            abortRef.current = controller;

            const historyForContext = [...active.messages, userMsg].map(({ role, content }) => ({ role, content }));

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, messages: historyForContext }),
                signal: controller.signal,
            });

            if (!res.ok || !res.body) throw new Error(`Request failed: ${res.status}`);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let acc = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                acc += decoder.decode(value, { stream: true });

                updateSession(sessionId, (s) => {
                    const msgs = [...s.messages];
                    msgs[msgs.length - 1] = { role: 'assistant', content: acc };
                    return { ...s, messages: msgs };
                });
            }
        } catch (err) {
            updateSession(sessionId, (s) => {
                const msgs = [...s.messages];
                msgs[msgs.length - 1] = {
                    role: 'assistant',
                    content: "Couldn't reach the server. Check that the backend is running and try again.",
                };
                return { ...s, messages: msgs };
            });
        } finally {
            setIsTyping(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0a0a] text-white">
            {/* Sidebar */}
            <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-[#0d0b12] p-3 sm:flex">
                <button
                    onClick={handleNewChat}
                    className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                >
                    + New chat
                </button>
                <div className="flex-1 space-y-1 overflow-y-auto">
                    {sessions.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveId(s.id)}
                            className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${s.id === activeId ? 'bg-blue-600/20 text-blue-200' : 'text-white/60 hover:bg-white/5'
                                }`}
                        >
                            {s.title}
                        </button>
                    ))}
                </div>
                <div className="mt-3 border-t border-white/5 pt-3 text-xs text-white/30">AI Chat</div>
            </aside>

            {/* Main */}
            <main className="flex min-w-0 flex-1 flex-col">
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
                    {active.messages.length === 0 ? (
                        <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
                            <div className="mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-lime-300 opacity-80" />
                            <h1 className="mb-1 text-2xl font-semibold tracking-tight">What are you working on?</h1>
                            <p className="mb-8 text-sm text-white/40">Ask anything, or try one of these to get started.</p>
                            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                                {SUGGESTED_PROMPTS.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => sendMessage(p)}
                                        className="rounded-xl border border-white/5 bg-[#131118] px-4 py-3 text-left text-sm text-white/70 transition hover:border-violet-500/30 hover:text-white"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto flex max-w-2xl flex-col gap-6">
                            {active.messages.map((m, i) =>
                                m.role === 'assistant' && m.content === '' && isTyping && i === active.messages.length - 1 ? (
                                    <TypingIndicator key={i} />
                                ) : (
                                    <Message key={i} role={m.role} content={m.content} />
                                )
                            )}
                        </div>
                    )}
                </div>

                <form onSubmit={onSubmit} className="border-t border-white/5 bg-[#0a0a0a] px-4 py-4 sm:px-8">
                    <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-white/10 bg-[#131118] p-2 focus-within:border-violet-500/40">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(input);
                                }
                            }}
                            rows={1}
                            placeholder="Message AI Chat..."
                            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] text-white placeholder-white/30 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[#0a0a0a] transition disabled:opacity-30"
                            aria-label="Send message"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-white/20">
                        Responses may be inaccurate. Verify important information.
                    </p>
                </form>
            </main>
        </div>
    );
}