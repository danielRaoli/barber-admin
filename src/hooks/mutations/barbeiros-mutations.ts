"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { criarBarbeiroAction, editarBarbeiroAction, removerBarbeiroAction, type CriarBarbeiroData, type EditarBarbeiroData } from '@/actions/barbeiro-actions'
import { BARBEIROS_QUERY_KEY } from '@/hooks/queries/barbeiros-queries'
import { toast } from 'sonner';

// Hook para criar barbeiro
export function useCriarBarbeiro() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CriarBarbeiroData) => {
      const result = await criarBarbeiroAction(data)
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de barbeiros para refetch os dados
      queryClient.invalidateQueries({ queryKey: BARBEIROS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para editar barbeiro
export function useEditarBarbeiro() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: EditarBarbeiroData) => {
      const result = await editarBarbeiroAction(data)
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de barbeiros para refetch os dados
      queryClient.invalidateQueries({ queryKey: BARBEIROS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para remover barbeiro
export function useRemoverBarbeiro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await removerBarbeiroAction(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de barbeiros para refetch os dados
      queryClient.invalidateQueries({ queryKey: BARBEIROS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}