"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BATCH_CSV_HEADER, BATCH_MAX_ITEMS } from "@/lib/batches";

type BatchUploadFormProps = {
  selectedFile: File | null;
  isUploading: boolean;
  isProcessing: boolean;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
};

export function BatchUploadForm({
  selectedFile,
  isUploading,
  isProcessing,
  onFileChange,
  onSubmit,
}: BatchUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = isUploading || isProcessing;

  useEffect(() => {
    if (!selectedFile && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [selectedFile]);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="rounded-lg bg-muted/50 px-3 py-3 text-sm text-muted-foreground">
        <p>Cabecera esperada:</p>
        <p className="mt-1 font-mono text-foreground">{BATCH_CSV_HEADER}</p>
        <p className="mt-2">
          Máximo {BATCH_MAX_ITEMS.toLocaleString("es-DO")} transferencias. Un
          CSV estructuralmente inválido se rechaza completo; los errores de
          negocio se registran por operación.
        </p>
        <p className="mt-2">
          <a
            href="/samples/transfers-sample.csv"
            className="text-primary underline-offset-4 hover:underline"
            download
          >
            Descargar CSV de ejemplo
          </a>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="batch-file">Archivo CSV</Label>
        <Input
          ref={inputRef}
          id="batch-file"
          type="file"
          accept=".csv,text/csv"
          disabled={disabled}
          onChange={(event) => {
            onFileChange(event.target.files?.[0] ?? null);
          }}
        />
        <p className="text-sm text-muted-foreground">
          {selectedFile
            ? selectedFile.name
            : "Ningún archivo seleccionado."}
        </p>
      </div>

      <Button type="submit" disabled={disabled}>
        {isUploading ? "Subiendo..." : "Subir archivo"}
      </Button>
    </form>
  );
}
