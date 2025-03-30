

import { Agendamento } from "@/lib/types";
import { CardsAgendamentos } from "./components/cards-agendamentos";

const fetchAgendamentos = async () => {
  const response = await fetch("http://localhost:5079/api/appoiment");
  const data = await response.json();
  return data.data as Agendamento[];
};

export default async function AgendamentosPage() {
  const agendamentos = await fetchAgendamentos();
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Agendamentos</h1>
      </div>
      <CardsAgendamentos agendamentos={agendamentos} />
    </div>
  );
}
