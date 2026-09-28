"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { AuthLoading } from "@/components/auth/auth-loading";
import { useAuth } from "@/components/auth/auth-provider";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return <AuthLoading />;
  }

  return children;
}
