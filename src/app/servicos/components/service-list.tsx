"use client";
import { Service } from "@/lib/types";
import { CardService } from "./card-service";
import { useState } from "react";
import DialogEditarServico from "./dialog-editar-servico";
import RemoverServico from "./remover-servico";

interface ServiceListMobileProps {
  services: Service[];
  onUpdate: (formData: FormData, serviceId: number) => Promise<void>;
  onRemove: (serviceId: number) => Promise<void>;
}

export function ServiceListMobile({
  services,
  onUpdate,
  onRemove,
}: ServiceListMobileProps) {
  const [editServiceSelected, setEditServiceSelected] =
    useState<Service | null>(null);
  const [removeServiceSelected, setRemoveServiceSelected] =
    useState<Service | null>(null);

  return (
    <>
      <div className="space-y-4 pb-10">
        {services.map((service) => (
          <CardService
            key={service.id}
            service={service}
            onUpdate={() => setEditServiceSelected(service)}
            onRemove={() => setRemoveServiceSelected(service)}
          />
        ))}
      </div>
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
