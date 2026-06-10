import { InferenceClient } from "@huggingface/inference"
import { json } from "stream/consumers";

export async function POST(request: Request) {
    // console.log('hit post on api/llm')
    const body = await request.json()
    const {messages, time, value, selectedPoints} = body

    //initiliaze new client object using my hugging face token from .env
    const client = new InferenceClient(process.env.HF_KEY);

    //time/value come from a double-click, selectedPoints from a marquee drag — either may be absent
    const points: {time: string, value: number}[] = selectedPoints ?? []
    const singlePoint = value ? `Date of SP500: ${time}, Value of SP500 on that date: ${value.value}` : ''
    const rangeText = points.length ? `SP500 date range: ${points[0].time} to ${points.at(-1)!.time}` : ''

    const embedMessage = [messages.at(-1).content, singlePoint, rangeText].filter(Boolean).join('. ')
    console.log(embedMessage)

    //embed user query here//
    const query_matches = await fetch(`${process.env.BACKEND_ENDPOINT}/query_matches`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            message: embedMessage
        })
    })

    //retrieve top 3 most relevant chunks//
    const {matches} = await query_matches.json()
    console.log(matches)

    //downsample large selections to at most ~100 points so the prompt stays small
    const step = Math.max(1, Math.ceil(points.length / 100))
    const pointsText = points.filter((_, i) => i % step === 0).map(p => `${p.time}:${p.value}`).join(', ')
    const dataContext = [
        singlePoint,
        pointsText ? `Selected SP500 datapoints (date:value): ${pointsText}` : ''
    ].filter(Boolean).join('\n')

    const stream = client.chatCompletionStream({
        model: "deepseek-ai/DeepSeek-V4-Flash:novita",
        messages: [
            {
                role: "system",
                content: "You are a financial analyst who has understanding of macro economics. Basically the policies and historical events that have affected every economic market. Use the context in your answer, and put quotations around the most relevant sections of the given context, citing wikipedia. Keep your answers short and direct."
            },
            {
                role: "user",
                content: `CONTEXT:\n${matches.map(m => m.content).join('\n\n')}`
            },
            ...messages,
            {
                role: "user",
                content: dataContext
            }
        ]
    })

    const encoder = new TextEncoder()
    const stream_body = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream){
                const text = chunk.choices[0]?.delta?.content
                if (text) controller.enqueue(encoder.encode(text))
            }
            controller.close()
        }}
    )

    return new Response(stream_body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
    })
};