import { InferenceClient } from "@huggingface/inference"

export async function POST(request: Request) {
    console.log('hit post on api/llm')
    const body = await request.json()
    const {messages, time, value} = body
    
    //initiliaze new client object using my hugging face token from .env
    const client = new InferenceClient(process.env.HF_KEY);

    const res = await client.chatCompletion({
        model: "deepseek-ai/DeepSeek-V4-Flash:novita",
        messages: [
            {
                role: "system",
                content: "You are a financial analyst who has understanding of macro economics. Basically the policies and historical events that have affected every economic market. Keep your answers short and direct."
            },
            ...messages,
            {
                role: "user",
                content: `Date: ${time}, SP500 Value:${value.value}`
            }
        ]
    })

    return Response.json(res.choices[0].message)
};