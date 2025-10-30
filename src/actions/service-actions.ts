"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/index"
import { categoriaEnum, servicos } from "@/db/schema"
import { checkAuthAction } from "@/actions/auth-actions"
import type { Service } from "@/lib/types"

export interface CriarServicoData {
  nome: string;
  preco: number | string;
}

export interface EditarServicoData {
  id: number
  nome?: string
  preco?: number | string
}

export interface ServiceResult {
  success: boolean
  message: string
  data?: Service | Service[] | null
}

function toDecimalString(value: number | string): string {
  if (typeof value === "number") {
    return value.toFixed(2)
  }
  // Garantir duas casas decimais se vier como string
  const num = Number(value)
  if (Number.isFinite(num)) {
    return num.toFixed(2)
  }
  return value
}

// 📝 Criar um novo serviço
export async function criarServicoAction(data: CriarServicoData): Promise<ServiceResult> {
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

    // Validações
    if (!data.nome || data.nome.trim().length === 0) {
      return { success: false, message: "Nome do serviço é obrigatório" }
    }
    if (data.preco === undefined || data.preco === null) {
      return { success: false, message: "Preço do serviço é obrigatório" }
    }

    const novoServico = await db
      .insert(servicos)
      .values({
        nome: data.nome.trim(),
        preco: toDecimalString(data.preco),
        barbeariaId: 1,
      }).returning()

    revalidatePath("/servicos")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Serviço criado com sucesso!",
      data: novoServico[0],
    }
  } catch (error) {
    console.error("Erro ao criar serviço:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// 📋 Buscar todos os serviços
export async function buscarTodosServicosAction(): Promise<ServiceResult> {
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

    const todosServicos = await db.select().from(servicos)

    return {
      success: true,
      message: "Serviços encontrados com sucesso!",
      data: todosServicos as Service[],
    }
  } catch (error) {
    console.error("Erro ao buscar serviços:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// 🔍 Buscar serviço por ID
export async function buscarServicoPorIdAction(id: number): Promise<ServiceResult> {
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

    if (!id || id <= 0) {
      return { success: false, message: "ID do serviço é obrigatório e deve ser válido" }
    }

    const servico = await db.select().from(servicos).where(eq(servicos.id, id))

    if (servico.length === 0) {
      return { success: false, message: "Serviço não encontrado" }
    }

    return {
      success: true,
      message: "Serviço encontrado com sucesso!",
      data: servico[0],
    }
  } catch (error) {
    console.error("Erro ao buscar serviço:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// ✏️ Editar um serviço
export async function editarServicoAction(data: EditarServicoData): Promise<ServiceResult> {
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
      return { success: false, message: "ID do serviço é obrigatório e deve ser válido" }
    }

    const servicoExistente = await db.select().from(servicos).where(eq(servicos.id, data.id))
    if (servicoExistente.length === 0) {
      return { success: false, message: "Serviço não encontrado" }
    }

    const dadosAtualizacao: any = {}

    if (data.nome !== undefined) {
      if (data.nome.trim().length === 0) {
        return { success: false, message: "Nome do serviço não pode estar vazio" }
      }
      dadosAtualizacao.nome = data.nome.trim()
    }

    if (data.preco !== undefined) {
      dadosAtualizacao.preco = toDecimalString(data.preco)
    }


    const servicoAtualizado = await db
      .update(servicos)
      .set(dadosAtualizacao)
      .where(eq(servicos.id, data.id))
      .returning()

    revalidatePath("/servicos")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Serviço atualizado com sucesso!",
      data: servicoAtualizado[0],
    }
  } catch (error) {
    console.error("Erro ao editar serviço:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// 🗑️ Remover um serviço
export async function removerServicoAction(id: number): Promise<ServiceResult> {
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

    if (!id || id <= 0) {
      return { success: false, message: "ID do serviço é obrigatório e deve ser válido" }
    }

    const servicoExistente = await db.select().from(servicos).where(eq(servicos.id, id))
    if (servicoExistente.length === 0) {
      return { success: false, message: "Serviço não encontrado" }
    }

    const servicoRemovido = await db.delete(servicos).where(eq(servicos.id, id)).returning()

    revalidatePath("/servicos")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Serviço removido com sucesso!",
      data: servicoRemovido[0],
    }
  } catch (error) {
    console.error("Erro ao remover serviço:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// 🔍 Buscar serviços por barbearia
export async function buscarServicosPorBarbeariaAction(barbeariaId: number): Promise<ServiceResult> {
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

    if (!barbeariaId || barbeariaId <= 0) {
      return { success: false, message: "ID da barbearia é obrigatório e deve ser válido" }
    }

    const servicosDaBarbearia = await db
      .select()
      .from(servicos)
      .where(eq(servicos.barbeariaId, barbeariaId))

    return {
      success: true,
      message: "Serviços da barbearia encontrados com sucesso!",
      data: servicosDaBarbearia as Service[],
    }
  } catch (error) {
    console.error("Erro ao buscar serviços da barbearia:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}