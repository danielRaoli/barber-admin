import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, Service } from "@/lib/types";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { ServiceListMobile } from "./components/service-list";
import { ServiceListDesktop } from "./components/service-list-desktop";
import DialogAdicionarServico from "./components/dialog-adicionar-servico";
import { revalidateTag } from "next/cache";
import { ProductListMobile } from "./components/product-list";
import { ProductListDesktop } from "./components/product-list-desktop";
import DialogAdicionarProduto from "./components/dialog-adicionar-produto";
import { toast } from "sonner";

export interface CreateServiceData {
  name: string;
  price: number;
  color: string;
}

export default async function ServicesPage() {
  const serviceResponse = await fetch("http://localhost:5079/api/services", {
    cache: "force-cache",
    next: {
      tags: ["services"],
    },
  });

  const productResponse = await fetch("http://localhost:5079/api/product", {
    cache: "force-cache",
    next: {
      tags: ["products"],
    },
  });

  const json = await serviceResponse.json();
  const productJson = await productResponse.json();
  console.log(productJson);
  console.log(json);
  const services: Service[] = json.data;
  const products: Product[] = productJson.data;

  async function createService(data: CreateServiceData) {
    "use server";

    const response = await fetch("http://localhost:5079/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar serviço");
    }

    revalidateTag("services");
  }

  async function createProduct(formData: FormData) {
    "use server";

    const response = await fetch("http://localhost:5079/api/product", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      toast.error("Erro ao criar produto");
      return;
    }

    revalidateTag("products");
  }

  async function updateService(formData: FormData, serviceId: number) {
    "use server";

    const data = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      color: formData.get("color"),
    };

    const response = await fetch(
      `http://localhost:5079/api/services/${serviceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar serviço");
    }

    revalidateTag("services");
  }

  async function removeService(serviceId: number) {
    "use server";

    const response = await fetch(
      `http://localhost:5079/api/services/${serviceId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao remover serviço");
    }

    revalidateTag("services");
  }

  async function updateProduct(formData: FormData, productId: number) {
    "use server";

    const response = await fetch(
      `http://localhost:5079/api/product/${productId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar produto");
    }

    revalidateTag("products");
  }

  async function removeProduct(productId: number) {
    "use server";

    const response = await fetch(
      `http://localhost:5079/api/product/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao remover produto");
    }

    revalidateTag("products");
  }

  // Versão Mobile
  const MobileView = () => (
    <div className="md:hidden w-full pt-8">
      <Tabs defaultValue="services">
        <TabsList className="mx-auto w-full">
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServiceListMobile
            services={services}
            onUpdate={updateService}
            onRemove={removeService}
          />
        </TabsContent>

        <TabsContent value="products">
          <ProductListMobile
            products={products}
            onUpdate={updateProduct}
            onRemove={removeProduct}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  // Versão Desktop
  const DesktopView = () => (
    <div className="hidden md:grid md:grid-cols-2 md:gap-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Serviços</h2>
          <DialogAdicionarServico onCreate={createService} />
        </div>
        <ServiceListDesktop
          services={services}
          onUpdate={updateService}
          onRemove={removeService}
        />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Produtos</h2>
          <DialogAdicionarProduto onCreate={createProduct} />
        </div>
        <ProductListDesktop
          products={products}
          onUpdate={updateProduct}
          onRemove={removeProduct}
        />
      </div>
    </div>
  );

  return (
    <div className="container  p-6 h-screen">
      <MobileView />
      <DesktopView />
    </div>
  );
}
