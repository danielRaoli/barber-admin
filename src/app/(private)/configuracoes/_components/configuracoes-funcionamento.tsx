"use client"

import { useState } from "react"
import { Clock, Edit, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EditarFuncionamentoDialog } from "./editar-funcionamento-dialog"


interface FuncionamentoData {
  id: number
  diaSemana: "domingo" | "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado"
  horaAbertura: string
  horaFechamento: string
  funcionando: boolean
  barbeariaId: number
}

interface ConfiguracoesFuncionamentoProps {
  funcionamento: FuncionamentoData[]
}

const diasSemanaMap = {
  domingo: "Domingo",
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
}

const ordensDiasSemana = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
}

export function ConfiguracoesFuncionamento({ funcionamento }: ConfiguracoesFuncionamentoProps) {
  const [funcionamentoSelecionado, setFuncionamentoSelecionado] = useState<FuncionamentoData | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  // Ordenar funcionamento por dia da semana
  const funcionamentoOrdenado = [...funcionamento].sort(
    (a, b) => ordensDiasSemana[a.diaSemana] - ordensDiasSemana[b.diaSemana]
  )

  const handleEditarFuncionamento = (item: FuncionamentoData) => {
    setFuncionamentoSelecionado(item)
    setDialogAberto(true)
  }

  const handleFecharDialog = () => {
    setDialogAberto(false)
    setFuncionamentoSelecionado(null)
  }

  const formatarHora = (hora: string) => {
    // Se a hora já está no formato HH:MM, retorna como está
    if (hora.includes(':')) {
      return hora
    }
    // Se está no formato HHMM, adiciona os dois pontos
    if (hora.length === 4) {
      return `${hora.slice(0, 2)}:${hora.slice(2)}`
    }
    return hora
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Horários de Funcionamento
          </CardTitle>
          <CardDescription>
            Configure os horários de funcionamento da sua barbearia
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia da Semana</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funcionamentoOrdenado.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {diasSemanaMap[item.diaSemana]}
                  </TableCell>
                  <TableCell>
                    {item.funcionando ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatarHora(item.horaAbertura)} - {formatarHora(item.horaFechamento)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Fechado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.funcionando ? "default" : "secondary"}>
                      {item.funcionando ? "Aberto" : "Fechado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditarFuncionamento(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditarFuncionamentoDialog
        funcionamento={funcionamentoSelecionado}
        aberto={dialogAberto}
        onFechar={handleFecharDialog}
      />
    </>
  )
}