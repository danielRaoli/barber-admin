"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthRedirect } from "@/hooks/use-auth";
import ReactQueryProvider from "../providers/react-query";


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuthRedirect();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return null; // O hook já faz o redirecionamento
    }

    return (
        <div className="flex h-screen">
           
            <Toaster />
            <Sidebar />
            <main className="flex-1">
                 <ReactQueryProvider>{children}</ReactQueryProvider>
            </main>
        </div>
    );
}
