import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Estado de cuenta",
};

export default function StatementsPage() {
  return (
    <PageHeader
      title="Estado de cuenta"
      description="Consulte el estado de cuenta de una cuenta específica."
    />
  );
}
