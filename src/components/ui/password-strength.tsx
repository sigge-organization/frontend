import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export function PasswordStrength({ password = "", className }: PasswordStrengthProps) {
  const requirements = [
    { label: "Pelo menos 8 caracteres", met: password.length >= 8 },
    { label: "Pelo menos 1 letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Pelo menos 1 letra minúscula", met: /[a-z]/.test(password) },
    { label: "Pelo menos 1 número", met: /[0-9]/.test(password) },
    { label: "Pelo menos 1 caractere especial (!@#$)", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  
  let strengthScore = 0;
  if (metCount === 0) strengthScore = 0;
  else if (metCount <= 2) strengthScore = 1;
  else if (metCount <= 4) strengthScore = 2;
  else strengthScore = 3;

  const strengthLabels = ["Muito fraca", "Fraca", "Média", "Forte"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className={cn("flex flex-col gap-2 mt-2", className)}>
      <div className="flex gap-1 h-1.5 w-full">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn(
              "h-full flex-1 rounded-full transition-colors duration-300",
              password.length > 0 && index <= strengthScore ? strengthColors[strengthScore] : "bg-muted"
            )}
          />
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground font-medium">
        {password.length > 0 ? `Força: ${strengthLabels[strengthScore]}` : "Digite uma senha"}
      </p>

      <div className="flex flex-col gap-1 mt-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
