import { request } from "@/lib/api";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types";

export function login(payload: LoginRequest) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
}

export function register(payload: RegisterRequest) {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
}
