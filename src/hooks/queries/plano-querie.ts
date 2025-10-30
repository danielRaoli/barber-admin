import { useQuery } from '@tanstack/react-query'
import { buscarTodosPlanosMensaisAction } from '@/actions/planos-actions'

// Chave da query exportada como constante
export const PLANOS_QUERY_KEY = ['planos'] as const

// Hook para buscar todos os planos mensais
export function usePlanos() {
  return useQuery({
    queryKey: PLANOS_QUERY_KEY,
    queryFn: async () => {
      const result = await buscarTodosPlanosMensaisAction()

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
  })
}