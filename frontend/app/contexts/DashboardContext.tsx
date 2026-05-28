"use client"

import { useState, useContext, createContext } from "react";
import type { Time, CustomData, BarData, LineData,  HistogramData } from "lightweight-charts"
type TimeValue = { time: Time; value: CustomData<Time> | BarData<Time> | LineData<Time> | HistogramData<Time> | undefined } | null

type DashboardContextType = {
    messages: {role: string, content: string}[]
    setMessages: React.Dispatch<React.SetStateAction<{role: string, content: string}[]>>
    timeValue: TimeValue | null
    setTimeValue: React.Dispatch<React.SetStateAction<TimeValue | null>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    sendUserMessage: ( userMessage: string, setUserMessage: React.Dispatch<React.SetStateAction<string>> ) => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function useDashboardContext(){
    return useContext(DashboardContext)
}

export default function DashboardProvider( {children}: {children: React.ReactNode} ) {
    //messages containing both user and llm messages
    const [messages, setMessages] = useState<{role: string, content: string}[]>([])

    //time and value for question context
    const [timeValue, setTimeValue] = useState<{ time: Time; value: CustomData<Time> | BarData<Time> | LineData<Time> | HistogramData<Time> | undefined } | null>(null)

    //loading state for disabling spam calls
    const [loading, setLoading] = useState(false)

    async function sendUserMessage( userMessage: string, setUserMessage: React.Dispatch<React.SetStateAction<string>>) {
        if (!userMessage) {setUserMessage(""); console.log("no user message"); return;}
        if (!timeValue) {return}

        const updatedMessages = [...messages, {role: "user", content: userMessage}]
        setMessages(updatedMessages)
        setLoading(true)

        const res = await fetch("/api/llm", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({messages: updatedMessages, time: timeValue.time, value: timeValue.value})
        });

        setLoading(false)
        setUserMessage("")

        const llm_response = await res.json();//get response
        setMessages(prev => [...prev, {role: "assistant", content: llm_response.content}])
        // console.log(llm_response.content)
        console.log("Sent llm response")
        // console.log(llm_response)
    };

    return(
        <DashboardContext.Provider value={{messages, setMessages, timeValue, setTimeValue, loading, setLoading, sendUserMessage}}>
            {children}
        </DashboardContext.Provider>
    )
}