"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CardProduct } from "./card-product";
import { useState } from "react";
import { Product } from "@/lib/types";

import DialogEditarProduto from "./dialog-editar-produto";
import RemoverProduto from "./remover-produto";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const [editProductSelected, setEditProductSelected] = useState<Product | null>(null);
  const [removeProductSelected, setRemoveProductSelected] = useState<Product | null>(null);

  return (
    <div className="min-h-screen w-full grid grid-cols-4 pr-4">
      {products.map((product) => (
        <CardProduct key={product.id} product={product} onSelectEdit={() => setEditProductSelected(product)} onSelectRemove={() => setRemoveProductSelected(product)} />
      ))}
      <DialogEditarProduto product={editProductSelected}  onClose={() => setEditProductSelected(null)} />
      <RemoverProduto  product={removeProductSelected} onClose={() => setRemoveProductSelected(null)} />
    </div>
  );  
}
