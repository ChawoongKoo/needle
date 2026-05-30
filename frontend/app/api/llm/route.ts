import { InferenceClient } from "@huggingface/inference"
import { json } from "stream/consumers";

export async function POST(request: Request) {
    // console.log('hit post on api/llm')
    const body = await request.json()
    const {messages, time, value} = body
    
    //initiliaze new client object using my hugging face token from .env
    const client = new InferenceClient(process.env.HF_KEY);

    //embed user query here//
    const query_matches = await fetch(`${process.env.BACKEND_ENDPOINT}/query_matches`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            message: `${messages.at(-1).content} Date: ${time} Value: ${value}`
        })
    })

    //retrieve top 3 most relevant chunks//
    const {matches} = await query_matches.json()
    console.log(matches)

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
                content: `Date: ${time}, SP500 Value:${value.value}`
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