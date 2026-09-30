import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { getProductById, listCategories } from "@/lib/catalog";
import { orders } from "@/lib/demo/orders";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  const { id } = await props.params;
  const [product, categories] = await Promise.all([getProductById(id), listCategories()]);
  if (!product) notFound();
  const hasOrders = orders.some((o) => o.items.some((i) => i.productId === product.id));

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-burgundy">
        <ArrowLeft className="size-4" aria-hidden /> Products
      </Link>
      <AdminPageHeader
        title={product.name}
        description={hasOrders ? "Has orders — can be deactivated but not deleted." : undefined}
        actions={
          <Button asChild variant="outline">
            <Link href={`/products/${product.slug}`} target="_blank">
              View in store <ExternalLink aria-hidden />
            </Link>
          </Button>
        }
      />
      <ProductForm product={product} categories={categories} hasOrders={hasOrders} />
    </>
  );
}
