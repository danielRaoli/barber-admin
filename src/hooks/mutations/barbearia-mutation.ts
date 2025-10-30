"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  editarBarbeariaAction, 
  type EditarBarbeariaData 
} from '@/actions/barbearia-actions'
import { BARBEARIA_QUERY_KEY } from '@/hooks/queries/barbearia-queries'
import { toast } from 'sonner';

// Hook para editar barbearia
export function useEditarBarbearia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditarBarbeariaData) => {
      const result = await editarBarbeariaAction(data)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result.data
    },
    onSuccess: () => {
      // Invalidar a query de barbearia para refetch dos dados
      queryClient.invalidateQueries({ queryKey: BARBEARIA_QUERY_KEY })
    },
    onError: (error) => {
        toast.error(error.message)
    }
  })
}