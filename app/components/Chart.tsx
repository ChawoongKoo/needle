"use client"
import { AreaSeries, createChart, ColorType, IChartApi } from "lightweight-charts"
import { useEffect, useRef, useState } from "react"

async function getSP500Data() {
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
        const containerRef = useRef<HTMLDivElement>(null)
        const [response, setResponse] = useState("")

        useEffect(() => {
            let chart: IChartApi//create the chart so that it can be removed later in the cleanup function

            async function init() {//async since we need to fetch sp500 data
                if (!containerRef.current) return
                
                //set up chart//
                const chartOptions = { layout: { textColor: 'black', background: { type: ColorType.Solid, color: 'white' }, attributionLogo: false } };
                chart = createChart(containerRef.current, chartOptions)

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
                chart.subscribeClick(async (param) =>{//adds a chart click listener
                    if (!param.time) return
                    // console.log(param.time);//param.time is the time at the click

                    const res = await fetch("/api/llm", {//API CALL HERE. fetch message
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({time: param.time, value: param.seriesData.get(areaSeries)})
                    });
                    
                    const llm_response = await res.json();//get response
                    setResponse(llm_response);
                    console.log(llm_response)
                });
            }
            init()//call the async function since useeffect can't be async

            return () => chart.remove()//cleanup function for chart.
        }, [])

    return <div ref={containerRef} className="w-full h-full" />
}