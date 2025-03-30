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
    <Card key={product.id} className="mb-4">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Image
            src={product.imageUrl?.startsWith("http") ? product.imageUrl : "/placeholder.jpg"}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="font-medium">R$ {product.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" size="icon" onClick={() => onSelectEdit(product)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onSelectRemove(product)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
