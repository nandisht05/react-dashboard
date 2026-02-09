'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate a delay for form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        alert('Project created successfully! (Mock Action)');
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container py-10 max-w-screen-md space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-orange-600">Create New Project</h1>
                        <p className="text-muted-foreground mt-1">Fill in the details below to start your next initiative.</p>
                    </div>
                </div>

                <Card className="border-orange-100 shadow-md">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="bg-orange-50/50 border-b border-orange-100">
                            <CardTitle>Project Information</CardTitle>
                            <CardDescription>
                                Be as descriptive as possible to help your team understand the goal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="name">
                                    Project Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Q4 Marketing Campaign"
                                    required
                                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="description">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Briefly describe the project goals and scope..."
                                    className="min-h-[150px] border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-orange-50/30 border-t border-orange-100 flex justify-between p-6">
                            <Link href="/dashboard">
                                <Button variant="outline" type="button" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 gap-2"
                                disabled={isSubmitting}
                            >
                                <PlusCircle className="h-4 w-4" />
                                {isSubmitting ? 'Creating...' : 'Create Project'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
