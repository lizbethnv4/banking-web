import type { ReactNode } from "react";

import { GuestGuard } from "@/components/auth/guest-guard";
import { AppBrand } from "@/components/layout/app-brand";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GuestGuard>
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 pt-[max(2.5rem,env(safe-area-inset-top))] pb-6">
        <div className="mb-6">
          <AppBrand />
        </div>
        <div className="w-full max-w-md">{children}</div>
        <div
          aria-hidden="true"
          className="h-[max(10rem,calc(env(safe-area-inset-bottom,0px)+8rem))] md:hidden"
        />
      </div>
    </GuestGuard>
  );
}
