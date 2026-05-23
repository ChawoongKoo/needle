type Props = {
    label: string;
    value: string;
};

export default function StatCard({ label, value }: Props) {
    return (
        <div
            className="flex-1 rounded-lg p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                {label}
            </p>
            <p className="text-xl font-semibold" style={{ fontFamily: "'Fira Code', monospace" }}>
                {value}
            </p>
        </div>
    );
}
