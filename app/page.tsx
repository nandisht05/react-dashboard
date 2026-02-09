import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Secure User Management <br className="hidden sm:inline" />
              Built for <span className="text-primary">Professionals</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A comprehensive dashboard solution featuring role-based access control, secure authentication, and a clean, bordered interface.
            </p>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to manage users securely and efficiently.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Granular control with Admin and User roles. Admins manage approvals.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Secure Auth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  NextAuth.js v5 powered authentication with BCrypt password hashing.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Neon Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Serverless Postgres database with Drizzle ORM for type-safe queries.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Modern UI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built with Tailwind CSS and a professional "bordered" design system.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Admin Console</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dedicated interface for administrators to approve new user registrations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Type Safe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  End-to-end TypeScript support for reliable and maintainable code.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a href="#" className="font-medium underline underline-offset-4">Antigravity</a>.
            The source code is available on{' '}
            <a href="#" className="font-medium underline underline-offset-4">GitHub</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
