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
import type { Product } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { useCriarProduto } from "@/hooks/mutations/product-mutations";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  preco: z
    .string()
    .min(1, "Preço é obrigatório")
    .regex(/^\d+(?:[\.,]\d{1,2})?$/, "Informe um número válido"),
  descricao: z.string().optional().nullable(),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Tamanho máximo do arquivo é 5MB")
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Formatos suportados: .jpg, .jpeg, .png, .webp")
    .optional()
    .nullable(),
});


export type CreateProductData = Pick<Product, "nome" | "preco" | "descricao" | "barbeariaId"> & { imageFile?: File };

export default function DialogAdicionarProduto() {
  const [open, setOpen] = useState(false);
  const criarProduto = useCriarProduto();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      preco: "",
      descricao: "",
      imageFile: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload: CreateProductData = {
        nome: values.nome,
        preco: values.preco.replace(",", "."),
        descricao: values.descricao ?? null,
        barbeariaId: 1,
        imageFile: values.imageFile ?? undefined,
      };
      await criarProduto.mutateAsync(payload);

      form.reset();
      setOpen(false);
      toast.success("Produto criado com sucesso");
    } catch (error) {
      toast.error("Erro ao criar produto");
    } 
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
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
                    <Input placeholder="Nome do produto" {...field} />
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
                    <Input
                      placeholder="29.90"
                      type="number"
                      step="0.01"
                      {...field}
                    />
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
                      className="resize-none"
                      placeholder="Descrição do produto (opcional)"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                disabled={criarProduto.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={criarProduto.isPending}>
                {criarProduto.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Criar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
