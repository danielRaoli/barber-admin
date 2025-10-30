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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useCriarBarbeiro } from "@/hooks/mutations/barbeiros-mutations";

// Schema Zod baseado na tabela barbeiros
const barbeiroSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  whatsapp: z.string().max(20, "WhatsApp muito longo").optional().or(z.literal("")),
  instagram: z.string().max(255, "Instagram muito longo").optional().or(z.literal("")),
  horaAbertura: z.string().optional().or(z.literal("")),
  horaFechamento: z.string().optional().or(z.literal("")),
  funcionamentoPersonalizado: z.boolean().default(false),
  horaPausaEntreServicos: z.coerce.number().min(0, "Deve ser um número positivo").optional(),
  barbeariaId: z.coerce.number().min(1, "ID da barbearia é obrigatório"),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Arquivo deve ter no máximo 5MB")
    .refine(
      (file) => ["image/png", "image/jpg", "image/jpeg"].includes(file.type),
      "Apenas arquivos PNG, JPG e JPEG são permitidos"
    )
    .optional(),
});

type BarbeiroFormData = z.infer<typeof barbeiroSchema>;

export default function DialogAdicionar() {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const criarBarbeiro = useCriarBarbeiro();

  const form = useForm<BarbeiroFormData>({
    resolver: zodResolver(barbeiroSchema),
    defaultValues: {
      nome: "",
      whatsapp: "",
      instagram: "",
      horaAbertura: "",
      horaFechamento: "",
      funcionamentoPersonalizado: false,
      horaPausaEntreServicos: 0,
      barbeariaId: 1, // Você pode ajustar isso conforme necessário
      imageFile: undefined,
    },
  });

  const onSubmit = async (data: BarbeiroFormData) => {
    try {
      // Converter campos vazios para undefined para corresponder ao tipo CriarBarbeiroData
      const dadosLimpos = {
        nome: data.nome,
        whatsapp: data.whatsapp || undefined,
        instagram: data.instagram || undefined,
        horaAbertura: data.horaAbertura || undefined,
        horaFechamento: data.horaFechamento || undefined,
        funcionamentoPersonalizado: data.funcionamentoPersonalizado,
        horaPausaEntreServicos: data.horaPausaEntreServicos || undefined,
        barbeariaId: data.barbeariaId,
        imageFile: data.imageFile,
      };

      await criarBarbeiro.mutateAsync(dadosLimpos);
      
      toast.success("Barbeiro criado com sucesso!");
      form.reset();
      setImagePreview(null); // Limpar preview da imagem
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar barbeiro");
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Barbeiro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Barbeiro</DialogTitle>
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
                    <Input placeholder="Nome do barbeiro" {...field} />
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
                    <Input placeholder="(11) 99999-9999" {...field} />
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
                    <Input placeholder="@usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="horaAbertura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora Abertura</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                    <FormLabel>Hora Fechamento</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="funcionamentoPersonalizado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Funcionamento Personalizado</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="horaPausaEntreServicos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pausa Entre Serviços (minutos)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barbeariaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID da Barbearia *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="1"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Imagem do Barbeiro</FormLabel>
                  <FormControl>
                    <Input 
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                        
                        // Criar preview da imagem
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setImagePreview(null);
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              disabled={criarBarbeiro.isPending} 
              type="submit" 
              className="w-full"
            >
              {criarBarbeiro.isPending ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Adicionando...
                </>
              ) : (
                "Adicionar Barbeiro"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
