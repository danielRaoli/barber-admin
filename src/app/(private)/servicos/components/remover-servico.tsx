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

import { useState } from "react";
import { toast } from "sonner";
import { Service } from "@/lib/types";
import { useRemoverServico } from "@/hooks/mutations/service-mutations";

interface RemoverServicoProps {
  service: Service | null;
  onClose: () => void;
}

export default function RemoverServico({
  service,
  onClose,
}: RemoverServicoProps) {
  const removerServico = useRemoverServico();


  async function handleRemove() {
    try {
      if (!service) return;
    
      await removerServico.mutateAsync(service.id);
      toast.success("Serviço removido com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao tentar remover serviço");
    } 
  }

  return (
    <Dialog open={service != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Barbeiro</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o serviço {service?.nome}? Esta ação
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
            disabled={removerServico.isPending}
          >
            {removerServico.isPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2Icon className="h-4 w-4" />
            )}
            {removerServico.isPending ? "Removendo" : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
