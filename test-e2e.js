const { summarizeYoutubeVideo } = require('./lib/actions');

async function test() {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    console.log('Testing summarizeYoutubeVideo with:', testUrl);
    try {
        const result = await summarizeYoutubeVideo(testUrl);
        if (result.success) {
            console.log('SUCCESS!');
            console.log('Result length:', result.data.length);
            console.log('Preview:', result.data.substring(0, 200) + '...');
        } else {
            console.error('FAILED:', result.error);
        }
    } catch (err) {
        console.error('CRITICAL ERROR:', err);
    }
}

test();
