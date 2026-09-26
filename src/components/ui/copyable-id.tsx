"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatShortId } from "@/lib/id";
import { cn } from "@/lib/utils";

type CopyableIdProps = {
  value: string;
  label?: string;
  className?: string;
};

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.top = "0";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(input);

  if (!copied) {
    throw new Error("No se pudo copiar el identificador.");
  }
}

export function CopyableId({
  value,
  label = "ID",
  className,
}: CopyableIdProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await copyToClipboard(value);
      setCopied(true);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="font-mono font-medium">{formatShortId(value)}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => {
          void handleCopy();
        }}
        aria-label={copied ? `${label} copiado` : `Copiar ${label} completo`}
        title={copied ? "Copiado" : "Copiar"}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </span>
  );
}
