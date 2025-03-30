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
import { Product } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

interface RemoverProdutoProps {
  product: Product | null;
  onClose: () => void;
  onRemove: (productId: number) => Promise<void>;
}

export default function RemoverProduto({
  product,
  onClose,
  onRemove,
}: RemoverProdutoProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    try {
      if (!product) return;
      setIsLoading(true);
      await onRemove(product.id);
      onClose();
      toast.success("Produto removido com sucesso");
    } catch (error) {
      toast.error("Erro ao tentar remover produto");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={product != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Produto</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o produto {product?.name}? Esta ação
            não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isLoading}
            >
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Remover
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
