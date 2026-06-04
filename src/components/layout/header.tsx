"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, Calendar, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("sigee.token");
    router.push("/");
  };

  const navItems = [
    { name: "Perfil", href: "/dashboard/perfil", icon: User },
    { name: "Calendário", href: "/dashboard/calendario", icon: Calendar },
    { name: "Grupos", href: "/dashboard/grupos", icon: Users },
    { name: "Materiais", href: "/dashboard/materiais", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative h-8 w-24">
              <Image 
                src="/logo.png" 
                alt="SIGGE Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer">
            Sair
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-md cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg z-50">
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t pt-4 mt-2">
              <Button 
                variant="ghost" 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }} 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 h-auto"
              >
                <span className="flex items-center gap-3">
                  Sair
                </span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
