"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

interface Agendamento {
  id: string;
  codigo: string;
  cliente: Cliente;
  data: Date;
  hora: string;
  barbeiro: Barbeiro;
  servico: Servico;
  status: "agendado" | "concluido" | "cancelado";
}

interface TabelaAgendamentosProps {
  agendamentos: Agendamento[];
}

export function TabelaAgendamentos({ agendamentos }: TabelaAgendamentosProps) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Barbeiro</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agendamentos.map((agendamento) => (
            <TableRow key={agendamento.id}>
              <TableCell className="font-medium">
                {agendamento.codigo}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {agendamento.cliente.nome}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {agendamento.cliente.email}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {agendamento.cliente.telefone}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatarData(agendamento.data)}</TableCell>
              <TableCell>{formatarHora(agendamento.hora)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={agendamento.barbeiro.avatar}
                      alt={agendamento.barbeiro.nome}
                    />
                    <AvatarFallback>
                      {agendamento.barbeiro.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{agendamento.barbeiro.nome}</span>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  style={{
                    backgroundColor: `${agendamento.servico.cor}20`,
                    color: agendamento.servico.cor,
                  }}
                >
                  {agendamento.servico.nome}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(agendamento.status)}
                >
                  {getStatusText(agendamento.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
