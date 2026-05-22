"use client"

import { useState, useContext, createContext } from "react";
import type { Time, CustomData, BarData, LineData,  HistogramData } from "lightweight-charts"
type TimeValue = { time: Time; value: CustomData<Time> | BarData<Time> | LineData<Time> | HistogramData<Time> | undefined } | null

type DashboardContextType = {
    messages: string[]
    setMessages: React.Dispatch<React.SetStateAction<string[]>>
    timeValue: TimeValue | null
    setTimeValue: React.Dispatch<React.SetStateAction<TimeValue | null>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function useDashboardContext(){
    return useContext(DashboardContext)
}

export default function DashboardProvider( {children}: {children: React.ReactNode} ) {
    //messages containing both user and llm messages
    const [messages, setMessages] = useState<string[]>([])

    //time and value for question context
    const [timeValue, setTimeValue] = useState<{ time: Time; value: CustomData<Time> | BarData<Time> | LineData<Time> | HistogramData<Time> | undefined } | null>(null)

    //loading state for disabling spam calls
    const [loading, setLoading] = useState(false)

    return(
        <DashboardContext.Provider value={{messages, setMessages, timeValue, setTimeValue, loading, setLoading}}>
            {children}
        </DashboardContext.Provider>
    )
}