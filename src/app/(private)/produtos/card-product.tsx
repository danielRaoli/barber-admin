import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface CardProductProps {
  product: Product;
  onSelectEdit: (product: Product) => void;
  onSelectRemove: (product: Product) => void;
}

export function CardProduct({ product, onSelectEdit, onSelectRemove }: CardProductProps) {
  return (
    <div className="flex flex-col justify-between relative w-full max-h-[300px]">
      <Image
        src={product.imageUrl?.startsWith("http") ? product.imageUrl : "/placeholder.jpg"}
        alt={product.nome}
        width={0}
        height={0}
        className="rounded-lg object-cover w-full h-auto"
        sizes="100vw"
      />

      <div className="flex flex-col items-start">
        <h3 className="font-semibold">{product.nome}</h3>
        <p className="font-medium">R$ {product.preco}</p>
      </div>

      <div className="flex absolute top-2 right-2  gap-2">
        <Button variant="outline" size="icon" onClick={() => onSelectEdit(product)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onSelectRemove(product)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>

  );
}
