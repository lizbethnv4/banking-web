import { Landmark } from "lucide-react";

type AppBrandProps = {
  compact?: boolean;
};

export function AppBrand({ compact = false }: AppBrandProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <Landmark className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold">Banking System</p>
        {!compact ? (
          <p className="truncate text-xs opacity-70">Panel de gestión</p>
        ) : null}
      </div>
    </div>
  );
}
