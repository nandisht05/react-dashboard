import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Activity, CreditCard, DollarSign, Users, Folder, Star, Lock } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="container py-20 max-w-screen-lg text-center space-y-8">
                        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                            <Lock className="h-8 w-8 text-orange-600" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">User Dashboard</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Manage your projects, view analytics, and control your subscription from one central hub.
                        </p>

                        <div className="grid gap-8 md:grid-cols-3 py-10 text-left">
                            <Card className="border-orange-100">
                                <CardHeader>
                                    <CardTitle className="text-orange-600">Real-time Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Monitor your revenue, sales, and user growth with live data updates.
                                </CardContent>
                            </Card>
                            <Card className="border-orange-100">
                                <CardHeader>
                                    <CardTitle className="text-orange-600">Project Management</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Track status, collaborators, and deadlines for all your active initiatives.
                                </CardContent>
                            </Card>
                            <Card className="border-orange-100">
                                <CardHeader>
                                    <CardTitle className="text-orange-600">Subscription Control</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Manage your billing cycle, upgrade plans, and view invoice history easily.
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-x-4">
                            <Link href="/login">
                                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">Log In to View</Button>
                            </Link>
                            <Link href="/signup">
                                <Button variant="outline" size="lg" className="text-orange-600 border-orange-200 hover:bg-orange-50">Create Account</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const projects = [
        { name: "Website Redesign", status: "Active", lastUpdated: "2 mins ago", role: "Owner" },
        { name: "Mobile App API", status: "In Progress", lastUpdated: "1 hour ago", role: "Contributor" },
        { name: "Documentation", status: "Completed", lastUpdated: "1 day ago", role: "Viewer" },
        { name: "Analytics Dashboard", status: "Active", lastUpdated: "3 days ago", role: "Owner" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="container py-10 max-w-screen-xl space-y-8">
                <div className="flex items-center justify-between border-b pb-4 border-orange-100">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-orange-600">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Welcome back, {session.user.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button className="bg-orange-500 hover:bg-orange-600">New Project</Button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                            <Users className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            <CreditCard className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-muted-foreground">+19% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                            <Activity className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+573</div>
                            <p className="text-xs text-muted-foreground">+201 since last hour</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-7">
                    {/* Projects Table */}
                    <Card className="col-span-4 border-orange-200">
                        <CardHeader>
                            <CardTitle>Recent Projects</CardTitle>
                            <CardDescription>
                                Manage your ongoing work.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {projects.map((project, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg border-orange-50 bg-orange-50/30">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-orange-100 rounded-full">
                                                <Folder className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{project.name}</p>
                                                <p className="text-xs text-muted-foreground">Updated {project.lastUpdated}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account & Activity Section */}
                    <div className="col-span-3 space-y-4">
                        <Card className="border-orange-200">
                            <CardHeader>
                                <CardTitle>Quick Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-orange-50">
                                    <span className="text-sm font-medium text-muted-foreground">User Role</span>
                                    <span className="font-medium capitalize">{session.user.role}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-orange-50">
                                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                                    <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Active</span>
                                </div>
                                <div className="pt-2">
                                    <form
                                        action={async () => {
                                            'use server';
                                            await signOut();
                                        }}
                                    >
                                        <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">Sign Out</Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-600 text-white border-none">
                            <CardHeader>
                                <CardTitle className="text-white">Pro Plan</CardTitle>
                                <CardDescription className="text-orange-100">You are on the premium tier.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="h-5 w-5 text-yellow-300" fill="currentColor" />
                                    <span className="font-bold">Unlimited Access</span>
                                </div>
                                <Button variant="secondary" className="w-full bg-white text-orange-600 hover:bg-orange-50">Manage Subscription</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
