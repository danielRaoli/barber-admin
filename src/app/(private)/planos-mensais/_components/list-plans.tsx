"use client";

import { PlanoMensalComServicos } from "@/actions/planos-actions";
import { PlanoMensal } from "../page";
import PlanCard from "./plan-card";

interface ListPlansProps {
  planos: PlanoMensalComServicos[];
}

export default function ListPlans({ planos }: ListPlansProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {planos.map((plano) => (
        <PlanCard key={plano.id} plano={plano} />
      ))}
    </div>
  );
}