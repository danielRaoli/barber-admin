import { useQuery } from '@tanstack/react-query'
import { buscarDadosBarbeariaAction } from '@/actions/barbearia-actions'

// Chave da query exportada como constante
export const BARBEARIA_QUERY_KEY = ['barbearia'] as const

// Hook para buscar dados da barbearia
export function useBarbearia() {
  return useQuery({
    queryKey: BARBEARIA_QUERY_KEY,
    queryFn: async () => {
      const result = await buscarDadosBarbeariaAction()
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      return result.data
    },
  })
}