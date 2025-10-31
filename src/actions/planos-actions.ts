"use server"

import { and,eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/index"
import { planosMensais, servicosMensais, servicos } from "@/db/schema"
import { checkAuthAction } from "@/actions/auth-actions"

// Tipos para as operações
export interface ServicoMensalData {
  servicoId: number
  quantidadePermitida?: number
  ilimitado?: boolean
}

export interface CriarPlanoMensalData {
  nome: string
  descricao?: string
  brinde?: string
  preco: string
  categoria: "basico" | "premium" | "plus"
}

export interface EditarPlanoMensalData {
  id: number
  nome?: string
  descricao?: string
  brinde?: string
  preco?: string
  categoria?: "basico" | "premium" | "plus"
}

export interface PlanoMensalResult {
  success: boolean
  message: string
  data?: any
}

export type PlanoMensal = typeof planosMensais.$inferSelect
export type ServicoMensal = typeof servicosMensais.$inferSelect

// Tipo para plano mensal com serviços mensais incluídos
export interface PlanoMensalComServicos extends PlanoMensal {
  servicosMensais: Array<{
    id: number
    servicoId: number
    planoMensalId: number
    quantidadePermitida: number
    servico: {
      id: number
      nome: string
      preco: string
      barbeariaId: number
    }
  }>
}

// 📝 Criar um novo plano mensal
export async function criarPlanoMensalAction(data: CriarPlanoMensalData): Promise<PlanoMensalResult> {
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

    // Validação básica
    if (!data.nome || data.nome.trim().length === 0) {
      return {
        success: false,
        message: "Nome do plano mensal é obrigatório"
      }
    }

    if (!data.preco || parseFloat(data.preco) <= 0) {
      return {
        success: false,
        message: "Preço deve ser maior que zero"
      }
    }

    if (!data.categoria) {
      return {
        success: false,
        message: "Categoria é obrigatória"
      }
    }


      const novoPlanoMensal = await db.insert(planosMensais).values({
        nome: data.nome.trim(),
        descricao: data.descricao?.trim() || null,
        brinde: data.brinde?.trim() || null,
        preco: data.preco,
        categoria: data.categoria,
        barbeariaId: 1
      }).returning()



    return {
      success: true,
      message: "Plano mensal criado com sucesso!",
      data: novoPlanoMensal[0]
    }
  } catch (error) {
    console.error("Erro ao criar plano mensal:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// 📋 Buscar todos os planos mensais
export async function buscarTodosPlanosMensaisAction(): Promise<PlanoMensalResult> {
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

    // Buscar todos os planos mensais
    const todosPlanosMensais = await db.select().from(planosMensais)

    // Buscar os serviços mensais para cada plano com os dados do serviço
    const planosComServicos = await Promise.all(
      todosPlanosMensais.map(async (plano) => {
        const servicosMensaisDoPlano = await db
          .select({
            id: servicosMensais.id,
            servicoId: servicosMensais.servicoId,
            planoMensalId: servicosMensais.planoMensalId,
            quantidadePermitida: servicosMensais.quantidadePermitida,
            servico: {
              id: servicos.id,
              nome: servicos.nome,
              preco: servicos.preco,
              barbeariaId: servicos.barbeariaId
            }
          })
          .from(servicosMensais)
          .innerJoin(servicos, eq(servicosMensais.servicoId, servicos.id))
          .where(eq(servicosMensais.planoMensalId, plano.id))

        return {
          ...plano,
          servicosMensais: servicosMensaisDoPlano
        }
      })
    )

    return {
      success: true,
      message: "Planos mensais encontrados com sucesso!",
      data: planosComServicos
    }
  } catch (error) {
    console.error("Erro ao buscar planos mensais:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}


// ✏️ Editar um plano mensal
export async function editarPlanoMensalAction(data: EditarPlanoMensalData): Promise<PlanoMensalResult> {
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
      return {
        success: false,
        message: "ID do plano mensal é obrigatório e deve ser válido"
      }
    }

    // Verificar se o plano mensal existe
    const planoMensalExistente = await db.select().from(planosMensais).where(eq(planosMensais.id, data.id))
    
    if (planoMensalExistente.length === 0) {
      return {
        success: false,
        message: "Plano mensal não encontrado"
      }
    }
      // Preparar dados para atualização (apenas campos fornecidos)
      const dadosAtualizacao: any = {}
      
      if (data.nome !== undefined) {
        if (data.nome.trim().length === 0) {
          throw new Error("Nome do plano mensal não pode estar vazio")
        }
        dadosAtualizacao.nome = data.nome.trim()
      }
      
      if (data.descricao !== undefined) dadosAtualizacao.descricao = data.descricao?.trim() || null
      if (data.brinde !== undefined) dadosAtualizacao.brinde = data.brinde?.trim() || null
      if (data.preco !== undefined) {
        if (parseFloat(data.preco) <= 0) {
          throw new Error("Preço deve ser maior que zero")
        }
        dadosAtualizacao.preco = data.preco
      }
      if (data.categoria !== undefined) dadosAtualizacao.categoria = data.categoria

        const resultado = await db.update(planosMensais)
        .set(dadosAtualizacao)
        .where(eq(planosMensais.id, data.id))
        .returning()

    return {
      success: true,
      message: "Plano mensal atualizado com sucesso!",
      data: resultado[0] as PlanoMensal
    }
  } catch (error) {
    console.error("Erro ao editar plano mensal:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor. Tente novamente."
    }
  }
}

// 🗑️ Remover um plano mensal
export async function removerPlanoMensalAction(id: number): Promise<PlanoMensalResult> {
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
      return {
        success: false,
        message: "ID do plano mensal é obrigatório e deve ser válido"
      }
    }

    // Verificar se o plano mensal existe
    const planoMensalExistente = await db.select().from(planosMensais).where(eq(planosMensais.id, id))
    
    if (planoMensalExistente.length === 0) {
      return {
        success: false,
        message: "Plano mensal não encontrado"
      }
    }

    // Remover o plano mensal (os serviços mensais serão removidos automaticamente devido ao cascade)
    const planoMensalRemovido = await db
      .delete(planosMensais)
      .where(eq(planosMensais.id, id))
      .returning()

    // Revalidar as páginas que podem mostrar planos mensais
    revalidatePath("/planos")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Plano mensal removido com sucesso!",
      data: planoMensalRemovido[0]
    }
  } catch (error) {
    console.error("Erro ao remover plano mensal:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// 🔍 Buscar planos mensais por barbearia
export async function buscarPlanosMensaisPorBarbeariaAction(barbeariaId: number): Promise<PlanoMensalResult> {
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
      return {
        success: false,
        message: "ID da barbearia é obrigatório e deve ser válido"
      }
    }

    const planosMensaisDaBarbearia = await db.query.planosMensais.findMany({
      where: eq(planosMensais.barbeariaId, barbeariaId),
      with: {
        servicosMensais: {
          with: {
            servico: true
          }
        }
      }
    }) as PlanoMensal[]

    return {
      success: true,
      message: "Planos mensais da barbearia encontrados com sucesso!",
      data: planosMensaisDaBarbearia
    }
  } catch (error) {
    console.error("Erro ao buscar planos mensais da barbearia:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}


export interface CriarServicoMensalData {
  servicoId: number
  planoMensalId: number
  quantidadePermitida: number
}

export interface AtualizarServicoMensalData {
  id: number
  quantidadePermitida: number
}

// 📝 Criar um novo serviço mensal
export async function criarServicoMensalAction(data: CriarServicoMensalData): Promise<PlanoMensalResult> {
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

    // Validação básica
    if (!data.servicoId || data.servicoId <= 0) {
      return {
        success: false,
        message: "ID do serviço é obrigatório e deve ser válido"
      }
    }

    if (!data.planoMensalId || data.planoMensalId <= 0) {
      return {
        success: false,
        message: "ID do plano mensal é obrigatório e deve ser válido"
      }
    }

    if (!data.quantidadePermitida || data.quantidadePermitida <= 0) {
      return {
        success: false,
        message: "Quantidade permitida deve ser maior que zero"
      }
    }

    // Verificar se o serviço existe
    const servicoExistente = await db.select().from(servicos).where(eq(servicos.id, data.servicoId))
    if (servicoExistente.length === 0) {
      return {
        success: false,
        message: "Serviço não encontrado"
      }
    }

    // Verificar se o plano mensal existe
    const planoMensalExistente = await db.select().from(planosMensais).where(eq(planosMensais.id, data.planoMensalId))
    if (planoMensalExistente.length === 0) {
      return {
        success: false,
        message: "Plano mensal não encontrado"
      }
    }

    // Verificar se já existe um serviço mensal com o mesmo serviço e plano
    const servicoMensalExistente = await db.select().from(servicosMensais)
      .where(
        and(
        eq(servicosMensais.servicoId, data.servicoId ),
        eq(servicosMensais.planoMensalId, data.planoMensalId)
      ))

    
    if (servicoMensalExistente.length > 0) {
      return {
        success: false,
        message: "Este serviço já está incluído neste plano mensal"
      }
    }

    const novoServicoMensal = await db.insert(servicosMensais).values({
      servicoId: data.servicoId,
      planoMensalId: data.planoMensalId,
      quantidadePermitida: data.quantidadePermitida
    }).returning()

    // Revalidar as páginas que podem mostrar serviços mensais
    revalidatePath("/planos")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Serviço mensal criado com sucesso!",
      data: novoServicoMensal[0]
    }
  } catch (error) {
    console.error("Erro ao criar serviço mensal:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// ✏️ Atualizar um serviço mensal
export async function atualizarServicoMensalAction(data: AtualizarServicoMensalData): Promise<PlanoMensalResult> {
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

    // Validação básica
    if (!data.id || data.id <= 0) {
      return {
        success: false,
        message: "ID do serviço mensal é obrigatório e deve ser válido"
      }
    }

    if (!data.quantidadePermitida || data.quantidadePermitida <= 0) {
      return {
        success: false,
        message: "Quantidade permitida deve ser maior que zero"
      }
    }

    // Verificar se o serviço mensal existe
    const servicoMensalExistente = await db.select().from(servicosMensais).where(eq(servicosMensais.id, data.id))
    if (servicoMensalExistente.length === 0) {
      return {
        success: false,
        message: "Serviço mensal não encontrado"
      }
    }

    const servicoMensalAtualizado = await db.update(servicosMensais)
      .set({ quantidadePermitida: data.quantidadePermitida })
      .where(eq(servicosMensais.id, data.id))
      .returning()

    // Revalidar as páginas que podem mostrar serviços mensais
    revalidatePath("/planos")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Serviço mensal atualizado com sucesso!",
      data: servicoMensalAtualizado[0]
    }
  } catch (error) {
    console.error("Erro ao atualizar serviço mensal:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// 🔍 Buscar plano mensal por ID
export async function buscarPlanoPorIdAction(id: number): Promise<PlanoMensalResult> {
  try {
    console.log(id)
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

    // Buscar o plano mensal por ID
    const planoMensal = await db
      .select()
      .from(planosMensais)
      .where(eq(planosMensais.id, id))
      .limit(1)

    if (planoMensal.length === 0) {
      return { success: false, message: "Plano mensal não encontrado" }
    }

    // Buscar os serviços mensais para o plano com os dados do serviço
    const servicosMensaisDoPlano = await db
      .select({
        id: servicosMensais.id,
        servicoId: servicosMensais.servicoId,
        planoMensalId: servicosMensais.planoMensalId,
        quantidadePermitida: servicosMensais.quantidadePermitida,
        servico: {
          id: servicos.id,
          nome: servicos.nome,
          preco: servicos.preco,
          barbeariaId: servicos.barbeariaId
        }
      })
      .from(servicosMensais)
      .innerJoin(servicos, eq(servicosMensais.servicoId, servicos.id))
      .where(eq(servicosMensais.planoMensalId, id))

    const planoComServicos = {
      ...planoMensal[0],
      servicosMensais: servicosMensaisDoPlano
    }

    return {
      success: true,
      message: "Plano mensal encontrado com sucesso!",
      data: planoComServicos
    }
  } catch (error) {
    console.error("Erro ao buscar plano mensal por ID:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}