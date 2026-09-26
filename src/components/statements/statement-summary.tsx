import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";
import type { AccountStatementSummary } from "@/types";

type StatementSummaryProps = {
  summary: AccountStatementSummary;
  currency: string;
};

export function StatementSummary({
  summary,
  currency,
}: StatementSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Créditos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tracking-tight text-success">
            + {formatMoney(summary.totalCredits, currency)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Débitos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tracking-tight text-destructive">
            - {formatMoney(summary.totalDebits, currency)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
