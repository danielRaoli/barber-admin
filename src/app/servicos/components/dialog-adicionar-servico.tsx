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
import { Loader, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateServiceData } from "../page";
const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().min(1, "Preço é obrigatório"),
  color: z.string().min(3, "Cor é obrigatória"),
});

interface DialogAdicionarServicoProps {
  onCreate: (data: CreateServiceData) => Promise<void>;
}

const colorOptions = {
  red: "Vermelho",
  blue: "Azul",
  green: "Verde",
  purple: "Roxo",
  orange: "Laranja",
  yellow: "Amarelo",
} as const;

export default function DialogAdicionarServico({
  onCreate,
}: DialogAdicionarServicoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      color: "",
    },
  });

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-300",
      blue: "bg-blue-300",
      green: "bg-green-300",
      yellow: "bg-yellow-300",
      purple: "bg-purple-300",
      pink: "bg-pink-300",
      orange: "bg-orange-300",
    };
  
    return colorMap[color] || "bg-gray-300"; // fallback para gray se a cor não existir
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const data = {
        name: values.name,
        price: parseFloat(values.price),
        color: values.color,
      };

      await onCreate(data);
      form.reset();
      setOpen(false);
      toast.success("Serviço criado com sucesso");
    } catch (error) {
      toast.error("Erro ao criar serviço");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Serviço</DialogTitle>
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
                              className={`w-4 h-4 rounded-full ${getColorClasses(value)}`}
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
