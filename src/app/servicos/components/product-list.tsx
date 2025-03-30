"use client";

import { Product, Service } from "@/lib/types";
import { CardProduct } from "./card-product";
import { useState } from "react";
import DialogEditarServico from "./dialog-editar-servico";
import RemoverServico from "./remover-servico";
import DialogEditarProduto from "./dialog-editar-produto";
import RemoverProduto from "./remover-produto";

interface ProductListMobileProps {
  products: Product[];
  onUpdate: (formData: FormData, productId: number) => Promise<void>;
  onRemove: (productId: number) => Promise<void>;
}

export function ProductListMobile({ products, onUpdate, onRemove }: ProductListMobileProps) {
  const [editProductSelected, setEditProductSelected] = useState<Product | null>(null);
  const [removeProductSelected, setRemoveProductSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="space-y-4 pb-10">
        {products.map((product) => (
          <CardProduct 
            key={product.id} 
            product={product}
            onSelectEdit={() => setEditProductSelected(product)}
            onSelectRemove={() => setRemoveProductSelected(product)}
          />
        ))}
      </div>
      <DialogEditarProduto
        product={editProductSelected}
        onClose={() => setEditProductSelected(null)}
        onUpdate={onUpdate}
      />
      <RemoverProduto
        product={removeProductSelected}
        onClose={() => setRemoveProductSelected(null)}
        onRemove={onRemove}
      />
    </>
  );
}
