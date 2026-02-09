'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Settings, Shield, Bell, Database, Globe, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container py-10 max-w-screen-xl space-y-8">
                <div className="flex items-center gap-4 border-b border-orange-100 pb-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-orange-600">Admin Settings</h1>
                        <p className="text-muted-foreground mt-1">Configure global application parameters and security policies.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    {/* Sidebar Nav */}
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start gap-2 bg-orange-100 text-orange-900 border-none">
                            <Globe className="h-4 w-4" /> General
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-orange-600 hover:bg-orange-50">
                            <Shield className="h-4 w-4" /> Security
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-orange-600 hover:bg-orange-50">
                            <Bell className="h-4 w-4" /> Notifications
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-orange-600 hover:bg-orange-50">
                            <Database className="h-4 w-4" /> Data Management
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3 space-y-6">
                        <Card className="border-orange-100">
                            <CardHeader>
                                <CardTitle>Platform Configuration</CardTitle>
                                <CardDescription>Manage your application's basic settings and defaults.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-orange-50">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Maintenance Mode</div>
                                        <div className="text-sm text-muted-foreground">Disable public access while performing updates.</div>
                                    </div>
                                    {/* Mock Toggle */}
                                    <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-orange-50">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">User Signups</div>
                                        <div className="text-sm text-muted-foreground">Allow new users to create accounts on the platform.</div>
                                    </div>
                                    {/* Mock Toggle - Active */}
                                    <div className="w-10 h-6 bg-orange-600 rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Default User Role</div>
                                        <div className="text-sm text-muted-foreground">New accounts will be assigned this role by default.</div>
                                    </div>
                                    <select className="border border-orange-100 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                                        <option>User (Standard)</option>
                                        <option>Viewer</option>
                                        <option>Manager</option>
                                    </select>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-orange-50/30 justify-end">
                                <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
                                    <Save className="h-4 w-4" /> Save Changes
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="border-red-100 bg-red-50/20">
                            <CardHeader>
                                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                <CardDescription>Irreversible actions for system management.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                    Clear System Cache
                                </Button>
                                <p className="text-xs text-red-400 mt-2">This will force all users to re-login and may impact performance temporarily.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
