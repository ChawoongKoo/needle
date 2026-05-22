"use client"
import { useState, useEffect } from "react";
import type { Time, CustomData, BarData, LineData,  HistogramData } from "lightweight-charts"

type TimeValue = { time: Time; value: CustomData<Time> | BarData<Time> | LineData<Time> | HistogramData<Time> | undefined } | null

export default function ChatBox({messages, setMessages, loading, setLoading, timeValue, setTimeValue}: {messages: string[], setMessages: React.Dispatch<React.SetStateAction<string[]>>, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>>, timeValue: TimeValue, setTimeValue: React.Dispatch<React.SetStateAction<TimeValue>>}) {

    async function sendUserMessage() {

        if (!userMessage) {setUserMessage(""); console.log("no user message"); return;}
        if (!timeValue) {return}


        setMessages(prev => [...prev, userMessage])
        setLoading(true)

        const res = await fetch("/api/llm", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userMessage: userMessage, time: timeValue.time, value: timeValue.value})
        });

        setLoading(false)
        setUserMessage("")

        const llm_response = await res.json();//get response
        setLLMResponse(llm_response);
        setMessages(prev => [...prev, llm_response.content])
        console.log(llm_response.content)
        console.log("Sent llm response")
        console.log(llm_response)
    };


    //states related to information sent to llm
    const [userMessage, setUserMessage] = useState<string>("")

    //state for llm message
    const [LLMresponse, setLLMResponse] = useState("")

    return (
    <>
    <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="bg-gray-400 w-full h-full">
            <div className="overflow-y-auto h-full">
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
        </div>
        <input value={userMessage} 
            placeholder="What do you want to know?" 
            disabled={loading}
            onChange={e => setUserMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendUserMessage() }}
            className="bg-gray-600 w-5/10 ">
        </input>
    </div>
    </>)
}