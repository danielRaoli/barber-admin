import { buscarTodosFuncionamentoAction } from "@/actions/funcionamento-actions";
import { useQuery } from "@tanstack/react-query";

export const FUNCIONAMENTO_QUERY_KEY = ["funcionamento"] as const;

export const useFuncionamentoQuery =()=>{
    return useQuery({
        queryKey: FUNCIONAMENTO_QUERY_KEY,
        queryFn: async () => {
            const response = await buscarTodosFuncionamentoAction();
            if (!response.success) {
                throw new Error("Erro ao buscar funcionamento");
            }
            return response.data;
        },
    })
}