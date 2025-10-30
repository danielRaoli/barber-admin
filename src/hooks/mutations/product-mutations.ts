"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  criarProdutoAction, 
  editarProdutoAction, 
  removerProdutoAction 
} from '@/actions/product-actions'
import { PRODUTOS_QUERY_KEY } from '@/hooks/queries/product-queries'
import { toast } from 'sonner';

// Inferir tipos a partir das actions
type CriarProdutoData = Parameters<typeof criarProdutoAction>[0]
type EditarProdutoData = Parameters<typeof editarProdutoAction>[0]

// Hook para criar produto
export function useCriarProduto() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CriarProdutoData) => {
      const result = await criarProdutoAction(data)
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de produtos para refetch dos dados
      queryClient.invalidateQueries({ queryKey: PRODUTOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para editar produto
export function useEditarProduto() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: EditarProdutoData) => {
      const result = await editarProdutoAction(data)
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de produtos para refetch dos dados
      queryClient.invalidateQueries({ queryKey: PRODUTOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para remover produto
export function useRemoverProduto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await removerProdutoAction(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de produtos para refetch dos dados
      queryClient.invalidateQueries({ queryKey: PRODUTOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}