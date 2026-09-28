import { ApiError, request, requestBlob } from "@/lib/api";
import type { AccountStatement, GetAccountStatementQuery } from "@/types";

export function getAccountStatement(
  idOrNumber: string,
  query: GetAccountStatementQuery,
) {
  const params = new URLSearchParams();
  params.set("year", String(query.year));
  params.set("month", String(query.month));
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));

  return request<AccountStatement>(
    `/accounts/${encodeURIComponent(idOrNumber)}/statement?${params.toString()}`,
  );
}

export async function downloadAccountStatementPdf(
  idOrNumber: string,
  query: Pick<GetAccountStatementQuery, "year" | "month">,
  options?: { filenameAccount?: string },
) {
  const params = new URLSearchParams();
  params.set("year", String(query.year));
  params.set("month", String(query.month));

  const { blob, contentType, contentDisposition } = await requestBlob(
    `/accounts/${encodeURIComponent(idOrNumber)}/statement/pdf?${params.toString()}`,
    {
      headers: {
        Accept: "application/pdf",
      },
    },
  );

  if (!isPdfResponse(contentType, blob)) {
    throw new ApiError({
      status: 200,
      message: "La respuesta del servidor no es un PDF válido.",
    });
  }

  const filename =
    parseContentDispositionFilename(contentDisposition) ??
    fallbackStatementPdfFilename(
      options?.filenameAccount ?? idOrNumber,
      query.year,
      query.month,
    );

  const objectUrl = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function isPdfResponse(contentType: string, blob: Blob) {
  const type = `${contentType};${blob.type}`.toLowerCase();
  return type.includes("application/pdf");
}

function parseContentDispositionFilename(header: string | null): string | null {
  if (!header) {
    return null;
  }

  const utf8Match = /filename\*\s*=\s*(?:UTF-8''|utf-8'')([^;]+)/i.exec(header);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/^["']|["']$/g, ""));
    } catch {
      return utf8Match[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  const quotedMatch = /filename\s*=\s*"([^"]+)"/i.exec(header);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = /filename\s*=\s*([^;]+)/i.exec(header);
  if (plainMatch?.[1]) {
    return plainMatch[1].trim().replace(/^["']|["']$/g, "");
  }

  return null;
}

function fallbackStatementPdfFilename(
  account: string,
  year: number,
  month: number,
) {
  const safeAccount = account.replace(/[^A-Za-z0-9_-]/g, "") || "cuenta";
  return `estado-cuenta-${safeAccount}-${String(year)}-${String(month).padStart(2, "0")}.pdf`;
}
