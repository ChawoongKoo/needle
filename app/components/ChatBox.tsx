"use client"
import { useState } from "react";
import { useDashboardContext } from "../contexts/DashboardContext";

export default function ChatBox() {
    const context = useDashboardContext()
    if (!context) return;
    const {messages, setMessages, loading, setLoading, timeValue, sendUserMessage} = context

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
            onKeyDown={e => { if (e.key === 'Enter') sendUserMessage( userMessage, setUserMessage ) }}
            className="bg-gray-600 w-5/10 ">
        </input>
    </div>
    </>)
}