import { buscarTodosProdutosAction } from "@/actions/product-actions";
import DialogAdicionarProduto from "./dialog-adicionar-produto";
import { ProductList } from "./product-list";
import { Product } from "@/lib/types";

export default async function ProductPage(){
    const productResponse = await buscarTodosProdutosAction();
    const products = productResponse.data as Product[] || [];
    return <>
        <div className="w-full h-screen p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Produtos</h2>
                <DialogAdicionarProduto />
            </div>
            <ProductList products={products} />
        </div>
    </>
}