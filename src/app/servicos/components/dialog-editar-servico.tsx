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
import { Service } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const colorOptions = {
  red: "Vermelho",
  blue: "Azul",
  green: "Verde",
  purple: "Roxo",
  orange: "Laranja",
  yellow: "Amarelo",
} as const;

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().min(1, "O preço deve ser no mínimo 1"),
  color: z.string().min(3, "Selecione uma cor válida"),
});

interface DialogEditarProps {
  service: Service | null;
  onClose: () => void;
  onUpdate: (formData: FormData, serviceId: number) => Promise<void>;
}

export default function DialogEditar({
  service,
  onClose,
  onUpdate,
}: DialogEditarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name,
      price: service?.price.toString(),
      color: service?.color,
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        price: service.price.toString(),
        color: service.color,
      });
    }
  }, [service, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!service) return;
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price || "");
      formData.append("color", values.color);
      await onUpdate(formData, service.id);
      form.reset();
      toast.success("Serviço atualizado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar serviço");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={service != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Barbeiro</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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
              name="price"
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

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do Serviço</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(colorOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full bg-${value}`}
                            />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Adicionando
                </>
              ) : (
                "Adicionar"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
