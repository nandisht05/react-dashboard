import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { summarizeYoutubeVideo } from './lib/actions';

async function test() {
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick roll
    console.log(`[TEST] Testing Gemini with URL: ${videoUrl}`);

    // Check if key starts with AIza
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    if (!key.startsWith('AIza')) {
        console.error('[TEST] ERROR: API Key does not start with AIza. Current key starts with:', key.substring(0, 5));
        return;
    }
    console.log('[TEST] API Key format is correct (starts with AIza).');

    try {
        const result = await summarizeYoutubeVideo(videoUrl);
        if (result.success) {
            console.log('[TEST] SUCCESS!');
            console.log('[TEST] SUMMARY PREVIEW:', result.data.substring(0, 500));
        } else {
            console.log('[TEST] FAILED:', result.error);
        }
    } catch (error: any) {
        console.log('[TEST] CRASHED:', error.message);
    }
}

test();
