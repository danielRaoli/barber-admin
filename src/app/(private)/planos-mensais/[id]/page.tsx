"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Save, X } from "lucide-react";
import { PlanoMensal } from "../page";
import { useEditarPlanoMensal, useCriarServicoMensal, useAtualizarServicoMensal } from "@/hooks/mutations/plano-mutation";
import { useServicos } from "@/hooks/queries/service-querie";
import { toast } from "sonner";
import { PlanoMensalComServicos } from "@/actions/planos-actions";

interface PlanCardProps {
  plano: PlanoMensalComServicos;
}

interface ServicoMensal {
  id: number;
  servicoId: number;
  planoMensalId: number;
  quantidadePermitida: number;
  servico?: {
    id: number;
    nome: string;
    preco: string;
  };
}

export default function PlanPage({ plano }: PlanCardProps) {
  const [formData, setFormData] = useState({
    nome: plano.nome,
    descricao: plano.descricao || "",
    brinde: plano.brinde || "",
    preco: plano.preco,
    categoria: plano.categoria,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [servicosMensais, setServicosMensais] = useState<ServicoMensal[]>([]);
  const [newServicoData, setNewServicoData] = useState({
    servicoId: "",
    quantidadePermitida: "1",
  });

  const editarPlanoMutation = useEditarPlanoMensal();
  const criarServicoMensalMutation = useCriarServicoMensal();
  const atualizarServicoMensalMutation = useAtualizarServicoMensal();

  // Verificar se houve mudanças nos dados do plano
  useEffect(() => {
    const changed = 
      formData.nome !== plano.nome ||
      formData.descricao !== (plano.descricao || "") ||
      formData.brinde !== (plano.brinde || "") ||
      formData.preco !== plano.preco ||
      formData.categoria !== plano.categoria;
    
    setHasChanges(changed);
  }, [formData, plano]);

  // Simular busca de serviços mensais (seria necessário implementar a action)
  useEffect(() => {
    // Aqui você implementaria a busca dos serviços mensais do plano
    // Por enquanto, deixo vazio
    setServicosMensais([]);
  }, [plano.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePlano = async () => {
    try {
      await editarPlanoMutation.mutateAsync({
        id: plano.id,
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        brinde: formData.brinde || undefined,
        preco: formData.preco,
        categoria: formData.categoria as "basico" | "premium" | "plus",
      });
      toast.success("Plano atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
    }
  };

  const handleAddServico = async () => {
    if (!newServicoData.servicoId || !newServicoData.quantidadePermitida) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await criarServicoMensalMutation.mutateAsync({
        servicoId: parseInt(newServicoData.servicoId),
        planoMensalId: plano.id,
        quantidadePermitida: parseInt(newServicoData.quantidadePermitida),
      });
      
      setNewServicoData({ servicoId: "", quantidadePermitida: "1" });
      setIsDialogOpen(false);
      toast.success("Serviço adicionado ao plano!");
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
    }
  };

  const handleUpdateServicoMensal = async (servicoMensal: ServicoMensal, novaQuantidade: number) => {
    try {
      await atualizarServicoMensalMutation.mutateAsync({
        id: servicoMensal.id,
        quantidadePermitida: novaQuantidade,
      });
      toast.success("Serviço mensal atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar serviço mensal:", error);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Informações do Plano */}
        <div className="space-y-3">
          <div>
            <Label htmlFor={`nome-${plano.id}`}>Nome do Plano</Label>
            <Input
              id={`nome-${plano.id}`}
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Nome do plano"
            />
          </div>

          <div>
            <Label htmlFor={`descricao-${plano.id}`}>Descrição</Label>
            <Input
              id={`descricao-${plano.id}`}
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              placeholder="Descrição do plano"
            />
          </div>

          <div>
            <Label htmlFor={`brinde-${plano.id}`}>Brinde</Label>
            <Input
              id={`brinde-${plano.id}`}
              value={formData.brinde}
              onChange={(e) => handleInputChange("brinde", e.target.value)}
              placeholder="Brinde do plano"
            />
          </div>

          <div>
            <Label htmlFor={`preco-${plano.id}`}>Preço</Label>
            <Input
              id={`preco-${plano.id}`}
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={(e) => handleInputChange("preco", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor={`categoria-${plano.id}`}>Categoria</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => handleInputChange("categoria", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basico">Básico</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="plus">Plus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSavePlano}
            disabled={!hasChanges || editarPlanoMutation.isPending}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {editarPlanoMutation.isPending ? "Salvando..." : "Salvar Plano"}
          </Button>
        </div>

        {/* Seção de Serviços Mensais */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Serviços Mensais</h4>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Serviço ao Plano</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Serviço</Label>
                    <Select
                      value={newServicoData.servicoId}
                      onValueChange={(value) => setNewServicoData(prev => ({ ...prev, servicoId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {plano.servicosMensais.map((servico) => (
                          <SelectItem key={servico.id} value={servico.id.toString()}>
                            {servico.servico.nome} - R$ {servico.servico.preco}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Quantidade Permitida</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newServicoData.quantidadePermitida}
                      onChange={(e) => setNewServicoData(prev => ({ ...prev, quantidadePermitida: e.target.value }))}
                      placeholder="1"
                    />
                  </div>

                  <Button
                    onClick={handleAddServico}
                    disabled={criarServicoMensalMutation.isPending}
                    className="w-full"
                  >
                    {criarServicoMensalMutation.isPending ? "Adicionando..." : "Adicionar Serviço"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Serviços Mensais */}
          <div className="space-y-2">
            {servicosMensais.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum serviço adicionado ao plano
              </p>
            ) : (
              servicosMensais.map((servicoMensal) => (
                <ServicoMensalItem
                  key={servicoMensal.id}
                  servicoMensal={servicoMensal}
                  onUpdate={handleUpdateServicoMensal}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Componente para cada item de serviço mensal
interface ServicoMensalItemProps {
  servicoMensal: ServicoMensal;
  onUpdate: (servicoMensal: ServicoMensal, novaQuantidade: number) => void;
}

function ServicoMensalItem({ servicoMensal, onUpdate }: ServicoMensalItemProps) {
  const [quantidade, setQuantidade] = useState(servicoMensal.quantidadePermitida.toString());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(parseInt(quantidade) !== servicoMensal.quantidadePermitida);
  }, [quantidade, servicoMensal.quantidadePermitida]);

  const handleSave = () => {
    onUpdate(servicoMensal, parseInt(quantidade));
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <div className="flex-1">
        <p className="text-sm font-medium">
          {servicoMensal.servico?.nome || `Serviço ${servicoMensal.servicoId}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className="w-20"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges}
          variant="outline"
        >
          <Save className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}