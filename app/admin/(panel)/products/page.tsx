import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { z } from "zod";

import { Table, Td, Th } from "@/components/admin/data-table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { QuickEdit } from "@/components/admin/quick-edit-row";
import { BottleArt } from "@/components/store/bottle-art";
import { Pagination } from "@/components/store/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listCategories, listProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Products" };

const one = (v: unknown) => (Array.isArray(v) ? v[0] : v);
const paramsSchema = z.object({
  q: z.preprocess(one, z.string().trim().max(80).optional()).catch(undefined),
  page: z.preprocess(one, z.coerce.number().int().min(1).optional()).catch(undefined),
});

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  const { q, page } = paramsSchema.parse(await props.searchParams);
  const [result, categories] = await Promise.all([
    listProducts({ q, page, perPage: 8, includeInactive: true }),
    listCategories(),
  ]);
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`${result.total} products · edit price and stock inline with the pencil`}
        actions={
          <Button asChild>
            <Link href="/admin/products/new"><Plus aria-hidden /> Add product</Link>
          </Button>
        }
      />
      <form action="/admin/products" className="mb-4 flex max-w-md gap-2" role="search">
        <label htmlFor="q" className="sr-only">Search products</label>
        <Input id="q" name="q" type="search" defaultValue={q} placeholder="Search by name" />
        <Button type="submit" variant="outline"><Search aria-hidden /> Search</Button>
      </form>

      {result.items.length === 0 ? (
        <div className="rounded-md border border-dashed bg-card px-6 py-16 text-center">
          <p className="font-medium">No products match “{q}”</p>
          <Link href="/admin/products" className="mt-2 inline-block text-sm text-burgundy hover:underline">Clear search</Link>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>
                <span className="inline-flex gap-3"><span className="w-28">Price</span><span className="w-16">Stock</span></span>
              </Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((p) => (
              <tr key={p.id} className="hover:bg-muted/40">
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-10 shrink-0 items-end justify-center rounded bg-gradient-to-b from-[#f6efe7] to-[#ebdfd2] p-1">
                      <BottleArt tone={p.tone} shape={p.bottle} />
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.concentration} · {p.sizeMl}ml</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{categoryName(p.categoryId)}</Td>
                <Td><QuickEdit name={p.name} priceKobo={p.priceKobo} stock={p.stock} /></Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    {p.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}
                    {p.isFeatured && <Badge variant="gold">Featured</Badge>}
                  </div>
                </Td>
                <Td className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/products/${p.id}`}>Edit</Link>
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        hrefFor={(n) => {
          const sp = new URLSearchParams();
          if (q) sp.set("q", q);
          if (n > 1) sp.set("page", String(n));
          const s = sp.toString();
          return s ? `/admin/products?${s}` : "/admin/products";
        }}
      />
    </>
  );
}
