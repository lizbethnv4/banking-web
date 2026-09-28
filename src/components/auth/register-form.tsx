"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

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
import { register } from "@/lib/auth";
import { getUserErrorMessage, isApiError } from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LENGTH = 255;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

function getRegisterErrorMessage(error: unknown): string {
  if (isApiError(error) && error.code === "EMAIL_ALREADY_EXISTS") {
    return "El email ya está registrado.";
  }

  return getUserErrorMessage(error);
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Ingrese su nombre.");
      return;
    }

    if (trimmedName.length > NAME_MAX_LENGTH) {
      setError("El nombre no puede superar 255 caracteres.");
      return;
    }

    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
      setError("La contraseña no puede superar 72 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });
      router.replace("/login?registered=1");
    } catch (caughtError) {
      setError(getRegisterErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>
          El registro crea un usuario con acceso de consulta y transferencias.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="register-name">Nombre</Label>
            <Input
              id="register-name"
              name="name"
              value={name}
              maxLength={NAME_MAX_LENGTH}
              placeholder="Ej. María Pérez"
              autoComplete="name"
              disabled={isSubmitting}
              aria-invalid={error ? true : undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Correo electrónico</Label>
            <Input
              id="register-email"
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
            <Label htmlFor="register-password">Contraseña</Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              value={password}
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={error ? true : undefined}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Confirmar contraseña</Label>
            <Input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={error ? true : undefined}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>No se pudo crear la cuenta</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tiene una cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
