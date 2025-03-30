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
import { Barber } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Tamanho máximo do arquivo é 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Formatos suportados: .jpg, .jpeg, .png, .webp"
    )
    .optional()
    .nullable(),
  whatsapp: z.string().min(11, "o número deve ter pelo menos 11 dígitos"),
  instagram: z.string().min(1, "Instagram inválido"),
  serviceTime: z.string(),
});

interface DialogEditarProps {
  barber: Barber | null;
  onClose: () => void;
  onUpdate: (formData: FormData, barberId: number) => Promise<void>;
}

export default function DialogEditar({
  barber,
  onClose,
  onUpdate,
}: DialogEditarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: null,
      whatsapp: "",
      instagram: "",
      serviceTime: "",
    },
  });

  useEffect(() => {
    if (barber) {
      form.reset({
        name: barber.name,
        image: null,
        whatsapp: barber.whatsApp,
        instagram: barber.instagram,
        serviceTime: barber.timeService.toString(),
      });
    }
  }, [barber, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!barber) return;
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("image", values.image || "");
      formData.append("whatsapp", values.whatsapp);
      formData.append("instagram", values.instagram);
      formData.append("serviceTime", values.serviceTime);
      await onUpdate(formData, barber.id);
      form.reset();
      toast.success("Barbeiro atualizado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar barbeiro");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={barber != null} onOpenChange={(open) => !open && onClose()}>
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem do Barbeiro</FormLabel>
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
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de Serviço</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? (
                <>
                  <Loader className="animate-spin" />
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
