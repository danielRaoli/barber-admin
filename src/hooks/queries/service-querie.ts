import { useQuery } from '@tanstack/react-query'
import { buscarTodosServicosAction } from '@/actions/service-actions'

// Chave da query exportada como constante
export const SERVICOS_QUERY_KEY = ['servicos'] as const

// Hook para buscar todos os serviços
export function useServicos() {
  return useQuery({
    queryKey: SERVICOS_QUERY_KEY,
    queryFn: async () => {
      const result = await buscarTodosServicosAction()

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
  })
}