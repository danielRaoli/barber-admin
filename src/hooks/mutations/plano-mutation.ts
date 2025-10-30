"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  criarPlanoMensalAction, 
  editarPlanoMensalAction, 
  removerPlanoMensalAction,
  criarServicoMensalAction,
  atualizarServicoMensalAction,
  type CriarPlanoMensalData, 
  type EditarPlanoMensalData,
  type CriarServicoMensalData,
  type AtualizarServicoMensalData
} from '@/actions/planos-actions'
import { PLANOS_QUERY_KEY } from '@/hooks/queries/plano-querie'
import { toast } from 'sonner';

// Hook para criar plano mensal
export function useCriarPlanoMensal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CriarPlanoMensalData) => {
      const result = await criarPlanoMensalAction(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de planos para refetch dos dados
      queryClient.invalidateQueries({ queryKey: PLANOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para editar plano mensal
export function useEditarPlanoMensal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditarPlanoMensalData) => {
      const result = await editarPlanoMensalAction(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de planos para refetch dos dados
      queryClient.invalidateQueries({ queryKey: PLANOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para remover plano mensal
export function useRemoverPlanoMensal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await removerPlanoMensalAction(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de planos para refetch dos dados
      queryClient.invalidateQueries({ queryKey: PLANOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para criar serviço mensal
export function useCriarServicoMensal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CriarServicoMensalData) => {
      const result = await criarServicoMensalAction(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de planos para refetch dos dados
      queryClient.invalidateQueries({ queryKey: PLANOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

// Hook para atualizar serviço mensal
export function useAtualizarServicoMensal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AtualizarServicoMensalData) => {
      const result = await atualizarServicoMensalAction(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de planos para refetch dos dados
      queryClient.invalidateQueries({ queryKey: PLANOS_QUERY_KEY })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}