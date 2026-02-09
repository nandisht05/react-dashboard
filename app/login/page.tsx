'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Eye, EyeOff } from 'lucide-react';

function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                        Password
                    </label>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="********"
                        required
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">Toggle password visibility</span>
                    </Button>
                </div>
            </div>
            <LoginButton />
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <p className="text-sm text-destructive">{errorMessage}</p>
                )}
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" aria-disabled={pending} disabled={pending}>
            Log in
        </Button>
    );
}

export default function LoginPage() {
    return (
        <>
            {/* Optional: Add Navbar here if you want navigation on auth pages, usually cleaner without or minimal */}
            <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                    <CardFooter>
                        <div className="text-sm text-muted-foreground text-center w-full">
                            Don't have an account?{" "}
                            <Link href="/signup" className="underline text-primary">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
