import {
  ArrowLeftRight,
  FileText,
  Home,
  Layers,
  List,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Inicio",
    description: "Resumen de los módulos disponibles en el sistema.",
    icon: Home,
  },
  {
    href: "/accounts",
    label: "Cuentas",
    description: "Consultar y administrar las cuentas del sistema.",
    icon: Wallet,
  },
  {
    href: "/transfers",
    label: "Transferir",
    description: "Registrar transferencias entre cuentas.",
    icon: ArrowLeftRight,
  },
  {
    href: "/movements",
    label: "Movimientos",
    description: "Consultar el historial de movimientos.",
    icon: List,
  },
  {
    href: "/batches",
    label: "Lotes",
    description: "Procesar operaciones mediante archivos por lotes.",
    icon: Layers,
  },
  {
    href: "/statements",
    label: "Estado de cuenta",
    description: "Consultar el estado de cuenta de una cuenta.",
    icon: FileText,
  },
];

export const QUICK_ACCESS_ITEMS = NAV_ITEMS.filter((item) => item.href !== "/");
