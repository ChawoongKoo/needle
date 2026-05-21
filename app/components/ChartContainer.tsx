"use client"
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Chart from "./Chart";
import StatsRow from "./StatsRow";
import ChatBox from "./ChatBox";

export default function ChartContainer() {
    const [messages, setMessages] = useState<string[]>([])
    return (
        <div className="w-8/10 h-3/10 relative">
            {/* <DashboardHeader /> */}

            <Chart messages={messages} setMessages={setMessages} />
            <ChatBox messages={messages} setMessages={setMessages}/>
            {/* <StatsRow /> */}
        </div>
    );
}
