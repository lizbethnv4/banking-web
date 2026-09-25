import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { TransfersPanel } from "@/components/transfers/transfers-panel";

export const metadata: Metadata = {
  title: "Transferir",
};

function readSourceParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function TransfersPage({
  searchParams,
}: PageProps<"/transfers">) {
  const query = await searchParams;
  const initialSourceAccountId = readSourceParam(query.source);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transferir"
        description="Registre una transferencia entre cuentas. Las validaciones de fondos, estado y duplicados se resuelven en el backend."
      />
      <TransfersPanel initialSourceAccountId={initialSourceAccountId} />
    </div>
  );
}
