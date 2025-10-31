import { useQuery } from '@tanstack/react-query'
import { buscarPlanoPorIdAction } from '@/actions/planos-actions'

// Chave da query exportada como constante
export const PLANO_POR_ID_QUERY_KEY = (id: number) => ['plano', id] as const

// Hook para buscar um plano mensal por ID
export function usePlanoPorId(id: number) {
  return useQuery({
    queryKey: PLANO_POR_ID_QUERY_KEY(id),
    queryFn: async () => {
      const result = await buscarPlanoPorIdAction(id)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    enabled: !!id, // Só executa a query se o ID for válido
  })
}