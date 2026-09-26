import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

function isRegisteredFlag(value: string | string[] | undefined) {
  return value === "1";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string | string[] }>;
}) {
  const query = await searchParams;

  return <LoginForm registered={isRegisteredFlag(query.registered)} />;
}
