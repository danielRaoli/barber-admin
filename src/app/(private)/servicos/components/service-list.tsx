"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Service } from "@/lib/types";
import { CardService } from "./card-service";
import { useState } from "react";
import DialogEditarServico from "./dialog-editar-servico";
import RemoverServico from "./remover-servico";

interface ServiceListDesktopProps {
  services: Service[];
}

export function ServiceListDesktop({
  services,
}: ServiceListDesktopProps) {
  const [editServiceSelected, setEditServiceSelected] =
    useState<Service | null>(null);
  const [removeServiceSelected, setRemoveServiceSelected] =
    useState<Service | null>(null);

  return (
    <>
      <ScrollArea className="h-full mt-6 grid grid-cols-4">
        {services.map((service) => (
          <CardService
            key={service.id}
            service={service}
            onUpdate={() => setEditServiceSelected(service)}
            onRemove={() => setRemoveServiceSelected(service)}
          />
        ))}
      </ScrollArea>
      <DialogEditarServico
        service={editServiceSelected}
        onClose={() => setEditServiceSelected(null)}
      />
      <RemoverServico
        service={removeServiceSelected}
        onClose={() => setRemoveServiceSelected(null)}
      />
    </>
  );
}
