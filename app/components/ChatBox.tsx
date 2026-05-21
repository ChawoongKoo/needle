"use client"
import { useState, useEffect } from "react";
import type { Time, CustomData, BarData, LineData,  HistogramData } from "lightweight-charts"

export default function ChatBox() {
    //states related to information sent to llm
    const [userMessage, setUserMessage] = useState<string>("")
    const [timeValue, setTimeValue] = useState<{ time: Time; value: CustomData<Time> | BarData<Time> | LineData<Time> | HistogramData<Time> | undefined } | null>(null)

    //state for llm message
    const [LLMresponse, setLLMResponse] = useState("")
    const [messages, setMessages] = useState<string[]>([])


    return (
    <>
    <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="bg-gray-400 w-full h-full">
            <div>
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
        </div>
        <input value={userMessage} 
            placeholder="What do you want to know?" 
            onChange={e => setUserMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setMessages(prev => [...prev, userMessage]) }}
            className="bg-gray-600 w-5/10 ">
        </input>
    </div>
    </>)
}