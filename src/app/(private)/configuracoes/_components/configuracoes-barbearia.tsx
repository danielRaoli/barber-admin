"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Store, Users, Scissors, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { editarBarbeariaAction } from "@/actions/barbearia-actions"

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  fidelidadeAtiva: z.boolean(),
  fidelidadeQuantidade: z.number().min(0, "Deve ser um número positivo"),
  horaPausaEntreServicos: z.number().min(0, "Deve ser um número positivo"),
})

type FormValues = z.infer<typeof formSchema>

interface ConfiguracoesBarbeariaProps {
  barbearia: {
    id: number
    nome: string
    fidelidadeAtiva: boolean
    fidelidadeQuantidade: number | null
    horaPausaEntreServicos: number | null
  }
  quantidadeBarbeiros: number
  quantidadeServicos: number
  quantidadePlanosMensais: number
}

export function ConfiguracoesBarbearia({
  barbearia,
  quantidadeBarbeiros,
  quantidadeServicos,
  quantidadePlanosMensais,
}: ConfiguracoesBarbeariaProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: barbearia.nome,
      fidelidadeAtiva: barbearia.fidelidadeAtiva,
      fidelidadeQuantidade: barbearia.fidelidadeQuantidade || 0,
      horaPausaEntreServicos: barbearia.horaPausaEntreServicos || 0,
    },
  })

  const initialValues = {
    nome: barbearia.nome,
    fidelidadeAtiva: barbearia.fidelidadeAtiva,
    fidelidadeQuantidade: barbearia.fidelidadeQuantidade || 0,
    horaPausaEntreServicos: barbearia.horaPausaEntreServicos || 0,
  }

  // Monitorar mudanças nos campos
  useEffect(() => {
    const subscription = form.watch((values) => {
      const changed = 
        values.nome !== initialValues.nome ||
        values.fidelidadeAtiva !== initialValues.fidelidadeAtiva ||
        values.fidelidadeQuantidade !== initialValues.fidelidadeQuantidade ||
        values.horaPausaEntreServicos !== initialValues.horaPausaEntreServicos

      setHasChanges(changed)
    })

    return () => subscription.unsubscribe()
  }, [form, initialValues])

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    
    try {
      const result = await editarBarbeariaAction(data)
      
      if (result.success) {
        toast.success(result.message)
        setHasChanges(false)
        // Atualizar valores iniciais após salvar
        Object.assign(initialValues, data)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    {
      title: "Barbeiros",
      value: quantidadeBarbeiros,
      icon: Users,
    },
    {
      title: "Serviços",
      value: quantidadeServicos,
      icon: Scissors,
    },
    {
      title: "Planos Mensais",
      value: quantidadePlanosMensais,
      icon: CreditCard,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Configurações da Barbearia
        </CardTitle>
        <CardDescription>
          Gerencie as informações básicas da sua barbearia
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="text-center p-3 bg-muted/50 rounded-lg">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Formulário */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Barbearia</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da barbearia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fidelidadeAtiva"
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
                      Programa de Fidelidade Ativo
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Ative o programa de fidelidade para seus clientes
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("fidelidadeAtiva") && (
              <FormField
                control={form.control}
                name="fidelidadeQuantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade para Fidelidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Número de serviços para ganhar um gratuito
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="horaPausaEntreServicos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pausa Entre Serviços (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 15"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Tempo de pausa entre cada serviço
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={!hasChanges || isLoading}
              className="w-full"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}