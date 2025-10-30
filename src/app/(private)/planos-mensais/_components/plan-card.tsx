"use client";


import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Pen, Scissors, Trash } from "lucide-react";
import { PlanoMensalComServicos } from "@/actions/planos-actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PlanCardProps {
  plano: PlanoMensalComServicos;
}



export default function PlanCard({ plano }: PlanCardProps) {
  return <>
    <Card className="w-full">
      <CardHeader className="">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center w-full">
            <Scissors className="w-8 h-8" />
            <span className="text-zinc-900 font-medium md:text-xl">{plano.nome}</span>
            {plano.categoria === 'basico' ?
              <Badge className="bg-green-500 hover:bg-green-600 text-white px-2 rounded-full">Básico</Badge> :
              plano.categoria === 'premium' ?
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-2 rounded-full">Premium</Badge> :
                plano.categoria === 'plus' ?
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-2 rounded-full">Plus</Badge> :
                  <Badge className="bg-gray-500 hover:bg-gray-600 text-white px-2 rounded-full">{plano.categoria}</Badge>
            }
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center w-full">
          <div className="flex gap-2">
              <span className="text-zinc-900 font-medium md:text-xl">R$ {plano.preco}</span>
          </div>
        
          <span className="text-zinc-500 font-medium md:text-sm">
            {plano.descricao}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link className="bg-zinc-900 justify-center text-white flex-1 rounded-md px-4 py-2 flex items-center gap-2" href={`/planos-mensais/${plano.id}`}>
          Editar
          <Pen className="w-4 h-4" />
        </Link>
        <Button className="bg-red-500 text-white flex-1 rounded-md px-4 py-2 flex items-center gap-2">
          Remover
          <Trash className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  </>

}

