import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Scissors, Calendar, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Clientes Hoje",
    value: "24",
    icon: Users,
  },
  {
    title: "Serviços Hoje",
    value: "12",
    icon: Scissors,
  },
  {
    title: "Agendamentos",
    value: "32",
    icon: Calendar,
  },
  {
    title: "Faturamento",
    value: "R$ 1.250",
    icon: DollarSign,
  },
];

export function DailyStats() {
  return stats.map((stat) => (
    <Card key={stat.title}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <stat.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
      </CardContent>
    </Card>
  ));
}
