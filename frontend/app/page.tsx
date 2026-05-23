import ChartContainer from "./components/ChartContainer";
import ChatBox from "./components/ChatBox";
import Chart from "./components/Chart";
import DashboardProvider from "./contexts/DashboardContext";

export default function Home() {
    return (
        <div
            className="flex flex-col h-screen items-center"
            style={{ background: "var(--bg)" }}
        >   
            <div className="w-8/10 h-3/10 relative">
                <DashboardProvider>
                    <Chart />
                    <ChatBox />
                </DashboardProvider>
            </div>
        </div>
    );
}
