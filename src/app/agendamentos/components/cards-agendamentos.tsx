"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Agendamento } from "@/lib/types";
import { formatarData, formatarHora } from "@/lib/utils";

interface Cliente {
  nome: string;
  email: string;
  telefone: string;
}

interface Barbeiro {
  id: string;
  nome: string;
  avatar?: string;
}

interface Servico {
  nome: string;
  cor: string;
  duracao: number;
  preco: number;
}



interface CardsAgendamentosProps {
  agendamentos: Agendamento[];
}

export function CardsAgendamentos({ agendamentos }: CardsAgendamentosProps) {
  const getStatusColor = (status: Agendamento["status"]) => {
    switch (status) {
      case "agendado":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "concluido":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "cancelado":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    }
  };

  const getStatusText = (status: Agendamento["status"]) => {
    switch (status) {
      case "agendado":
        return "Agendado";
      case "concluido":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agendamentos.map((agendamento) => (
        <Card
          key={agendamento.id}
          style={{
            backgroundColor: `${agendamento.service.color}10`,
            borderColor: agendamento.service.color,
          }}
          className="border-2"
        >
          <CardContent className="pt-6 space-y-4">
            {/* Cabeçalho do Card */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Badge
                  variant="secondary"
                  className={getStatusColor(agendamento.status)}
                >
                  {getStatusText(agendamento.status)}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Código: {agendamento.codigo}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatarData(agendamento.data)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatarHora(agendamento.hora)}
                </p>
              </div>
            </div>

            {/* Informações do Cliente */}
            <div className="space-y-1">
              <p className="font-semibold text-lg">
                {agendamento.clientName}
              </p>
              <p className="text-sm text-muted-foreground">
                {agendamento.clientEmail}
              </p>
              <p className="text-sm text-muted-foreground">
                {agendamento.clientPhone}
              </p>
            </div>

            {/* Serviço */}
            <div
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold"
              style={{
                backgroundColor: `${agendamento.service.color}20`,
                color: agendamento.service.color,
              }}
            >
              {agendamento.service.name} - {agendamento.barber.timeService}min
            </div>

            {/* Barbeiro */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={agendamento.barber.imageUrl}
                  alt={agendamento.barber.name}
                />
                <AvatarFallback>
                  {agendamento.barber.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {agendamento.barber.name}
                </p>
                <p className="text-sm text-muted-foreground">Barbeiro</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
