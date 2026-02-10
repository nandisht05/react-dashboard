'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Youtube, Sparkles, Loader2, BookOpen, Clock, Lightbulb } from 'lucide-react';
import { summarizeYoutubeVideo } from '@/lib/actions';

export default function DashboardPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await summarizeYoutubeVideo(url);
            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.error || 'Failed to summarize video');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="container max-w-4xl py-12 px-4 md:py-20 space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Learning</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        YouTube into Study Notes
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Paste a YouTube link and get a comprehensive summary with structured study notes in seconds.
                    </p>
                </div>

                {/* Search Bar Section */}
                <Card className="border-orange-500/20 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
                    <CardContent className="pt-8 pb-8 px-6 md:px-12">
                        <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-orange-500/50 focus:border-orange-500 rounded-xl text-lg"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || !url}
                                className="h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Generate Notes
                                        <Sparkles className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                        {error && (
                            <p className="mt-4 text-red-400 text-sm text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                                {error}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Features / Empty State */}
                {!result && !loading && (
                    <div className="grid md:grid-cols-3 gap-6 pt-8">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/[0.07] transition-colors">
                            <Clock className="w-10 h-10 text-orange-500" />
                            <h3 className="text-lg font-bold">Save Hours</h3>
                            <p className="text-sm text-gray-400">Watch 10-minute videos in 30 seconds of reading time.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/[0.07] transition-colors">
                            <BookOpen className="w-10 h-10 text-orange-500" />
                            <h3 className="text-lg font-bold">Structured Notes</h3>
                            <p className="text-sm text-gray-400">Get organized takeaways ready for obsidian, notion or your favorite app.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/[0.07] transition-colors">
                            <Lightbulb className="w-10 h-10 text-orange-500" />
                            <h3 className="text-lg font-bold">Key Definitions</h3>
                            <p className="text-sm text-gray-400">Complex terms explained simply as they appear in the video.</p>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {result && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-orange-500" />
                                AI Study Companion
                            </h2>
                            <Button variant="outline" className="text-white border-white/10 hover:bg-white/10" onClick={() => window.print()}>
                                Export PDF
                            </Button>
                        </div>

                        <Card className="bg-black/40 border-white/10 text-white shadow-xl">
                            <CardContent className="p-8 md:p-12 prose prose-invert max-w-none">
                                <div className="space-y-6 text-gray-200 leading-relaxed whitespace-pre-wrap">
                                    {result}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
