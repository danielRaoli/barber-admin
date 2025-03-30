"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface HorarioFuncionamento {
  dia: string;
  abertura: string;
  fechamento: string;
  aberto: boolean;
}

export default function ConfiguracoesPage() {
  const [dadosBarbearia, setDadosBarbearia] = useState({
    nome: "",
    email: "",
    telefone: "",
    instagram: "",
  });

  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>([
    {
      dia: "Segunda-feira",
      abertura: "09:00",
      fechamento: "18:00",
      aberto: true,
    },
    {
      dia: "Terça-feira",
      abertura: "09:00",
      fechamento: "18:00",
      aberto: true,
    },
    {
      dia: "Quarta-feira",
      abertura: "09:00",
      fechamento: "18:00",
      aberto: true,
    },
    {
      dia: "Quinta-feira",
      abertura: "09:00",
      fechamento: "18:00",
      aberto: true,
    },
    {
      dia: "Sexta-feira",
      abertura: "09:00",
      fechamento: "18:00",
      aberto: true,
    },
    { dia: "Sábado", abertura: "09:00", fechamento: "18:00", aberto: true },
    { dia: "Domingo", abertura: "09:00", fechamento: "18:00", aberto: false },
  ]);

  const handleDadosChange =
    (campo: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setDadosBarbearia((prev) => ({
        ...prev,
        [campo]: event.target.value,
      }));
    };

  const toggleHorarioStatus = (index: number) => {
    setHorarios((prev) =>
      prev.map((horario, i) =>
        i === index ? { ...horario, aberto: !horario.aberto } : horario
      )
    );
  };

  const handleHorarioChange =
    (index: number, campo: "abertura" | "fechamento") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHorarios((prev) =>
        prev.map((horario, i) =>
          i === index ? { ...horario, [campo]: event.target.value } : horario
        )
      );
    };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Configurações da Barbearia</h1>

      {/* Informações Básicas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Barbearia</Label>
              <Input
                id="nome"
                placeholder="Nome da Barbearia"
                value={dadosBarbearia.nome}
                onChange={handleDadosChange("nome")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={dadosBarbearia.email}
                onChange={handleDadosChange("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="Telefone"
                value={dadosBarbearia.telefone}
                onChange={handleDadosChange("telefone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="Instagram"
                value={dadosBarbearia.instagram}
                onChange={handleDadosChange("instagram")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horários de Funcionamento */}
      <h2 className="text-2xl font-semibold mb-4">Horários de Funcionamento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {horarios.map((horario, index) => (
          <Card key={horario.dia}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{horario.dia}</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={horario.aberto}
                      onCheckedChange={() => toggleHorarioStatus(index)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {horario.aberto ? "Aberto" : "Fechado"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`abertura-${index}`}>Abertura</Label>
                    <Input
                      id={`abertura-${index}`}
                      type="time"
                      value={horario.abertura}
                      onChange={handleHorarioChange(index, "abertura")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`fechamento-${index}`}>Fechamento</Label>
                    <Input
                      id={`fechamento-${index}`}
                      type="time"
                      value={horario.fechamento}
                      onChange={handleHorarioChange(index, "fechamento")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        className="mt-8 w-full md:w-auto"
        onClick={() => {
          console.log("Dados salvos:", { dadosBarbearia, horarios });
        }}
      >
        Salvar Configurações
      </Button>
    </div>
  );
}
