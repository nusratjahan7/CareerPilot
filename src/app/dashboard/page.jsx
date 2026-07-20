"use client"
import Dashboard from "@/components/Dashboard";
import { authClient } from "@/lib/auth-client";


export default function DashboardPage() {
    const { data: session } = authClient.useSession();
    return <Dashboard userId={session?.user?.id} apiBaseUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}`} />;
}