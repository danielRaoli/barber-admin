"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/lib/types";
import { CardProduct } from "./card-product";
import { useState } from "react";

import RemoverServico from "./remover-servico";
import DialogEditarProduto from "./dialog-editar-produto";
import RemoverProduto from "./remover-produto";

interface ProductListDesktopProps {
  products: Product[];
  onUpdate: (formData: FormData, productId: number) => Promise<void>;
  onRemove: (productId: number) => Promise<void>;
}

export function ProductListDesktop({ products, onUpdate, onRemove }: ProductListDesktopProps) {
  const [editProductSelected, setEditProductSelected] = useState<Product | null>(null);
  const [removeProductSelected, setRemoveProductSelected] = useState<Product | null>(null);

  return (
    <ScrollArea className="h-[calc(100vh-220px)] pr-4">
      {products.map((product) => (
        <CardProduct key={product.id} product={product} onSelectEdit={() => setEditProductSelected(product)} onSelectRemove={() => setRemoveProductSelected(product)} />
      ))}
      <DialogEditarProduto product={editProductSelected} onUpdate={onUpdate} onClose={() => setEditProductSelected(null)} />
      <RemoverProduto onRemove={onRemove} product={removeProductSelected} onClose={() => setRemoveProductSelected(null)} />
    </ScrollArea>
  );  
}
