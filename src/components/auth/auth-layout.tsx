"use client";

import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

export function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-white">
      <div className="absolute inset-0 flex pointer-events-none z-0 overflow-hidden">
        <div 
          className={`absolute inset-y-0 left-0 w-full md:w-1/2 bg-[#F4F6F8] transition-transform duration-700 ease-in-out ${
            !isLogin ? "md:translate-x-full" : ""
          }`} 
        />
        <div 
          className={`hidden md:block absolute inset-y-0 right-0 w-1/2 bg-[#c8d9f4] transition-transform duration-700 ease-in-out ${
            !isLogin ? "md:-translate-x-full" : ""
          }`} 
        />
      </div>

      <Image 
        src="/waves.png" 
        alt="Top Wave" 
        width={1440}
        height={194}
        priority
        className="absolute top-0 left-0 w-full h-auto rotate-180 pointer-events-none z-0" 
      />
      <Image 
        src="/waves.png" 
        alt="Bottom Wave" 
        width={1440}
        height={194}
        priority
        className="absolute bottom-0 left-0 w-full h-auto pointer-events-none z-0" 
      />

      <div 
        className={`absolute inset-y-0 left-0 w-full md:w-1/2 flex flex-col justify-center px-4 lg:px-20 z-10 transition-transform duration-700 ease-in-out ${
          !isLogin ? "md:translate-x-full" : ""
        }`}
      >
        <div className="relative w-full max-w-md mx-auto">
          <Card className="shadow-2xl rounded-2xl border-none bg-white relative overflow-hidden min-h-[620px] transition-all duration-700">
            <div 
              className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                !isLogin ? "opacity-0 -translate-x-full pointer-events-none" : "opacity-100 translate-x-0"
              }`}
            >
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            </div>

            <div 
              className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                isLogin ? "opacity-0 translate-x-full pointer-events-none" : "opacity-100 translate-x-0"
              }`}
            >
              <SignupForm onToggleMode={() => setIsLogin(true)} />
            </div>
          </Card>
        </div>
      </div>

      <div 
        className={`hidden md:flex absolute inset-y-0 right-0 w-1/2 flex-col items-center justify-center p-10 z-10 transition-transform duration-700 ease-in-out ${
          !isLogin ? "md:-translate-x-full" : ""
        }`}
      >
        <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
          <div className="w-full max-w-[28rem] md:max-w-[36rem] relative h-48 md:h-64">
            <Image
              src="/logo.png"
              alt="SIGGE Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="w-full max-w-xl relative h-[400px]">
            <Image
              src="/login-background.png"
              alt="Login Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
