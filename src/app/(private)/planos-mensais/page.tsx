import { buscarTodosPlanosMensaisAction, PlanoMensalComServicos } from "@/actions/planos-actions";
import { planosMensais } from "@/db/schema";
import ListPlans from "./_components/list-plans";
import DialogAdicionarPlan from "./_components/dialog-adicionar-plan";



export type PlanoMensal = typeof planosMensais.$inferSelect;

export default async function PlanosMensaisPage() {
  const { data: planos = [] as PlanoMensalComServicos[] } = await buscarTodosPlanosMensaisAction();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Planos Mensais</h1>
        <DialogAdicionarPlan />
      </div>

      <ListPlans planos={planos} />


    </div>
  );
}