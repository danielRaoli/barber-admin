
import { buscarPlanoPorIdAction } from "@/actions/planos-actions";
import PlanConfig from "./_components/plan-config";
import { notFound } from "next/navigation";
import { buscarServicosPorBarbeariaAction, buscarTodosServicosAction } from "@/actions/service-actions";

interface PlanPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function PlanPage({ params }: PlanPageProps) {
    const { id } = await params;
    const {data: plano} = await buscarPlanoPorIdAction(Number(id));
    const {data: servicos = []} = await buscarTodosServicosAction();

    console.log(id)
        if (!plano) {
        return notFound()   ;
    }
    if (!servicos || !Array.isArray(servicos)) {
        return (
            <div>
                <span>Registre Algum serviço antes de adicionar um Plano Mensal</span>
            </div>  
        );
    }
    return (    
        <PlanConfig  servicos={servicos} plano={plano} />
    )
}