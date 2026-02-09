import { auth } from '@/auth';
import { getRecentUsers, getUserStats } from '@/lib/data';
import { approveUser } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Users, UserCheck, Clock, FileText, AlertCircle, CheckCircle, Shield, BarChart3, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPage() {
    const session = await auth();

    // Public View (Not logged in or not admin)
    if (!session?.user || session.user.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="container py-20 max-w-screen-lg text-center space-y-8">
                        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                            <Shield className="h-8 w-8 text-orange-600" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white">Admin Console</h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            Centralized control for user management, system security, and operational oversight.
                        </p>

                        <div className="grid gap-8 md:grid-cols-3 py-10 text-left">
                            <Card className="border-orange-100">
                                <CardHeader>
                                    <CardTitle className="text-orange-600 flex items-center gap-2">
                                        <Users className="h-5 w-5" /> User Management
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Approve new registrations, manage roles, and suspend accounts with one click.
                                </CardContent>
                            </Card>
                            <Card className="border-orange-100">
                                <CardHeader>
                                    <CardTitle className="text-orange-600 flex items-center gap-2">
                                        <LockKeyhole className="h-5 w-5" /> Security Logs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Full audit trails of all system access, login attempts, and critical data changes.
                                </CardContent>
                            </Card>
                            <Card className="border-orange-100">
                                <CardHeader>
                                    <CardTitle className="text-orange-600 flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" /> Usage Reporting
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    High-level insights into platform usage, growth metrics, and active sessions.
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-x-4">
                            {session?.user ? (
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg inline-block">
                                    <p className="text-orange-800 font-medium">You are logged in as {session.user.role}.</p>
                                    <p className="text-sm text-orange-600">This area is restricted to Administrators.</p>
                                </div>
                            ) : (
                                <Link href="/login">
                                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600">Admin Login</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Admin View
    const recentUsers = await getRecentUsers();
    const stats = await getUserStats();

    const logs = [
        { action: "User Login", user: "admin@example.com", time: "2 mins ago", status: "Success" },
        { action: "Database Backup", user: "System", time: "1 hour ago", status: "Success" },
        { action: "Failed Login Attempt", user: "unknown@ip-102", time: "2 hours ago", status: "Warning" },
        { action: "User Approved", user: "admin@example.com", time: "5 hours ago", status: "Success" },
        { action: "Schema Update", user: "System", time: "1 day ago", status: "Success" },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container py-10 max-w-screen-xl space-y-8">
                <div className="flex items-center justify-between border-b border-orange-100 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-orange-600">Admin Console</h1>
                        <p className="text-muted-foreground mt-1">System Overview & Management</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/settings">
                            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">Settings</Button>
                        </Link>
                        <Button className="bg-orange-500 hover:bg-orange-600">Invite User</Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">Registered accounts</p>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved}</div>
                            <p className="text-xs text-muted-foreground">Full access granted</p>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-100 shadow-sm bg-orange-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-800">Pending Approvals</CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-700">{stats.pending}</div>
                            <p className="text-xs text-orange-600/80">Requires immediate attention</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Recent Users */}
                    <Card className="col-span-2 border-orange-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>Latest registrations on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentUsers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                                    <CheckCircle className="h-10 w-10 text-green-400 mb-2" />
                                    <p>No recent user activity.</p>
                                </div>
                            ) : (
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b border-orange-100 transition-colors hover:bg-muted/50">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {recentUsers.map((user) => (
                                                <tr key={user.id} className="border-b border-orange-50 transition-colors hover:bg-orange-50/50">
                                                    <td className="p-4 align-middle font-medium">{user.name}</td>
                                                    <td className="p-4 align-middle">{user.email}</td>
                                                    <td className="p-4 align-middle text-muted-foreground capitalize">{user.role}</td>
                                                    <td className="p-4 align-middle text-right">
                                                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                                            Active
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* System Logs */}
                    <Card className="border-orange-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>System Logs</CardTitle>
                            <CardDescription>Recent system events.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-orange-50 last:border-0 last:pb-0">
                                        <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm font-medium">{log.action}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{log.user}</span>
                                                <span>•</span>
                                                <span>{log.time}</span>
                                            </div>
                                        </div>
                                        <div className="ml-auto">
                                            {log.status === 'Warning' ? (
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
