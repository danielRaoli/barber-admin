"use client";

import {
  Home,
  Users,
  Scissors,
  Settings,
  Calendar,
  BarChart3,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "Barbeiros", href: "/barbeiros" },
  { icon: Scissors, label: "Serviços", href: "/servicos" },
  { icon: Calendar, label: "Agendamentos", href: "/appointments" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-6 px-4 text-lg font-semibold tracking-tight">
          Barbearia Pro
        </h2>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Versão Mobile */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden fixed top-4 right-6">
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Versão Desktop */}
      <div className="hidden md:block min-h-screen border-r w-64">
        <SidebarContent />
      </div>
    </>
  );
}
