const timeRanges = ["1D", "5D", "1M", "3M", "1Y"];

export default function DashboardHeader() {
    return (
        <header
            className="flex items-center justify-between px-6 py-3.5 shrink-0"
            style={{ borderBottom: "1px solid var(--border)" }}
        >
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent)" }} />
                    <span className="text-base font-bold tracking-[0.3em] uppercase">Needle</span>
                </div>

                <span className="h-6 w-px" style={{ background: "var(--border)" }} />

                <h1 className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>
                    S&amp;P 500
                </h1>
                <span className="text-2xl font-bold font-mono">
                    5,304.72
                </span>
                <span
                    className="text-sm font-medium px-2 py-0.5 rounded font-mono"
                    style={{ background: "rgba(34, 197, 94, 0.12)", color: "var(--accent-green)" }}
                >
                    ▲ +63.40 (+1.21%)
                </span>
            </div>

            <nav className="flex gap-1 rounded-lg p-1" style={{ background: "var(--surface)" }}>
                {timeRanges.map((range, i) => (
                    <button
                        key={range}
                        className="px-3 py-1 text-xs rounded-md font-medium"
                        style={{
                            background: i === 0 ? "var(--surface-2)" : "transparent",
                            color: i === 0 ? "var(--foreground)" : "var(--muted)",
                            cursor: "pointer",
                        }}
                    >
                        {range}
                    </button>
                ))}
            </nav>
        </header>
    );
}
