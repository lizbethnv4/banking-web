import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { StatementsPanel } from "@/components/statements/statements-panel";

export const metadata: Metadata = {
  title: "Estado de cuenta",
};

function readAccountParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function StatementsPage({
  searchParams,
}: PageProps<"/statements">) {
  const query = await searchParams;
  const initialAccount = readAccountParam(query.account);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Estado de cuenta"
        description="Consulte el estado de cuenta mensual de una cuenta. El resumen y los movimientos del período los resuelve el backend."
      />
      <StatementsPanel initialAccount={initialAccount} />
    </div>
  );
}
