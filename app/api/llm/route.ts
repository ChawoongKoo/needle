import { InferenceClient } from "@huggingface/inference"

export async function POST(request: Request) {
    console.log('hit post on api/llm')
    const body = await request.json()
    const {userMessage, time, value} = body
    
    //initiliaze new client object using my hugging face token from .env
    const client = new InferenceClient(process.env.HF_KEY);

    const res = await client.chatCompletion({
        model: "deepseek-ai/DeepSeek-V4-Flash:novita",
        messages: [
            {
                role: "system",
                content: "You are a financial analyst who has understanding of macro economics. Basically the policies and historical events that have affected every economic market. Keep your answers short and direct."
            },
            {
                role: "user",
                content: `${userMessage}: ${time} ${value.value}`
            }
        ]
    })

    return Response.json(res.choices[0].message)
};