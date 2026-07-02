import ChatBox from "./components/ChatBox";
import Chart from "./components/Chart";
import DashboardHeader from "./components/DashboardHeader";
import StatsRow from "./components/StatsRow";
import DashboardProvider from "./contexts/DashboardContext";

export default function Home() {
    return (
        <div
            className="flex flex-col h-screen"
            style={{ background: "var(--bg)" }}
        >
            <DashboardHeader />
            <StatsRow />
            <DashboardProvider>
                <main className="flex flex-1 min-h-0 gap-4 px-6 pb-6">
                    {/* relative so the chart's floating input and marquee rectangle position against this panel */}
                    <section
                        className="relative flex-1 min-w-0 rounded-xl overflow-hidden"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                        <Chart />
                    </section>
                    <aside className="w-95 shrink-0 flex">
                        <ChatBox />
                    </aside>
                </main>
            </DashboardProvider>
        </div>
    );
}
