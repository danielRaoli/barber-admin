"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Product } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useEditarProduto } from "@/hooks/mutations/product-mutations";

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
    .min(1, "O preço deve ser no mínimo 1")
    .regex(/^\d+(?:[\.,]\d{1,2})?$/, "Informe um número válido"),
  descricao: z.string().optional().nullable(),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Tamanho máximo do arquivo é 5MB")
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Formatos suportados: .jpg, .jpeg, .png, .webp")
    .optional()
    .nullable(),
});

interface DialogEditarProdutoProps {
  product: Product | null;
  onClose: () => void;
 
}

export default function DialogEditarProduto({
  product,
  onClose,
}: DialogEditarProdutoProps) {

  const atualizarProduto = useEditarProduto();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      preco: "",
      descricao: "",
      imageFile: undefined,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        nome: product.nome,
        preco: String(product.preco ?? ""),
        descricao: product.descricao ?? "",
        imageFile: undefined,
      });
    }
  }, [product, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!product) return;
      
      const payload = {
        id: product.id,
        nome: values.nome,
        preco: values.preco.replace(",", "."),
        descricao: values.descricao ?? null,
        imageFile: values.imageFile ?? undefined,
      };
      await atualizarProduto.mutateAsync(payload);
      form.reset();
      toast.success("Produto atualizado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar produto");
    } 
  }

  return (
    <Dialog open={product != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
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
                    <Input
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
                  <FormLabel>Imagem do Produto</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
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
                onClick={onClose}
                disabled={atualizarProduto.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={atualizarProduto.isPending}>
                {atualizarProduto.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
