"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Barber } from "@/lib/types";
import { BarberCard } from "./barber-card";


interface ProductListDesktopProps {
  barbers: Barber[];
  onSelectEdit: (barber: Barber) => void;
  onSelectRemove: (barber: Barber) => void;
}

export function ProductListDesktop({ barbers, onSelectEdit, onSelectRemove }: ProductListDesktopProps) {
  return (
    <ScrollArea className="h-[calc(100vh-220px)] pr-4">
      {barbers.map((barber) => (
        <BarberCard 
          key={barber.id} 
          barber={barber}
          onSelectEdit={() => onSelectEdit(barber)}
          onSelectRemove={() => onSelectRemove(barber)}
        />
      ))}
    </ScrollArea>
  );
}
