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
import { Barber } from "../page";
import { useRemoverBarbeiro } from "@/hooks/mutations/barbeiros-mutations";

interface RemoverBarberProps {
  barber: Barber | null;
  onClose: () => void;
}

export default function RemoverBarber({
  barber,
  onClose,
}: RemoverBarberProps) {
  const [isLoading, setIsLoading] = useState(false);
  const removeBarberMutation = useRemoverBarbeiro();
  const handleRemove = async () => {
    try {
      if (!barber) return;
      setIsLoading(true);
      await removeBarberMutation.mutateAsync(barber.id);
      onClose();
    } catch (error) {
      toast.error("Erro ao tentar remover barbeiro");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={barber != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Barbeiro</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o barbeiro {barber?.nome}? Esta ação
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
