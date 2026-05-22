"use client"
import { AreaSeries, createChart, ColorType, IChartApi } from "lightweight-charts"
import { useEffect, useRef, useState } from "react"
import { useDashboardContext } from "../contexts/DashboardContext"

async function getSP500Data() {//this gets the sp500 data from the kaggle csv
    const res = await fetch('/sp500_index.csv')
    const text = await res.text()

    const data = text
    .trim()
    .split('\n')
    .slice(1)                          // skip header row
    .map(line => {
        const [date, value] = line.split(',')
        return { time: date, value: parseFloat(value) }
    })
    return data
};

export default function Chart () {
        const context = useDashboardContext()
        if (!context) {return}

        const {setMessages, loading, setLoading, timeValue, setTimeValue} = context

        //create a reference for this container to refer to the dom element it sends.
        const chartContainerRef = useRef<HTMLDivElement>(null)


        //states related to input bar
        const [showInput, setShowInput] = useState(false)
        const [inputPos, setInputPos] = useState<{x: number, y: number} | null>(null)

        //states related to information sent to llm
        const [userMessage, setUserMessage] = useState("")

        //state for llm message
        const [LLMResponse, setLLMResponse] = useState("")


        async function sendUserMessage() {
            if (!timeValue) return;
            if (!userMessage) {setUserMessage(""); console.log("no user message"); return;}
            
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



        useEffect(() => {
            let chart: IChartApi//create the chart so that it can be removed later in the cleanup function

            async function init() {//async since we need to fetch sp500 data
                if (!chartContainerRef.current) return
                
                //set up chart//
                const chartOptions = { layout: { textColor: 'black', background: { type: ColorType.Solid, color: 'white' }, attributionLogo: false } };
                chart = createChart(chartContainerRef.current, chartOptions)

                const areaSeries = chart.addSeries(AreaSeries, {
                    lineColor: '#2962FF', topColor: '#2962FF',
                    bottomColor: 'rgba(41, 20, 255, 0.28)',
                });
                

                //Set the data//
                const sp500data = await getSP500Data();
                
                areaSeries.setData(sp500data);
                chart.timeScale().fitContent();//fits the data to time scale

                //LLM call//
                //On click, i want llm call
                chart.subscribeDblClick(async (param) =>{//adds a chart click listener
                    if (!param.time) return
                    if (!param.point) {setShowInput(false); return;}

                    //on double click, show the input bar, set the time and value, and set the user's message
                    setShowInput(true)
                    setInputPos({ x: param.point.x, y: param.point.y })
                    setTimeValue({time: param.time, value: param.seriesData.get(areaSeries)})
                });
            }
            init()//call the async function since useeffect can't be async

            return () => chart.remove()//cleanup function for chart.
        }, [])



    return <>
        <div ref={chartContainerRef} className="relative w-full h-full" />
        {showInput && inputPos && <div className="text-red-300 absolute z-10" style={{ left: inputPos.x, top: inputPos.y }}>
            <input value={userMessage} placeholder="What would you like to know?" 
            onChange={e => setUserMessage(e.target.value)} 
            className="bg-white border border-black p-1 w-57 text-black"/>

            <button onClick={sendUserMessage} disabled={loading}>{
                loading ? "Thinking..." : "Ask"
            }</button>
        </div>}
    </>
}