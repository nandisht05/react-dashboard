import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import LINK from 'next/link';
import { CheckCircle, ArrowRight, Zap, Shield, BarChart } from 'lucide-react';

export default function WelcomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full text-center space-y-8">

                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                            <CheckCircle className="h-10 w-10 text-orange-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                            Welcome Aboard!
                        </h1>
                        <p className="max-w-xl mx-auto text-xl text-muted-foreground">
                            Your account has been successfully created. We're thrilled to have you with us.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 text-left">
                        <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <Zap className="h-8 w-8 text-orange-500 mb-2" />
                                <CardTitle className="text-lg">Fast Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    Get real-time insights into your project performance and user engagement.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <Shield className="h-8 w-8 text-orange-500 mb-2" />
                                <CardTitle className="text-lg">Secure & Reliable</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    Enterprise-grade security standards ensure your data is always safe.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <BarChart className="h-8 w-8 text-orange-500 mb-2" />
                                <CardTitle className="text-lg">Scalable Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    Tools designed to scale with your business as you reach new heights.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col items-center gap-4">
                        <LINK href="/dashboard">
                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-orange-200 transition-all">
                                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </LINK>
                        <p className="text-sm text-muted-foreground">
                            Need help? <LINK href="#" className="underline hover:text-orange-600">Contact Support</LINK>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
