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
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/lib/types";
import { useRemoverProduto } from "@/hooks/mutations/product-mutations";

interface RemoverProdutoProps {
  product: Product | null;
  onClose: () => void;
}

export default function RemoverProduto({
  product,
  onClose,
}: RemoverProdutoProps) {
  const removerProduto = useRemoverProduto();

  async function handleRemove() {
    try {
      if (!product) return;
      await removerProduto.mutateAsync(product.id);
      onClose();
      toast.success("Produto removido com sucesso");
    } catch (error) {
      toast.error("Erro ao tentar remover produto");
    }
  }

  return (
    <Dialog open={product != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Produto</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o produto {product?.nome}? Esta ação
            não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={removerProduto.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={removerProduto.isPending}
            >
              {removerProduto.isPending && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remover
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
