'use client';
import { AuthProvider } from '@/lib/auth-store';
import './globals.css';
import { Navbar } from '@/components/navbar';



export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html>
<body>
<AuthProvider>
<Navbar />
<main className="p-6">{children}</main>
</AuthProvider>
</body>
</html>
);
}
