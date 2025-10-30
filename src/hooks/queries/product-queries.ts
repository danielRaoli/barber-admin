import { useQuery } from '@tanstack/react-query'
import { buscarTodosProdutosAction } from '@/actions/product-actions'

// Chave da query exportada como constante
export const PRODUTOS_QUERY_KEY = ['produtos'] as const

// Hook para buscar todos os produtos
export function useProdutos() {
  return useQuery({
    queryKey: PRODUTOS_QUERY_KEY,
    queryFn: async () => {
      const result = await buscarTodosProdutosAction()

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
  })
}