"use client";

import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dados de exemplo - você deve substituir com dados reais do seu backend
const chartdata = [
  {
    month: "Jan",
    cortes: 45,
  },
  {
    month: "Fev",
    cortes: 52,
  },
  {
    month: "Mar",
    cortes: 48,
  },
  {
    month: "Abr",
    cortes: 60,
  },
  {
    month: "Mai",
    cortes: 55,
  },
  {
    month: "Jun",
    cortes: 65,
  },
];

const proximosAgendamentos = [
  {
    cliente: "João Silva",
    servico: "Corte + Barba",
    data: new Date(2024, 2, 25, 14, 30),
    valor: 50,
  },
  {
    cliente: "Pedro Santos",
    servico: "Corte",
    data: new Date(2024, 2, 25, 15, 30),
    valor: 35,
  },
];

export default function DashboardPage() {
  const totalGanho = 2500; // Substitua com dados reais
  const totalGasto = 800; // Substitua com dados reais
  const cortesNoMes = 65; // Substitua com dados reais

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Cortes no Mês</p>
          <p className="text-2xl font-bold mt-2">{cortesNoMes}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Ganho</p>
          <p className="text-2xl font-bold mt-2">R$ {totalGanho.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Gasto</p>
          <p className="text-2xl font-bold mt-2">R$ {totalGasto.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Histórico de Cortes por Mês</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="cortes"
                fill="#3b82f6"
                name="Quantidade de Cortes"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Próximos Agendamentos</h2>
        <div className="divide-y">
          {proximosAgendamentos.map((agendamento, index) => (
            <div key={index} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{agendamento.cliente}</p>
                  <p className="text-sm text-muted-foreground">
                    {agendamento.servico}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    R$ {agendamento.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(agendamento.data, "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
