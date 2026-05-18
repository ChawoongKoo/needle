import ChartContainer from "./components/ChartContainer";

export default function Home() {
    return (
        <div
            className="flex flex-col h-screen items-center"
            style={{ background: "var(--bg)" }}
        >
            <ChartContainer />
        </div>
    );
}
