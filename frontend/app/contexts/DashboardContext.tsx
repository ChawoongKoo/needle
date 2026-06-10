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
    selectedPoints: {time: string, value: number}[]
    setSelectedPoints: React.Dispatch<React.SetStateAction<{time: string, value: number}[]>>
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

    //datapoints captured by the marquee selection on the chart
    const [selectedPoints, setSelectedPoints] = useState<{time: string, value: number}[]>([])

    async function sendUserMessage( userMessage: string, setUserMessage: React.Dispatch<React.SetStateAction<string>>) {
        if (!userMessage) {setUserMessage(""); console.log("no user message"); return;}
        if (!timeValue && selectedPoints.length === 0) {return}

        const updatedMessages = [...messages, {role: "user", content: userMessage}]
        setMessages(updatedMessages)
        setLoading(true)

        //this is a stream
        const stream_body = await fetch("/api/llm", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({messages: updatedMessages, time: timeValue?.time, value: timeValue?.value, selectedPoints})
        });

        setUserMessage("")


        const reader = stream_body.body!.getReader();//get reader from the stream
        setMessages(prev => [...prev, {role: "assistant", content: ""}])//initialize the empty llm response

        const decoder = new TextDecoder()
        while (true) {
            const {done, value} = await reader.read()
            if (done) break
            const text = decoder.decode(value)
            console.log(performance.now().toFixed(0), JSON.stringify(text))   // ← add this
            setMessages( prev => {
                const last = prev.at(-1)!//have to create a copy since i cannot reference the old object at all, even as a shallow copy
                const updated_last = {role: "assistant", content: last.content+text}
                return [...prev.slice(0, -1), updated_last]//create a new object with all the previous objects and the new last 
            })
        }

        setSelectedPoints([])//clear the marquee selection once it has been sent
        setLoading(false)
        // console.log(llm_response.content)
        console.log("Sent llm response")
        // console.log(llm_response)
        console.log(messages)
    };

    return(
        <DashboardContext.Provider value={{messages, setMessages, timeValue, setTimeValue, loading, setLoading, selectedPoints, setSelectedPoints, sendUserMessage}}>
            {children}
        </DashboardContext.Provider>
    )
}