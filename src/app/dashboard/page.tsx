"use client";

import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("sigee.token");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8]">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8">Você está logado e acessou uma rota protegida!</p>
      
      <Button onClick={handleLogout} variant="destructive">
        Sair (Logout)
      </Button>
    </div>
  );
}
