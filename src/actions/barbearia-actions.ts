"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/index"
import { barbearias, barbeiros, servicos, planosMensais, funcionamentos } from "@/db/schema"
import { checkAuthAction } from "@/actions/auth-actions"

export interface EditarBarbeariaData {
  nome?: string
  fidelidadeAtiva?: boolean
  fidelidadeQuantidade?: number
  horaPausaEntreServicos?: number
}

export interface BarbeariaResult {
  success: boolean
  message: string
  data?: any | any[] | null
}

// 📋 Buscar dados da barbearia com informações relacionadas (sempre ID 1)
export async function buscarDadosBarbeariaAction(): Promise<BarbeariaResult> {
  try {
    const { isAuthenticated, user } = await checkAuthAction()
    const adminEmail = process.env.NEXT_PUBLIC_EMAIL
    if (!isAuthenticated || !user) {
      return { success: false, message: "Usuário não autenticado" }
    }
    if (!adminEmail) {
      return { success: false, message: "Configuração de e-mail do administrador ausente" }
    }
    if (user.email !== adminEmail) {
      return { success: false, message: "Acesso negado" }
    }

    // Buscar dados da barbearia
    const barbearia = await db.select().from(barbearias).where(eq(barbearias.id, 1))

    if (barbearia.length === 0) {
      return { success: false, message: "Barbearia não encontrada" }
    }

    // Buscar barbeiros
    const barbeirosData = await db.select().from(barbeiros).where(eq(barbeiros.barbeariaId, 1))

    // Buscar serviços
    const servicosData = await db.select().from(servicos).where(eq(servicos.barbeariaId, 1))

    // Buscar planos mensais
    const planosMensaisData = await db.select().from(planosMensais).where(eq(planosMensais.barbeariaId, 1))

    // Buscar funcionamento
    const funcionamentoData = await db.select().from(funcionamentos).where(eq(funcionamentos.barbeariaId, 1))

    return {
      success: true,
      message: "Dados da barbearia encontrados com sucesso!",
      data: {
        barbearia: barbearia[0],
        barbeiros: barbeirosData,
        servicos: servicosData,
        planosMensais: planosMensaisData,
        funcionamento: funcionamentoData,
        quantidades: {
          barbeiros: barbeirosData.length,
          servicos: servicosData.length,
          planosMensais: planosMensaisData.length
        }
      },
    }
  } catch (error) {
    console.error("Erro ao buscar dados da barbearia:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// ✏️ Editar dados da barbearia (sempre ID 1)
export async function editarBarbeariaAction(data: EditarBarbeariaData): Promise<BarbeariaResult> {
  try {
    const { isAuthenticated, user } = await checkAuthAction()
    const adminEmail = process.env.NEXT_PUBLIC_EMAIL
    if (!isAuthenticated || !user) {
      return { success: false, message: "Usuário não autenticado" }
    }
    if (!adminEmail) {
      return { success: false, message: "Configuração de e-mail do administrador ausente" }
    }
    if (user.email !== adminEmail) {
      return { success: false, message: "Acesso negado: e-mail não autorizado" }
    }

    const barbeariaExistente = await db.select().from(barbearias).where(eq(barbearias.id, 1))
    if (barbeariaExistente.length === 0) {
      return { success: false, message: "Barbearia não encontrada" }
    }

    const dadosAtualizacao: any = {}

    if (data.nome !== undefined) {
      if (data.nome.trim().length === 0) {
        return { success: false, message: "Nome da barbearia não pode estar vazio" }
      }
      dadosAtualizacao.nome = data.nome.trim()
    }

    if (data.fidelidadeAtiva !== undefined) {
      dadosAtualizacao.fidelidadeAtiva = data.fidelidadeAtiva
    }

    if (data.fidelidadeQuantidade !== undefined) {
      if (data.fidelidadeQuantidade < 0) {
        return { success: false, message: "Quantidade de fidelidade deve ser um número positivo" }
      }
      dadosAtualizacao.fidelidadeQuantidade = data.fidelidadeQuantidade
    }

    if (data.horaPausaEntreServicos !== undefined) {
      if (data.horaPausaEntreServicos < 0) {
        return { success: false, message: "Hora de pausa entre serviços deve ser um número positivo" }
      }
      dadosAtualizacao.horaPausaEntreServicos = data.horaPausaEntreServicos
    }

    const barbeariaAtualizada = await db
      .update(barbearias)
      .set(dadosAtualizacao)
      .where(eq(barbearias.id, 1))
      .returning()

    revalidatePath("/configurações")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Dados da barbearia atualizados com sucesso!",
      data: barbeariaAtualizada[0],
    }
  } catch (error) {
    console.error("Erro ao editar dados da barbearia:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}