import { marketingRoutes } from "@/config/routes";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute top-8 left-8">
        <Link href={marketingRoutes.home} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-mono text-sm font-bold text-black">NF</span>
          </div>
          <span className="font-mono font-semibold tracking-tight text-foreground">News Forge AI</span>
        </Link>
      </div>
      <div className="w-full max-w-[400px]">
        {children}
      </div>
    </div>
  );
}
