import 'dotenv/config';

console.log('GOOGLE_GENERATIVE_AI_API_KEY:', process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
console.log('Key length:', key.length);
console.log('Key start:', key.substring(0, 10));
