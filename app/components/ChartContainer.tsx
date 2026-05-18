import DashboardHeader from "./DashboardHeader";
import Chart from "./Chart";
import StatsRow from "./StatsRow";

export default function ChartContainer() {
    return (
        <div className="w-8/10">
            <DashboardHeader />
            <Chart />
            <StatsRow />
        </div>
    );
}
