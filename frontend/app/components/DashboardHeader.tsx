const timeRanges = ["1D", "5D", "1M", "3M", "1Y"];

export default function DashboardHeader() {
    return (
        <header
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: "1px solid var(--border)" }}
        >
            <div className="flex items-center gap-6">
                <h1 className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>
                    S&amp;P 500
                </h1>
                <span
                    className="text-2xl font-bold"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >
                    5,304.72
                </span>
                <span
                    className="text-sm font-medium px-2 py-0.5 rounded"
                    style={{ background: "#14532d", color: "var(--accent-green)" }}
                >
                    ▲ +63.40 (+1.21%)
                </span>
            </div>

            <nav className="flex gap-1">
                {timeRanges.map((range, i) => (
                    <button
                        key={range}
                        className="px-3 py-1 text-xs rounded font-medium"
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
