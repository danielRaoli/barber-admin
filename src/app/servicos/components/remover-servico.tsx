"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Trash2Icon } from "lucide-react";
import { Service } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

interface RemoverServicoProps {
  service: Service | null;
  onClose: () => void;
  onRemove: (serviceId: number) => Promise<void>;
}

export default function RemoverServico({
  service,
  onClose,
  onRemove,
}: RemoverServicoProps) {
  const [isLoading, setIsLoading] = useState(false);
  async function handleRemove() {
    try {
      if (!service) return;
      setIsLoading(true);
      await onRemove(service.id);
      onClose();
    } catch (error) {
      toast.error("Erro ao tentar remover barbeiro");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={service != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Barbeiro</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o serviço {service?.name}? Esta ação
            não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            className="gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2Icon className="h-4 w-4" />
            )}
            {isLoading ? "Removendo" : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
