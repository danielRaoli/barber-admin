"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { barbeiros } from "@/db/schema";
import { Calendar, Clock, Instagram, PencilIcon, Phone, X } from "lucide-react";
import Image from "next/image";

type Barber = typeof barbeiros.$inferSelect;

interface BarberCardProps {
  barber: Barber;
  onSelectEdit: (barber: Barber) => void;
  onSelectRemove: (barber: Barber) => void;
}

export function BarberCard({
  barber,
  onSelectEdit,
  onSelectRemove,
}: BarberCardProps) {
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${barber.whatsapp}`, "_blank");
  };

  const handleInstagramClick = () => {
    window.open(`https://instagram.com/${barber.instagram}`, "_blank");
  };

  return (
    <Card className="p-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-red-600 absolute top-2 right-2"
        onClick={() => onSelectRemove(barber)}
      >
        <X />
      </Button>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
          <Image
            src={barber.imageUrl || "/placeholder.svg"}
            alt={barber.nome}
            fill
            className="object-cover"
          />
        </div>

        <h3 className="text-xl font-semibold mb-2">{barber.nome}</h3>
        <div className="flex text-gray-500 items-center gap-1 mb-1">
          <Clock size={16} />
          <span>{barber.horaAbertura} - </span>
          <span>{barber.horaFechamento}</span>
        </div>
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleWhatsAppClick}
            title="WhatsApp"
          >
            <Phone className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleInstagramClick}
            title="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Implementar visualização de agendamentos
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendamentos
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            size="icon"
            onClick={() => onSelectEdit(barber)}
          >
            <PencilIcon className="h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
}
