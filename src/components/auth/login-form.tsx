"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { getUserErrorMessage, isApiError } from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginFormProps = {
  registered?: boolean;
};

function getLoginErrorMessage(error: unknown): string {
  if (isApiError(error) && error.code === "INVALID_CREDENTIALS") {
    return "Correo o contraseña incorrectos.";
  }

  if (isApiError(error) && error.code === "USER_INACTIVE") {
    return "La cuenta está inactiva.";
  }

  return getUserErrorMessage(error);
}

export function LoginForm({ registered = false }: LoginFormProps) {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }

    if (!password) {
      setError("Ingrese la contraseña.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({
        email: trimmedEmail,
        password,
      });
      setSession(response.accessToken);
      router.replace("/");
    } catch (caughtError) {
      if (
        caughtError instanceof Error &&
        caughtError.message === "INVALID_ACCESS_TOKEN"
      ) {
        setError("No se pudo iniciar sesión.");
      } else {
        setError(getLoginErrorMessage(caughtError));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Ingrese con su correo y contraseña para acceder al sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {registered ? (
            <Alert>
              <CheckCircle2 />
              <AlertTitle>Cuenta creada</AlertTitle>
              <AlertDescription>
                La cuenta fue creada correctamente. Ya puede iniciar sesión.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="login-email">Correo electrónico</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              value={email}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={error ? true : undefined}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              value={password}
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={error ? true : undefined}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>No se pudo iniciar sesión</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tiene una cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
