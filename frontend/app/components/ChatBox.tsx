"use client"
import { useState } from "react";
import { useDashboardContext } from "../contexts/DashboardContext";

export default function ChatBox() {
    const context = useDashboardContext()
    if (!context) return;
    const {messages, loading, sendUserMessage} = context

    //states related to information sent to llm
    const [userMessage, setUserMessage] = useState<string>("")


    return (
    <>
    <div className="w-full h-full flex flex-col items-center justify-end">
        <div className="bg-gray-400 w-full h-full">
            <div className="overflow-y-auto h-full">
                {messages.map((obj, i) => (
                    <div key={i} className={obj.role=== "user" ? "text-right" : "text-left"}>{obj.content}</div>
                ))}
            </div>
        </div>
        <div className="flex w-full text-center">
            <input value={userMessage} 
                placeholder="What do you want to know?" 
                disabled={loading}
                onChange={e => setUserMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendUserMessage( userMessage, setUserMessage ) }}
                className="bg-gray-600 flex-1">
            </input>
            <button 
                className="shrink-0"
                onClick={() => sendUserMessage(userMessage, setUserMessage)}
                disabled={loading}
                >{
                    loading ? "Thinking..." : "Ask"
                }
            </button>
        </div>
    </div>
    </>)
}