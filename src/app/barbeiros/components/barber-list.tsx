"use client";
import { Barber } from "@/lib/types";
import { BarberCard } from "./barber-card";
import { useState } from "react";
import DialogEditar from "./dialog-editar";
import RemoverBarber from "./remover-barber";

interface BarberListProps {
  barbers: Barber[];
  onUpdate: (formData: FormData, barberId: number) => Promise<void>;
  onRemove: (barberId: number) => Promise<void>;
}

export default function BarberList({
  barbers,
  onUpdate,
  onRemove,
}: BarberListProps) {
  const [editBarberSelected, setEditBarberSelected] = useState<Barber | null>(
    null
  );
  const [removeBarberSelected, setRemoveBarberSelected] =
    useState<Barber | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {barbers.map((barber) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            onSelectEdit={() => setEditBarberSelected(barber)}
            onSelectRemove={() => setRemoveBarberSelected(barber)}
          />
        ))}
      </div>
      <DialogEditar
        barber={editBarberSelected}
        onClose={() => setEditBarberSelected(null)}
        onUpdate={onUpdate}
      />
      <RemoverBarber
        barber={removeBarberSelected}
        onClose={() => setRemoveBarberSelected(null)}
        onRemove={onRemove}
      />
    </>
  );
}
