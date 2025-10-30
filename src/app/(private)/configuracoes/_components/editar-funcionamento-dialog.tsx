"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { editarFuncionamentoAction } from "@/actions/funcionamento-actions"

interface FuncionamentoData {
  id: number
  diaSemana: "domingo" | "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado"
  horaAbertura: string
  horaFechamento: string
  funcionando: boolean
  barbeariaId: number
}

interface EditarFuncionamentoDialogProps {
  funcionamento: FuncionamentoData | null
  aberto: boolean
  onFechar: () => void
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

const funcionamentoSchema = z.object({
  funcionando: z.boolean(),
  horaAbertura: z.string().min(1, "Hora de abertura é obrigatória"),
  horaFechamento: z.string().min(1, "Hora de fechamento é obrigatória"),
})

type FuncionamentoFormData = z.infer<typeof funcionamentoSchema>

export function EditarFuncionamentoDialog({
  funcionamento,
  aberto,
  onFechar,
}: EditarFuncionamentoDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FuncionamentoFormData>({
    resolver: zodResolver(funcionamentoSchema),
    defaultValues: {
      funcionando: false,
      horaAbertura: "",
      horaFechamento: "",
    },
  })

  const formatarHoraParaInput = (hora: string) => {
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

  const formatarHoraParaBanco = (hora: string) => {
    // Remove os dois pontos para salvar no formato HHMM
    return hora.replace(':', '')
  }

  useEffect(() => {
    if (funcionamento) {
      form.reset({
        funcionando: funcionamento.funcionando,
        horaAbertura: formatarHoraParaInput(funcionamento.horaAbertura),
        horaFechamento: formatarHoraParaInput(funcionamento.horaFechamento),
      })
    }
  }, [funcionamento, form])

  const onSubmit = async (data: FuncionamentoFormData) => {
    if (!funcionamento) return

    setIsLoading(true)
    try {
      const dadosParaEditar = {
        id: funcionamento.id,
        funcionando: data.funcionando,
        horaAbertura: formatarHoraParaBanco(data.horaAbertura),
        horaFechamento: formatarHoraParaBanco(data.horaFechamento),
      }

      await editarFuncionamentoAction(dadosParaEditar)
      
      toast.success("Horário de funcionamento atualizado com sucesso!")
      onFechar()
      
      // Recarregar a página para atualizar os dados
      window.location.reload()
    } catch (error) {
      console.error("Erro ao atualizar funcionamento:", error)
      toast.error("Erro ao atualizar horário de funcionamento")
    } finally {
      setIsLoading(false)
    }
  }

  if (!funcionamento) return null

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Funcionamento</DialogTitle>
          <DialogDescription>
            Configure o horário de funcionamento para {diasSemanaMap[funcionamento.diaSemana]}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="funcionando"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Funcionando neste dia
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("funcionando") && (
              <>
                <FormField
                  control={form.control}
                  name="horaAbertura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Abertura</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="horaFechamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Fechamento</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onFechar}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}