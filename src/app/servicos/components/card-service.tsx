import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Service } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";

interface CardServiceProps {
  service: Service;
  onUpdate: () => void;
  onRemove: () => void;
}

const getColorClasses = (color: string) => {
  const colorMap: Record<string, string> = {
    red: "bg-red-300",
    blue: "bg-blue-300",
    green: "bg-green-300",
    yellow: "bg-yellow-300",
    purple: "bg-purple-300",
    pink: "bg-pink-300",
    orange: "bg-orange-300",
  };

  return colorMap[color] || "bg-gray-300"; // fallback para gray se a cor não existir
};

export function CardService({ service, onRemove, onUpdate }: CardServiceProps) {
  return (
    <>
      <Card key={service.id} className={`mb-4 w-full relative overflow-hidden`}>
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div
            className={`w-6 h-3 ${getColorClasses(
              service.color
            )} absolute top-2 left-4 rounded-md`}
          />
          <h3>{service.name}</h3>
          <p>R$ {service.price.toFixed(2)}</p>
          <div className="flex flex-col gap-2 relative z-10">
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
