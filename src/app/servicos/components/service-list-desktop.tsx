"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Service } from "@/lib/types";
import { CardService } from "./card-service";
import { useState } from "react";
import DialogEditarServico from "./dialog-editar-servico";
import RemoverServico from "./remover-servico";

interface ServiceListDesktopProps {
  services: Service[];
  onUpdate: (formData: FormData, serviceId: number) => Promise<void>;
  onRemove: (serviceId: number) => Promise<void>;
}

export function ServiceListDesktop({
  services,
  onUpdate,
  onRemove,
}: ServiceListDesktopProps) {
  const [editServiceSelected, setEditServiceSelected] =
    useState<Service | null>(null);
  const [removeServiceSelected, setRemoveServiceSelected] =
    useState<Service | null>(null);

  return (
    <>
      <ScrollArea className="h-[calc(100vh-220px)] pr-4">
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
        onUpdate={onUpdate}
      />
      <RemoverServico
        service={removeServiceSelected}
        onClose={() => setRemoveServiceSelected(null)}
        onRemove={onRemove}
      />
    </>
  );
}
