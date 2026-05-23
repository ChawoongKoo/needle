import StatCard from "./StatCard";

export default function StatsRow() {
    return (
        <div className="flex gap-3 p-6 pt-0">
            <StatCard label="Open" value="5,280.14" />
            <StatCard label="High" value="5,320.47" />
            <StatCard label="Low" value="5,271.03" />
            <StatCard label="Volume" value="2.4B" />
        </div>
    );
}
