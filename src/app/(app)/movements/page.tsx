import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { MovementsPanel } from "@/components/movements/movements-panel";

export const metadata: Metadata = {
  title: "Movimientos",
};

function readAccountParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function MovementsPage({
  searchParams,
}: PageProps<"/movements">) {
  const query = await searchParams;
  const initialAccount = readAccountParam(query.account);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Movimientos"
        description="Consulte el historial de una cuenta con filtros y paginación resueltos por el backend."
      />
      <MovementsPanel initialAccount={initialAccount} />
    </div>
  );
}
