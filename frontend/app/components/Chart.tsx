"use client"
import { AreaSeries, LineSeries, createChart, ColorType, IChartApi, ISeriesApi } from "lightweight-charts"
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

        const {loading, setTimeValue, selectedPoints, setSelectedPoints, sendUserMessage} = context

        //create a reference for this container to refer to the dom element it sends.
        const chartContainerRef = useRef<HTMLDivElement>(null)

        //refs so the highlight effect below can reach the series and data created inside init
        const highlightSeriesRef = useRef<ISeriesApi<"Line"> | null>(null)
        const dataRef = useRef<{time: string, value: number}[]>([])


        //states related to input bar
        const [showInput, setShowInput] = useState(false)
        const [inputPos, setInputPos] = useState<{x: number, y: number} | null>(null)

        //states related to information sent to llm
        const [userMessage, setUserMessage] = useState("")

        //marquee selection rectangle drawn while left-click dragging
        const [selectRect, setSelectRect] = useState<{left: number, top: number, width: number, height: number} | null>(null)


        useEffect(() => {
            let chart: IChartApi//create the chart so that it can be removed later in the cleanup function
            const listenerCleanup = new AbortController()//removes the marquee listeners in the cleanup function

            async function init() {//async since we need to fetch sp500 data
                if (!chartContainerRef.current) return
                
                //set up chart//
                const chartOptions = {
                    layout: {
                        textColor: '#94A3B8',
                        background: { type: ColorType.Solid, color: 'transparent' },//let the panel surface show through
                        attributionLogo: false,
                        fontFamily: getComputedStyle(chartContainerRef.current).fontFamily
                    },
                    grid: {
                        vertLines: { color: 'rgba(51, 65, 85, 0.35)' },
                        horzLines: { color: 'rgba(51, 65, 85, 0.35)' }
                    },
                    rightPriceScale: { borderVisible: false },
                    timeScale: { borderVisible: false },
                    autoSize: true,//resize with the panel
                    handleScroll: false, //this removes default scrolling and scaling
                    handleScale: false
                };
                chart = createChart(chartContainerRef.current, chartOptions)

                const areaSeries = chart.addSeries(AreaSeries, {
                    lineColor: '#3B82F6', lineWidth: 2,
                    topColor: 'rgba(59, 130, 246, 0.25)',
                    bottomColor: 'rgba(59, 130, 246, 0)',
                });
                

                //Set the data//
                const sp500data = await getSP500Data();

                areaSeries.setData(sp500data);
                chart.timeScale().fitContent();//fits the data to time scale

                //highlight series drawn on top of the area series to mark the selected datapoints
                highlightSeriesRef.current = chart.addSeries(LineSeries, {
                    color: '#D95926', lineWidth: 3,
                    lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false//hide the extra axis label, price line and crosshair dot this series would add
                })
                dataRef.current = sp500data

                //enable scrolling and scaling//
                //on right click, i want panning
                const ts = chart.timeScale()//timescale object to alter x axis
                chartContainerRef.current.addEventListener('contextmenu', (event) => { event.preventDefault() })

                chartContainerRef.current.addEventListener('mousemove', (event) => {
                    if (event.buttons !== 2) return

                    const delta = event.movementX/ts.options().barSpacing
                    ts.setVisibleLogicalRange({
                        from: ts.getVisibleLogicalRange().from - delta,
                        to: ts.getVisibleLogicalRange().to - delta
                    })
                })

                //Marquee select//
                //on left-click drag, draw a rectangle; on release, select all datapoints inside it
                const el = chartContainerRef.current
                const signal = listenerCleanup.signal
                let isSelecting = false
                let selStartX = 0, selStartY = 0

                el.addEventListener('mousedown', (event) => {
                    if (event.button !== 0) return//left button only, right button pans
                    const rect = el.getBoundingClientRect()
                    isSelecting = true
                    selStartX = event.clientX - rect.left
                    selStartY = event.clientY - rect.top
                }, { signal })

                //move and up live on window so the drag keeps working if the cursor leaves the chart
                window.addEventListener('mousemove', (event) => {
                    if (!isSelecting) return
                    const rect = el.getBoundingClientRect()
                    const x = event.clientX - rect.left
                    const y = event.clientY - rect.top
                    setSelectRect({
                        left: Math.min(selStartX, x),
                        top: Math.min(selStartY, y),
                        width: Math.abs(x - selStartX),
                        height: Math.abs(y - selStartY)
                    })
                }, { signal })

                window.addEventListener('mouseup', (event) => {
                    if (!isSelecting) return
                    isSelecting = false
                    setSelectRect(null)

                    const rect = el.getBoundingClientRect()
                    const x = event.clientX - rect.left
                    const y = event.clientY - rect.top
                    const left = Math.min(selStartX, x), right = Math.max(selStartX, x)
                    const top = Math.min(selStartY, y), bottom = Math.max(selStartY, y)
                    if (right - left < 4 && bottom - top < 4) return//a click, not a drag

                    //a datapoint is selected if its pixel position falls inside the rectangle
                    const selected = sp500data.filter(d => {//converts all datapoints to coords and returns list that only contains data with coords inside the rectangle
                        const px = ts.timeToCoordinate(d.time)
                        const py = areaSeries.priceToCoordinate(d.value)
                        return px !== null && py !== null && px >= left && px <= right && py >= top && py <= bottom
                    })
                    if (selected.length === 0) return//dragged over nothing, so no input box

                    setSelectedPoints(selected)
                    setInputPos({ x, y })
                    setShowInput(true)
                }, { signal })

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

            return () => { listenerCleanup.abort(); chart.remove() }//cleanup function for listeners and chart.
        }, [])

        //redraw the highlight whenever the selection changes; clearing the selection clears the highlight
        useEffect(() => {
            if (!highlightSeriesRef.current) return
            const selectedTimes = new Set(selectedPoints.map(p => p.time))
            //non-selected points become whitespace ({time} only) so the highlight leaves gaps instead of bridging them
            highlightSeriesRef.current.setData(dataRef.current.map(d => selectedTimes.has(d.time) ? d : { time: d.time }))
        }, [selectedPoints])



    return <>
        <div ref={chartContainerRef} className="relative w-full h-full" />
        {selectRect && <div className="absolute border border-blue-400/70 bg-blue-400/10 z-10 pointer-events-none"
            style={{ left: selectRect.left, top: selectRect.top, width: selectRect.width, height: selectRect.height }} />}
        {showInput && inputPos && <div className="absolute z-10 flex gap-2 rounded-xl p-2 shadow-xl shadow-black/40"
            style={{ left: inputPos.x, top: inputPos.y, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <input value={userMessage} placeholder="What would you like to know?"
            onChange={e => setUserMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendUserMessage( userMessage, setUserMessage ) }}
            className="bg-transparent px-2 py-1.5 w-64 text-sm outline-none placeholder:text-slate-500"
            style={{ color: "var(--foreground)" }}/>

            <button
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-default"
            style={{ background: "var(--accent)", color: "#fff" }}
            onClick={() => sendUserMessage(userMessage, setUserMessage)}
            disabled={loading}
            >{
                loading ? "Thinking..." : "Ask"
            }</button>
        </div>}
    </>
}