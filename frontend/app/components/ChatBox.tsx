"use client"
import { useState } from "react";
import { useDashboardContext } from "../contexts/DashboardContext";

export default function ChatBox() {
    const context = useDashboardContext()
    if (!context) return;
    const {messages, loading, sendUserMessage} = context

    //states related to information sent to llm
    const [userMessage, setUserMessage] = useState<string>("")


    return (
    <div
        className="flex flex-col flex-1 min-h-0 rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
        {/* panel header */}
        <div className="flex items-center gap-2 px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
            <span
                className="h-2 w-2 rounded-full"
                style={{ background: loading ? "var(--accent-green)" : "var(--muted)" }}
            />
            <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>
                Analyst
            </h2>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
                <div className="m-auto max-w-[28ch] text-center text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Double-click a point, or drag a box over a range of the chart, then ask about that period.
                </div>
            )}
            {messages.map((obj, i) => (
                obj.role === "user" ? (
                    <div
                        key={i}
                        className="self-end max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm leading-relaxed"
                        style={{ background: "var(--surface-2)" }}
                    >
                        {obj.content}
                    </div>
                ) : (
                    <div key={i} className="self-start max-w-[95%] text-sm leading-relaxed whitespace-pre-wrap">
                        {obj.content || "…"}
                    </div>
                )
            ))}
        </div>

        {/* input */}
        <div className="flex gap-2 p-3 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
            <input value={userMessage}
                placeholder="Ask about the S&P 500…"
                disabled={loading}
                onChange={e => setUserMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendUserMessage( userMessage, setUserMessage ) }}
                className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none border border-[var(--border)] focus:border-[var(--accent)] placeholder:text-slate-500 disabled:opacity-50"
                style={{ background: "var(--bg)", color: "var(--foreground)" }}>
            </input>
            <button
                className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-default"
                style={{ background: "var(--accent)", color: "#fff" }}
                onClick={() => sendUserMessage(userMessage, setUserMessage)}
                disabled={loading}
                >{
                    loading ? "Thinking..." : "Ask"
                }
            </button>
        </div>
    </div>)
}
