"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="site-header container">
      <div className="brand">
        <div className="logo" aria-hidden />
        <div>
          <Link href="/" className="text-xl font-bold">
            Brentfield Estate
          </Link>
          <div className="text-sm text-[var(--text-light)]">Gate Pass PWA</div>
        </div>
      </div>

      <nav className="nav-links">
        <Link href="/gate">Gate</Link>
        <Link href="/admin" className="ml-4">Admin</Link>
      </nav>
    </header>
  );
}
