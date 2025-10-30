import DialogAdicionar from "./components/dialog-adicionar";
import BarberList from "./components/barber-list";
import { useBarbeiros } from "@/hooks/queries/barbeiros-queries";
import { barbeiros } from "@/db/schema";
import { buscarTodosBarbeirosAction } from "@/actions/barbeiro-actions";

export type Barber = typeof barbeiros.$inferSelect

export default async function BarbersPage() {
 const { data: barbers = [] as Barber[] } = await buscarTodosBarbeirosAction();
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Barbeiros</h1>
        <DialogAdicionar />
      </div>
      <BarberList
        barbers={barbers}
      />
    </div>
  );
}
