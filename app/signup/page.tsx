'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { signup } from '@/lib/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

function SignupForm() {
    const [state, dispatch] = useActionState(signup, undefined);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (state === 'Success') {
            const timer = setTimeout(() => {
                router.push('/welcome');
            }, 1000); // Short delay to show success message
            return () => clearTimeout(timer);
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="space-y-4">
            <div className="grid gap-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
                    <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
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
            </div>

            <SignupButton />
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {state && (
                    <p className={`text-sm ${state === 'Success' ? 'text-green-600' : 'text-destructive'}`}>
                        {state === 'Success' ? 'Account created! Redirecting...' : state}
                    </p>
                )}
            </div>
        </form>
    );
}

function SignupButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" aria-disabled={pending} disabled={pending}>
            Create account
        </Button>
    );
}

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
                <CardFooter>
                    <div className="text-sm text-muted-foreground text-center w-full">
                        Already have an account?{" "}
                        <Link href="/login" className="underline text-primary">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
