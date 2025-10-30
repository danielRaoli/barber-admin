import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Service } from "@/lib/types";

import { Pencil, Trash2 } from "lucide-react";

interface CardServiceProps {
  service: Service;
  onUpdate: () => void; 
  onRemove: () => void;
}


export function CardService({ service, onRemove, onUpdate }: CardServiceProps) {
  return (
    <>
      <Card key={service.id} className={`mb-4 w-full relative overflow-hidden`}>
        <CardContent className="flex flex-col items-center justify-between gap-4 py-2">
          <div
            className={`w-6 h-3 absolute top-2 left-4 rounded-md`}
          />
          <h3>{service.nome} - R$ {service.preco}</h3>
          <div className="flex gap-2 relative z-10">
            <Button onClick={() => onUpdate()} variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onRemove()}
              variant="destructive"
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
