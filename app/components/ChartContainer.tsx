import DashboardHeader from "./DashboardHeader";
import Chart from "./Chart";
import StatsRow from "./StatsRow";

export default function ChartContainer() {
    return (
        <div className="w-8/10 h-3/10 relative">
            {/* <DashboardHeader /> */}
            <Chart />
            {/* <StatsRow /> */}
        </div>
    );
}
