import { useQuery } from '@tanstack/react-query'
import { buscarTodosBarbeirosAction } from '@/actions/barbeiro-actions'

// Chave da query exportada como constante
export const BARBEIROS_QUERY_KEY = ['barbeiros'] as const

// Hook para buscar todos os barbeiros
export function useBarbeiros() {
  return useQuery({
    queryKey: BARBEIROS_QUERY_KEY,
    queryFn: async () => {
      const result = await buscarTodosBarbeirosAction()
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      return result.data
    },
  })
}