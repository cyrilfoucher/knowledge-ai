import { ReactNode } from "react";
import Card from "../ui/Card";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex justify-center pt-4 sm:pt-12">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </Card>
    </div>
  );
}

export default AuthCard;
