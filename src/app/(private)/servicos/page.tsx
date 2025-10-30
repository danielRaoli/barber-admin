
import { ServiceListDesktop } from "./components/service-list";
import DialogAdicionarServico from "./components/dialog-adicionar-servico";
import { Service } from "@/lib/types";
import { buscarTodosServicosAction } from "@/actions/service-actions";

export default async function ServicesPage() {
  const serviceResponse = await buscarTodosServicosAction();

  const services = serviceResponse.data as Service[] || [];

  return (

    <div className="w-full h-screen p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Serviços</h2>
        <DialogAdicionarServico />
      </div>
      <ServiceListDesktop
        services={services}
      />
    </div>

  );
}
