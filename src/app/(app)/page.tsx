import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { QUICK_ACCESS_ITEMS } from "@/components/layout/nav-items";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Banking System</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight break-words text-foreground sm:text-3xl">
          Gestión de Cuentas y Transferencias Bancarias
        </h1>
        <p className="mt-3 text-muted-foreground">
          Permite administrar cuentas, registrar transferencias, consultar
          movimientos y ejecutar procesos por lotes desde una interfaz única.
        </p>
      </header>

      <section aria-labelledby="quick-access-heading">
        <h2
          id="quick-access-heading"
          className="mb-3 text-sm font-medium text-muted-foreground"
        >
          Accesos rápidos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_ACCESS_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card className="h-full hover:bg-muted/60">
                  <CardHeader>
                    <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <CardTitle>{item.label}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                    <CardAction>
                      <ChevronRight
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </CardAction>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
