'use client';
import Link from 'next/link';
import { useAuth } from '../lib/auth-store';
import { Button } from './ui/button';


export function Navbar(){
const auth = useAuth();
return (
<nav className="w-full bg-white border-b p-4 flex justify-between">
<div className="flex items-center gap-4">
<Link href="/">DTest</Link>
{auth.user?.role === 'admin' && <Link href="/admin/dashboard">Admin</Link>}
{auth.user && <Link href="/user/dashboard">Dashboard</Link>}
</div>
<div>
{auth.user ? (
<div className="flex items-center gap-3">
<div>{auth.user.firstName}</div>
<Button onClick={() => auth.signOut()}>Sign out</Button>
</div>
) : (
<Link href="/">Sign In</Link>
)}
</div>
</nav>
);
}