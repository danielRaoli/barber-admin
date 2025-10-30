import { buscarDadosBarbeariaAction } from "@/actions/barbearia-actions"
import { ConfiguracoesBarbearia } from "@/app/(private)/configuracoes/_components/configuracoes-barbearia"
import { ConfiguracoesFuncionamento } from "@/app/(private)/configuracoes/_components/configuracoes-funcionamento"


export default async function ConfiguracoesPage() {
  const result = await buscarDadosBarbeariaAction()

  if (!result.success) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        <div className="text-red-500">{result.message}</div>
      </div>
    )
  }

  const { barbearia, barbeiros, servicos, planosMensais, funcionamento, quantidades } = result.data

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="flex flex-col gap-4">
        <ConfiguracoesBarbearia 
          barbearia={barbearia}
          quantidadeBarbeiros={quantidades.barbeiros}
          quantidadeServicos={quantidades.servicos}
          quantidadePlanosMensais={quantidades.planosMensais}
        />
        
        <ConfiguracoesFuncionamento 
          funcionamento={funcionamento}
        />
      </div>
    </div>
  )
}