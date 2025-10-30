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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Service } from "@/lib/types";
import { useEditarServico } from "@/hooks/mutations/service-mutations";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  preco: z.string().min(1, "O preço é obrigatório"),
});

interface DialogEditarProps {
  service: Service | null;
  onClose: () => void;
}

export default function DialogEditar({
  service,
  onClose,
}: DialogEditarProps) {
  const editarServico = useEditarServico();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: service?.nome ?? "",
      preco: service?.preco?.toString() ?? "",
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        nome: service.nome,
        preco: service.preco?.toString() ?? "",
      });
    }
  }, [service, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!service) return;
      await editarServico.mutateAsync({
        id: service.id,
        nome: values.nome,
        preco: values.preco,
      });

      form.reset();
      toast.success("Serviço atualizado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar serviço");
    }
  }

  return (
    <Dialog open={service != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={editarServico.isPending} type="submit" className="w-full">
              {editarServico.isPending ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Salvando
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
