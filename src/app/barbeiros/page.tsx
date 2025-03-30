import { Barber } from "@/lib/types";
import DialogAdicionar from "./components/dialog-adicionar";
import { BarberCard } from "./components/barber-card";
import { revalidateTag } from "next/cache";
import BarberList from "./components/barber-list";
import { toast } from "sonner";

// Força a página a revalidar os dados a cada requisição
export const revalidate = 0;

export default async function BarbersPage() {
  const response = await fetch("http://localhost:5079/api/barber", {
    cache: "force-cache",
    next: { tags: ["barbers"] },
  });
  const json = await response.json();
  const barbers: Barber[] = json.data;

  async function createBarber(formData: FormData) {
    "use server";

    const response = await fetch("http://localhost:5079/api/barber", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return;
    }

    revalidateTag("barbers");
  }

  async function updateBarber(formData: FormData, barberId: number) {
    "use server";

    const response = await fetch(
      `http://localhost:5079/api/barber/${barberId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      return;
    }

    revalidateTag("barbers");
  }

  async function removeBarber(barberId: number) {
    "use server";

    const response = await fetch(
      `http://localhost:5079/api/barber/${barberId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      return;
    }

    revalidateTag("barbers");
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Barbeiros</h1>
        <DialogAdicionar onCreate={createBarber} />
      </div>
      <BarberList
        barbers={barbers}
        onUpdate={updateBarber}
        onRemove={removeBarber}
      />
    </div>
  );
}
