"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  criarServicoAction, 
  editarServicoAction, 
  removerServicoAction, 
  type CriarServicoData, 
  type EditarServicoData 
} from '@/actions/service-actions'
import { SERVICOS_QUERY_KEY } from '@/hooks/queries/service-querie'
import { toast } from 'sonner';

// Hook para criar serviço
export function useCriarServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CriarServicoData) => {
      const result = await criarServicoAction(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de serviços para refetch dos dados
      queryClient.invalidateQueries({ queryKey: SERVICOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para editar serviço
export function useEditarServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditarServicoData) => {
      const result = await editarServicoAction(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de serviços para refetch dos dados
      queryClient.invalidateQueries({ queryKey: SERVICOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para remover serviço
export function useRemoverServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await removerServicoAction(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de serviços para refetch dos dados
      queryClient.invalidateQueries({ queryKey: SERVICOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}