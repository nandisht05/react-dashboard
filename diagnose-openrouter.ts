import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

const modelsToTest = [
    'stepfun/step-3.5-flash:free',
    'google/gemma-3-12b-it:free',
    'qwen/qwen3-coder:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'z-ai/glm-4.5-air:free',
    'meta-llama/llama-3.3-70b-instruct:free'
];

async function testModel(model: string, prompt: string) {
    console.log(`\n--- Testing Model: ${model} ---`);
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.log(`[FAIL] ${model}: ${JSON.stringify(error.error || error)}`);
            return false;
        }

        const data: any = await response.json();
        console.log(`[SUCCESS] ${model}: ${data.choices[0].message.content.substring(0, 50)}...`);
        return true;
    } catch (err: any) {
        console.log(`[ERROR] ${model}: ${err.message}`);
        return false;
    }
}

async function runDiagnostics() {
    console.log("Starting OpenRouter Diagnostics...");
    console.log(`API Key Length: ${apiKey.length}, starts with: ${apiKey.substring(0, 10)}`);

    console.log("\nPhase 1: Simple Hello (Validation)");
    for (const model of modelsToTest) {
        await testModel(model, "Say hello!");
    }

    console.log("\nPhase 2: Short Transcript (500 chars)");
    const shortTranscript = "This is a video about the history of the internet. It started as ARPANET...".repeat(10);
    for (const model of modelsToTest) {
        await testModel(model, `Provide a 3-bullet point summary of this transcript:\n\n${shortTranscript}`);
    }
}

runDiagnostics();
