"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useCriarPlanoMensal } from "@/hooks/mutations/plano-mutation";

// Schema Zod baseado na tabela planosMensais
const planoMensalSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  descricao: z.string().optional().or(z.literal("")),
  brinde: z.string().max(255, "Brinde muito longo").optional().or(z.literal("")),
  preco: z.string().min(1, "Preço é obrigatório").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Preço deve ser um número maior que zero"),
  categoria: z.enum(["basico", "premium", "plus"], {
    required_error: "Categoria é obrigatória",
  }),
});

type PlanoMensalFormData = z.infer<typeof planoMensalSchema>;

export default function DialogAdicionarPlan() {
  const [open, setOpen] = useState(false);
  const criarPlanoMensal = useCriarPlanoMensal();

  const form = useForm<PlanoMensalFormData>({
    resolver: zodResolver(planoMensalSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      brinde: "",
      preco: "",
      categoria: undefined,
    },
  });

  const onSubmit = async (data: PlanoMensalFormData) => {
    try {
      // Converter campos vazios para undefined para corresponder ao tipo CriarPlanoMensalData
      const dadosLimpos = {
        nome: data.nome,
        descricao: data.descricao || undefined,
        brinde: data.brinde || undefined,
        preco: data.preco,
        categoria: data.categoria,
      };

      await criarPlanoMensal.mutateAsync(dadosLimpos);
      
      toast.success("Plano mensal criado com sucesso!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar plano mensal");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Adicionar Plano
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Plano Mensal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do plano mensal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do plano mensal" 
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brinde"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brinde</FormLabel>
                  <FormControl>
                    <Input placeholder="Brinde incluído no plano" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="plus">Plus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              disabled={criarPlanoMensal.isPending} 
              type="submit" 
              className="w-full"
            >
              {criarPlanoMensal.isPending ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Adicionando...
                </>
              ) : (
                "Adicionar Plano Mensal"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}