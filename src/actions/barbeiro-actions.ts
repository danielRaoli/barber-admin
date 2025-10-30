"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/index"
import { barbeiros } from "@/db/schema"
import { checkAuthAction } from "@/actions/auth-actions"
import { primaryKey } from "drizzle-orm/gel-core"

// Tipos para as operações
export interface CriarBarbeiroData {
  nome: string
  whatsapp?: string
  instagram?: string
  horaAbertura?: string
  horaFechamento?: string
  funcionamentoPersonalizado?: boolean
  horaPausaEntreServicos?: number
  barbeariaId: number
  imageFile?: File
}

export interface EditarBarbeiroData {
  id: number
  nome?: string
  whatsapp?: string
  instagram?: string
  horaAbertura?: string
  horaFechamento?: string
  funcionamentoPersonalizado?: boolean
  horaPausaEntreServicos?: number
  barbeariaId?: number
  imageUrl?: string
  imageFile?: File
}

export interface BarbeiroResult {
  success: boolean
  message: string
  data?: any
}

export type Barber = typeof barbeiros.$inferSelect
const cloudinary = require("cloudinary").v2

cloudinary.config({ 
  cloud_name: 'do2jxejxu', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Função auxiliar para upload de imagem no Cloudinary
async function uploadImageToCloudinary(imageFile: File): Promise<{ url: string; publicId: string }> {
  try {
    // Converter File para buffer
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Upload para o Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "barbeiros", // Organizar imagens em uma pasta
          transformation: [
            { width: 400, height: 400, crop: "fill" }, // Redimensionar para 400x400
            { quality: "auto" } // Otimização automática de qualidade
          ]
        },
        (error: any, result: any) => {
          if (error) {
            reject(error)
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            })
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    throw new Error(`Erro ao fazer upload da imagem: ${error}`)
  }
}

// 📝 Criar um novo barbeiro
export async function criarBarbeiroAction(data: CriarBarbeiroData): Promise<BarbeiroResult> {
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
        message: "Nome do barbeiro é obrigatório"
      }
    }

    if (!data.barbeariaId) {
      return {
        success: false,
        message: "ID da barbearia é obrigatório"
      }
    }

    // Processar upload da imagem se fornecida
    let imageUrl: string | null = null
    let cloudinaryPublicId: string | null = null
    
    if (data.imageFile) {
      try {
        const uploadResult = await uploadImageToCloudinary(data.imageFile)
        imageUrl = uploadResult.url
        cloudinaryPublicId = uploadResult.publicId
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error)
        return {
          success: false,
          message: "Erro ao fazer upload da imagem. Tente novamente."
        }
      }
    }

    // Inserir o barbeiro no banco
    const novoBarbeiro = await db.insert(barbeiros).values({
      nome: data.nome.trim(),
      whatsapp: data.whatsapp?.trim() || null,
      instagram: data.instagram?.trim() || null,
      horaAbertura: data.horaAbertura || null,
      horaFechamento: data.horaFechamento || null,
      funcionamentoPersonalizado: data.funcionamentoPersonalizado || false,
      horaPausaEntreServicos: data.horaPausaEntreServicos || null,
      barbeariaId: data.barbeariaId,
      imageUrl: imageUrl,
      
    }).returning()

    // Revalidar as páginas que podem mostrar barbeiros
    revalidatePath("/barbeiros")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Barbeiro criado com sucesso!",
      data: {
        ...novoBarbeiro[0],
        cloudinaryPublicId: cloudinaryPublicId
      }
    }
  } catch (error) {
    console.error("Erro ao criar barbeiro:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// 📋 Buscar todos os barbeiros
export async function buscarTodosBarbeirosAction(): Promise<BarbeiroResult> {
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

    const todosBarbeiros = await db.select().from(barbeiros)

    return {
      success: true,
      message: "Barbeiros encontrados com sucesso!",
      data: todosBarbeiros as Barber[]
    }
  } catch (error) {
    console.error("Erro ao buscar barbeiros:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// 🔍 Buscar barbeiro por ID
export async function buscarBarbeiroPorIdAction(id: number): Promise<BarbeiroResult> {
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
        message: "ID do barbeiro é obrigatório e deve ser válido"
      }
    }

    const barbeiro = await db.select().from(barbeiros).where(eq(barbeiros.id, id))

    if (barbeiro.length === 0) {
      return {
        success: false,
        message: "Barbeiro não encontrado"
      }
    }

    return {
      success: true,
      message: "Barbeiro encontrado com sucesso!",
      data: barbeiro[0]
    }
  } catch (error) {
    console.error("Erro ao buscar barbeiro:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// ✏️ Editar um barbeiro
export async function editarBarbeiroAction(data: EditarBarbeiroData): Promise<BarbeiroResult> {
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
        message: "ID do barbeiro é obrigatório e deve ser válido"
      }
    }

    // Verificar se o barbeiro existe
    const barbeiroExistente = await db.select().from(barbeiros).where(eq(barbeiros.id, data.id))
    
    if (barbeiroExistente.length === 0) {
      return {
        success: false,
        message: "Barbeiro não encontrado"
      }
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const dadosAtualizacao: any = {}
    
    if (data.nome !== undefined) {
      if (data.nome.trim().length === 0) {
        return {
          success: false,
          message: "Nome do barbeiro não pode estar vazio"
        }
      }
      dadosAtualizacao.nome = data.nome.trim()
    }
    
    if (data.whatsapp !== undefined) dadosAtualizacao.whatsapp = data.whatsapp?.trim() || null
    if (data.instagram !== undefined) dadosAtualizacao.instagram = data.instagram?.trim() || null
    if (data.horaAbertura !== undefined) dadosAtualizacao.horaAbertura = data.horaAbertura || null
    if (data.horaFechamento !== undefined) dadosAtualizacao.horaFechamento = data.horaFechamento || null
    if (data.funcionamentoPersonalizado !== undefined) dadosAtualizacao.funcionamentoPersonalizado = data.funcionamentoPersonalizado
    if (data.horaPausaEntreServicos !== undefined) dadosAtualizacao.horaPausaEntreServicos = data.horaPausaEntreServicos || null
    if (data.barbeariaId !== undefined) dadosAtualizacao.barbeariaId = data.barbeariaId
    if (data.imageUrl !== undefined) dadosAtualizacao.imageUrl = data.imageUrl?.trim() || null

    // Se uma nova imagem foi fornecida, fazer upload
    if (data.imageFile) {
      try {
        const { url, publicId } = await uploadImageToCloudinary(data.imageFile)
        dadosAtualizacao.imageUrl = url
        dadosAtualizacao.imageId = publicId
      } catch (uploadError) {
        console.error("Erro ao fazer upload da imagem:", uploadError)
        return {
          success: false,
          message: "Erro ao fazer upload da imagem. Tente novamente."
        }
      }
    }

    // Atualizar o barbeiro
    const barbeiroAtualizado = await db
      .update(barbeiros)
      .set(dadosAtualizacao)
      .where(eq(barbeiros.id, data.id))
      .returning()

    // Revalidar as páginas que podem mostrar barbeiros
    revalidatePath("/barbeiros")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Barbeiro atualizado com sucesso!",
      data: barbeiroAtualizado[0]
    }
  } catch (error) {
    console.error("Erro ao editar barbeiro:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// 🗑️ Remover um barbeiro
export async function removerBarbeiroAction(id: number): Promise<BarbeiroResult> {
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
        message: "ID do barbeiro é obrigatório e deve ser válido"
      }
    }

    // Verificar se o barbeiro existe
    const barbeiroExistente = await db.select().from(barbeiros).where(eq(barbeiros.id, id))
    
    if (barbeiroExistente.length === 0) {
      return {
        success: false,
        message: "Barbeiro não encontrado"
      }
    }

    // Remover o barbeiro
    const barbeiroRemovido = await db
      .delete(barbeiros)
      .where(eq(barbeiros.id, id))
      .returning()

    // Revalidar as páginas que podem mostrar barbeiros
    revalidatePath("/barbeiros")
    revalidatePath("/agendamentos")

    return {
      success: true,
      message: "Barbeiro removido com sucesso!",
      data: barbeiroRemovido[0]
    }
  } catch (error) {
    console.error("Erro ao remover barbeiro:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}

// 🔍 Buscar barbeiros por barbearia
export async function buscarBarbeirosPorBarbeariaAction(barbeariaId: number): Promise<BarbeiroResult> {
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

    const barbeirosDaBarbearia = await db
      .select()
      .from(barbeiros)
      .where(eq(barbeiros.barbeariaId, barbeariaId))

    return {
      success: true,
      message: "Barbeiros da barbearia encontrados com sucesso!",
      data: barbeirosDaBarbearia
    }
  } catch (error) {
    console.error("Erro ao buscar barbeiros da barbearia:", error)
    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente."
    }
  }
}