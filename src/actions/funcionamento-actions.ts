"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/index"
import { funcionamentos } from "@/db/schema"
import { checkAuthAction } from "@/actions/auth-actions"

export interface EditarFuncionamentoData {
  id: number
  horaAbertura?: string
  horaFechamento?: string
  funcionando?: boolean
}

export interface FuncionamentoResult {
  success: boolean
  message: string
  data?: any | any[] | null
}

// 📋 Buscar todos os horários de funcionamento
export async function buscarTodosFuncionamentoAction(): Promise<FuncionamentoResult> {
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

    const todosFuncionamentos = await db.select().from(funcionamentos)

    return {
      success: true,
      message: "Horários de funcionamento encontrados com sucesso!",
      data: todosFuncionamentos,
    }
  } catch (error) {
    console.error("Erro ao buscar horários de funcionamento:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// ✏️ Editar um horário de funcionamento
export async function editarFuncionamentoAction(data: EditarFuncionamentoData): Promise<FuncionamentoResult> {
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

    if (!data.id || data.id <= 0) {
      return { success: false, message: "ID do funcionamento é obrigatório e deve ser válido" }
    }

    const funcionamentoExistente = await db.select().from(funcionamentos).where(eq(funcionamentos.id, data.id))
    if (funcionamentoExistente.length === 0) {
      return { success: false, message: "Horário de funcionamento não encontrado" }
    }

    const dadosAtualizacao: any = {}


    if (data.horaAbertura !== undefined) {
      if (data.horaAbertura.trim().length === 0) {
        return { success: false, message: "Hora de abertura não pode estar vazia" }
      }
      dadosAtualizacao.horaAbertura = data.horaAbertura.trim()
    }

    if (data.horaFechamento !== undefined) {
      if (data.horaFechamento.trim().length === 0) {
        return { success: false, message: "Hora de fechamento não pode estar vazia" }
      }
      dadosAtualizacao.horaFechamento = data.horaFechamento.trim()
    }

    if (data.funcionando !== undefined) {
      dadosAtualizacao.funcionando = data.funcionando
    }

    const funcionamentoAtualizado = await db
      .update(funcionamentos)
      .set(dadosAtualizacao)
      .where(eq(funcionamentos.id, data.id))
      .returning()

    revalidatePath("/configurações")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Horário de funcionamento atualizado com sucesso!",
      data: funcionamentoAtualizado[0],
    }
  } catch (error) {
    console.error("Erro ao editar horário de funcionamento:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}