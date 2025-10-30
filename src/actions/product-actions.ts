"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/index"
import { produtos } from "@/db/schema"
import { checkAuthAction } from "@/actions/auth-actions"
import type { Product } from "@/lib/types"

export interface ProductResult {
  success: boolean
  message: string
  data?: Product | Product[] | null
}

const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: "do2jxejxu",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

async function uploadImageToCloudinary(imageFile: File): Promise<{ url: string; publicId: string }> {
  try {
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "produtos",
          transformation: [
            { width: 400, height: 400, crop: "fill" },
            { quality: "auto" }
          ]
        },
        (error: any, result: any) => {
          if (error) {
            reject(error)
          } else {
            resolve({ url: result.secure_url, publicId: result.public_id })
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    throw new Error(`Erro ao fazer upload da imagem: ${error}`)
  }
}

// 📝 Criar um novo produto
export async function criarProdutoAction(
  data: Pick<Product, "nome" | "preco" | "descricao" | "barbeariaId"> & { imageFile?: File }
): Promise<ProductResult> {
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

    if (!data.nome || data.nome.trim().length === 0) {
      return { success: false, message: "Nome do produto é obrigatório" }
    }

    if (!data.preco) {
      return { success: false, message: "Preço do produto é obrigatório" }
    }

    if (!data.barbeariaId) {
      return { success: false, message: "ID da barbearia é obrigatório" }
    }

    let imageUrl: string | null = null
    let cloudinaryPublicId: string | null = null

    if (data.imageFile) {
      try {
        const uploadResult = await uploadImageToCloudinary(data.imageFile)
        imageUrl = uploadResult.url
        cloudinaryPublicId = uploadResult.publicId
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error)
        return { success: false, message: "Erro ao fazer upload da imagem. Tente novamente." }
      }
    }

    const novoProduto = await db
      .insert(produtos)
      .values({
        nome: data.nome.trim(),
        preco: data.preco,
        descricao: data.descricao || null,
        imageUrl: imageUrl,
        barbeariaId: data.barbeariaId
      })
      .returning()

    revalidatePath("/produtos")

    return {
      success: true,
      message: "Produto criado com sucesso!",
      data: { ...novoProduto[0], imageId: cloudinaryPublicId } as Product
    }
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// 📋 Buscar todos os produtos
export async function buscarTodosProdutosAction(): Promise<ProductResult> {
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

    const todosProdutos = await db.select().from(produtos)

    return {
      success: true,
      message: "Produtos encontrados com sucesso!",
      data: todosProdutos as Product[]
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// 🔍 Buscar produto por ID
export async function buscarProdutoPorIdAction(id: number): Promise<ProductResult> {
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
      return { success: false, message: "ID do produto é obrigatório e deve ser válido" }
    }

    const produto = await db.select().from(produtos).where(eq(produtos.id, id))

    if (produto.length === 0) {
      return { success: false, message: "Produto não encontrado" }
    }

    return {
      success: true,
      message: "Produto encontrado com sucesso!",
      data: produto[0] as Product
    }
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// ✏️ Editar um produto
export async function editarProdutoAction(
  data: { id: number; imageFile?: File } & Partial<Pick<Product, "nome" | "preco" | "descricao" | "barbeariaId" | "imageUrl">>
): Promise<ProductResult> {
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
      return { success: false, message: "ID do produto é obrigatório e deve ser válido" }
    }

    const existente = await db.select().from(produtos).where(eq(produtos.id, data.id))
    if (existente.length === 0) {
      return { success: false, message: "Produto não encontrado" }
    }

    const atualizacao: any = {}
    if (data.nome !== undefined) {
      if (data.nome.trim().length === 0) {
        return { success: false, message: "Nome do produto não pode estar vazio" }
      }
      atualizacao.nome = data.nome.trim()
    }
    if (data.preco !== undefined) atualizacao.preco = data.preco
    if (data.descricao !== undefined) atualizacao.descricao = data.descricao || null
    if (data.barbeariaId !== undefined) atualizacao.barbeariaId = data.barbeariaId
    if (data.imageUrl !== undefined) atualizacao.imageUrl = data.imageUrl?.trim() || null

    if (data.imageFile) {
      try {
        const { url, publicId } = await uploadImageToCloudinary(data.imageFile)
        atualizacao.imageUrl = url
        atualizacao.imageId = publicId
      } catch (uploadError) {
        console.error("Erro ao fazer upload da imagem:", uploadError)
        return { success: false, message: "Erro ao fazer upload da imagem. Tente novamente." }
      }
    }

    const atualizado = await db.update(produtos).set(atualizacao).where(eq(produtos.id, data.id)).returning()

    revalidatePath("/produtos")

    return {
      success: true,
      message: "Produto atualizado com sucesso!",
      data: atualizado[0] as Product
    }
  } catch (error) {
    console.error("Erro ao editar produto:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// 🗑️ Remover um produto
export async function removerProdutoAction(id: number): Promise<ProductResult> {
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
      return { success: false, message: "ID do produto é obrigatório e deve ser válido" }
    }

    const existente = await db.select().from(produtos).where(eq(produtos.id, id))
    if (existente.length === 0) {
      return { success: false, message: "Produto não encontrado" }
    }

    const removido = await db.delete(produtos).where(eq(produtos.id, id)).returning()

    revalidatePath("/produtos")

    return {
      success: true,
      message: "Produto removido com sucesso!",
      data: removido[0] as Product
    }
  } catch (error) {
    console.error("Erro ao remover produto:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}

// 🔍 Buscar produtos por barbearia
export async function buscarProdutosPorBarbeariaAction(barbeariaId: number): Promise<ProductResult> {
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

    const produtosDaBarbearia = await db
      .select()
      .from(produtos)
      .where(eq(produtos.barbeariaId, barbeariaId))

    return {
      success: true,
      message: "Produtos da barbearia encontrados com sucesso!",
      data: produtosDaBarbearia as Product[]
    }
  } catch (error) {
    console.error("Erro ao buscar produtos da barbearia:", error)
    return { success: false, message: "Erro interno do servidor. Tente novamente." }
  }
}