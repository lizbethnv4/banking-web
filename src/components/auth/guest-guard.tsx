"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { AuthLoading } from "@/components/auth/auth-loading";
import { useAuth } from "@/components/auth/auth-provider";

type GuestGuardProps = {
  children: ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || isAuthenticated) {
    return <AuthLoading />;
  }

  return children;
}
