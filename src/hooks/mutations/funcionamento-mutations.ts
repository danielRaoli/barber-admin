"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  editarFuncionamentoAction, 
  type EditarFuncionamentoData 
} from '@/actions/funcionamento-actions'
import { FUNCIONAMENTO_QUERY_KEY } from '@/hooks/queries/funcionamento-queries'
import { toast } from 'sonner';

// Hook para editar funcionamento
export function useEditarFuncionamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditarFuncionamentoData) => {
      const result = await editarFuncionamentoAction(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de funcionamento para refetch dos dados
      queryClient.invalidateQueries({ queryKey: FUNCIONAMENTO_QUERY_KEY })
    },
    onError: (error) => {
        toast.error(error.message)
    }
  })
}