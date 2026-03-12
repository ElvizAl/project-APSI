import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  fullscreen?: boolean;
  className?: string;
  size?: number;
}

export function Spinner({ fullscreen = true, className, size = 10 }: SpinnerProps) {
  if (fullscreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className={cn("animate-spin text-primary", className)}
            style={{ width: size * 4, height: size * 4 }}
          />
          <p className="text-sm text-zinc-400 font-medium">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
