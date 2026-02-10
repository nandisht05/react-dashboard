'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './schema';
import { eq, sql } from 'drizzle-orm';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Innertube } from 'youtubei.js';

export type SummarizeResult =
    | { success: true; data: string }
    | { success: false; error: string };

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
const isOpenRouter = apiKey.startsWith('sk-or-');
const genAI = !isOpenRouter ? new GoogleGenerativeAI(apiKey) : null;

async function openRouterRequest(
    messages: any[],
    model = 'google/gemma-3-12b-it:free'
) {
    const fallbackModels = [
        'google/gemma-3-12b-it:free',
        'mistralai/mistral-small-3.1-24b-instruct:free',
        'google/gemma-3-4b-it:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'qwen/qwen3-coder:free'
    ];

    let lastError: any = null;
    const modelsToTry = [model, ...fallbackModels.filter(m => m !== model)];

    for (const currentModel of modelsToTry) {
        try {
            console.log(`[OpenRouter] Attempting with model: ${currentModel}`);
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://github.com/nandisht05/react-dashboard',
                    'X-Title': 'YouTube Summarizer',
                },
                body: JSON.stringify({
                    model: currentModel,
                    messages: messages
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.warn(`[OpenRouter] Model ${currentModel} failed:`, error.error?.message);
                lastError = error;
                continue; // Try next model
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (err) {
            console.error(`[OpenRouter] Network error with ${currentModel}:`, err);
            lastError = err;
        }
    }

    throw new Error(lastError?.error?.message || lastError?.message || 'OpenRouter API failed after all fallbacks');
}

async function retryWithExponentialBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> {
    let retries = 0;
    while (true) {
        try {
            return await fn();
        } catch (error: any) {
            // Check if it's a 429 Rate Limit error
            const isRateLimit = error.message?.includes('429') || error.status === 429;

            if (isRateLimit && retries < maxRetries) {
                const delay = initialDelay * Math.pow(2, retries);
                console.warn(`[AI] Quota hit (429). Retrying in ${delay}ms... (Attempt ${retries + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retries++;
                continue;
            }
            throw error;
        }
    }
}

const SignupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function signup(prevState: string | undefined, formData: FormData) {
    const customObject = Object.fromEntries(formData.entries());
    const parsed = SignupSchema.safeParse(customObject);

    if (!parsed.success) {
        return 'Invalid fields';
    }

    const { name, email, password } = parsed.data;

    try {
        console.log(`[SIGNUP DEBUG] Attempting signup for: ${email}`);

        const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const existingUser = existingUsers[0];

        if (existingUser) {
            console.log(`[SIGNUP DEBUG] Email already exists: ${email}`);
            return 'Email already in use';
        }

        console.log(`[SIGNUP DEBUG] Hashing password...`);

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if it's the first user
        const userCountResult = await db.select({ count: sql<number>`count(*)` }).from(users);
        const userCount = Number(userCountResult[0]?.count ?? 0);

        const isFirstUser = userCount === 0;

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role: isFirstUser ? 'admin' : 'user',
            isApproved: true, // Auto-approve all users
        });

        console.log(`[SIGNUP DEBUG] User created successfully. Auto-approved.`);
        return 'Success';

    } catch (error) {
        console.error('Signup error:', error);
        return 'Failed to create user';
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/welcome',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function approveUser(formData: FormData) {
    const email = formData.get('email') as string;
    try {
        await db.update(users).set({ isApproved: true }).where(eq(users.email, email));
        revalidatePath('/admin');
    } catch (error) {
        console.error('Failed to approve user:', error);
    }
}

export async function summarizeYoutubeVideo(videoUrl: string): Promise<SummarizeResult> {
    if (!videoUrl) {
        throw new Error('Video URL is required');
    }

    try {
        // Highly robust Regex for Video ID (supports shorts, live, embed, watch, youtu.be, mobile)
        const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live|vi?)\/|.*[?&]v(?:i)?=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) {
            console.error(`[AI] Invalid URL received: ${videoUrl}`);
            throw new Error('Invalid YouTube URL format. Please ensure it is a direct video, shorts, or live link.');
        }

        let contentToAnalyze = '';
        let contentType: 'transcript' | 'audio' = 'transcript';
        let videoTitle = 'YouTube Video';
        let videoDescription = '';
        let youtube: any = null;

        // Step 0: Metadata Fetch (Reliable)
        try {
            console.log(`[AI] Fetching metadata for: ${videoId}`);
            youtube = await Innertube.create();
            const info = await youtube.getInfo(videoId);
            videoTitle = info.basic_info.title || videoTitle;
            videoDescription = info.basic_info.short_description || info.basic_info.description || '';
        } catch (e: any) {
            console.warn(`[AI] Metadata fetch failed: ${e.message}`);
        }

        // Layer 1: Manual HTML Extraction
        console.log(`[AI] Layer 1: Attempting manual HTML extraction for: ${videoId}`);
        try {
            const url = `https://www.youtube.com/watch?v=${videoId}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            });
            const html = await response.text();
            const match = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
            if (match) {
                const playerResponse = JSON.parse(match[1]);
                const tracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
                if (tracks && tracks.length > 0) {
                    const transcriptUrl = tracks[0].baseUrl;
                    const tResponse = await fetch(transcriptUrl);
                    const tXml = await tResponse.text();
                    contentToAnalyze = tXml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    if (contentToAnalyze) console.log('[AI] Layer 1 success: Transcript extracted manually.');
                }
            }
        } catch (e: any) {
            console.warn(`[AI] Layer 1 failed: ${e.message}`);
        }

        // Layer 2: Fast Scraper
        if (!contentToAnalyze) {
            console.log(`[AI] Layer 2: Attempting scraper for: ${videoId}`);
            try {
                const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
                contentToAnalyze = transcriptItems.map(item => item.text).join(' ');
                if (contentToAnalyze) console.log('[AI] Layer 2 success: Transcript found.');
            } catch (e: any) {
                console.warn(`[AI] Layer 2 failed: ${e.message}`);
            }
        }

        // Layer 3: youtubei.js Transcript
        if (!contentToAnalyze && youtube) {
            console.log(`[AI] Layer 3: Attempting youtubei.js transcript for: ${videoId}`);
            try {
                const info = await youtube.getInfo(videoId);
                const transcriptData = await info.getTranscript();
                if (transcriptData && transcriptData.transcript?.content?.body?.initial_segments) {
                    contentToAnalyze = transcriptData.transcript.content.body.initial_segments
                        .map((segment: any) => segment.snippet?.text || '')
                        .join(' ');
                    console.log('[AI] Layer 3 success: youtubei.js transcript extracted.');
                }
            } catch (e: any) {
                console.warn(`[AI] Layer 3 failed: ${e.message}`);
            }
        }

        // Layer 4: Audio Transcription
        if (!contentToAnalyze && youtube) {
            console.log(`[AI] Layer 4: Falling back to Audio Transcription for: ${videoId}`);
            try {
                let info = await youtube.getInfo(videoId);
                let format = info.chooseFormat({ type: 'audio', quality: 'best' });
                if (format) {
                    console.log('[AI] Layer 4: Found audio format. Fetching chunk...');
                    const stream = await youtube.download(videoId, { type: 'audio', quality: 'best' });
                    const reader = stream.getReader();
                    let bytesRead = 0;
                    const chunks: Uint8Array[] = [];
                    while (bytesRead < 10000000) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        chunks.push(value);
                        bytesRead += value.length;
                    }
                    contentToAnalyze = Buffer.concat(chunks).toString('base64');
                    contentType = 'audio';
                    console.log(`[AI] Layer 4 success: ${bytesRead} bytes of audio fetched.`);
                }
            } catch (e: any) {
                console.warn(`[AI] Layer 4 failed: ${e.message}`);
            }
        }

        // Layer 5: Metadata Fallback (The "Never Fail" Layer)
        if (!contentToAnalyze) {
            console.log('[AI] Layer 5: Ultimate Fallback to Metadata.');
            contentToAnalyze = `Video Title: ${videoTitle}\n\nDescription:\n${videoDescription}`;
            contentType = 'transcript';
            console.log('[AI] Layer 5 success: Meta-info provided to AI.');
        }

        let text = '';
        const systemPrompt = `
You are an elite educational assistant. I will provide a transcript of a YouTube video.
Your task is to:
1. Provide a concise high-level summary of the video.
2. Generate clean, structured study notes.
3. Highlight key takeaways, important definitions, and any actionable insights.
4. Use professional, clear formatting with Markdown.
`;

        if (isOpenRouter) {
            console.log(`[AI] Generating result with OpenRouter...`);
            const userPrompt = contentType === 'transcript'
                ? `Transcript:\n${contentToAnalyze.substring(0, 50000)}`
                : `Please analyze the provided audio content.`;

            text = await retryWithExponentialBackoff(() => openRouterRequest([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]));
        } else if (genAI) {
            console.log(`[AI] Generating result with Gemini SDK...`);

            const geminiModels = [
                'gemini-1.5-flash',
                'gemini-1.5-pro',
                'gemini-2.0-flash-exp',
                'gemini-pro'
            ];

            let lastGeminiError: any = null;
            let success = false;

            for (const modelName of geminiModels) {
                try {
                    console.log(`[Gemini] Attempting with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    let result;

                    if (contentType === 'transcript') {
                        const prompt = `${systemPrompt}\n\nTranscript:\n${contentToAnalyze.substring(0, 50000)}`;
                        result = await retryWithExponentialBackoff(() => model.generateContent(prompt));
                    } else {
                        // Audio input
                        const prompt = `${systemPrompt}\n\nPlease listen to this video audio and follow the instructions.`;
                        result = await retryWithExponentialBackoff(() => model.generateContent([
                            prompt,
                            {
                                inlineData: {
                                    mimeType: "audio/mp3",
                                    data: contentToAnalyze
                                }
                            }
                        ]));
                    }
                    text = result.response.text();
                    success = true;
                    break; // Success!

                } catch (error: any) {
                    console.warn(`[Gemini] Model ${modelName} failed:`, error.message);
                    lastGeminiError = error;
                }
            }

            if (!success) {
                throw new Error(lastGeminiError?.message || 'All Gemini models failed.');
            }
        }

        return {
            success: true,
            data: text
        };

    } catch (error: any) {
        console.error('Summarization error:', error);

        // Specific handling for Quota Exceeded
        if (error.message?.includes('429') || error.status === 429) {
            return {
                success: false,
                error: 'AI Quota Exceeded: The free tier of the AI has reached its limit. Please wait a minute and try again, or use a smaller video.'
            };
        }

        return {
            success: false,
            error: error.message || 'Failed to summarize video'
        };
    }
}
