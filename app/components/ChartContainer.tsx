"use client"
import { useState } from "react";
import type { Time, CustomData, BarData, LineData,  HistogramData } from "lightweight-charts"
import DashboardHeader from "./DashboardHeader";
import Chart from "./Chart";
import StatsRow from "./StatsRow";
import ChatBox from "./ChatBox";

export default function ChartContainer() {
    const [messages, setMessages] = useState<string[]>([])
    const [timeValue, setTimeValue] = useState<{ time: Time; value: CustomData<Time> | BarData<Time> | LineData<Time> | HistogramData<Time> | undefined } | null>(null)

    //loading state for disabling spam calls
    const [loading, setLoading] = useState(false)

    return (
        <div className="w-8/10 h-3/10 relative">
            {/* <DashboardHeader /> */}

            <Chart messages={messages} setMessages={setMessages} loading={loading} setLoading={setLoading} timeValue={timeValue} setTimeValue={setTimeValue}/>
            <ChatBox messages={messages} setMessages={setMessages} loading={loading} setLoading={setLoading} timeValue={timeValue} setTimeValue={setTimeValue}/>
            {/* <StatsRow /> */}
        </div>
    );
}
