"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Product } from "@/lib/catalog";
import { koboToNairaInput } from "@/lib/money";
import { slugify } from "@/lib/slug";
import {
  CONCENTRATIONS,
  productFormSchema,
  type ProductFormInput,
  type ProductFormOutput,
} from "@/lib/validation/product";

import { ConfirmDialog } from "./confirm-dialog";
import { ImageManager } from "./image-manager";

function toDefaults(product?: Product): ProductFormInput {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product ? koboToNairaInput(product.priceKobo) : "",
    compareAtPrice: product?.compareAtPriceKobo != null ? koboToNairaInput(product.compareAtPriceKobo) : "",
    stock: product ? String(product.stock) : "0",
    categoryId: product?.categoryId ?? "",
    sizeMl: product ? String(product.sizeMl) : "100",
    concentration: product?.concentration ?? "Eau de Parfum",
    topNotes: product?.topNotes.join(", ") ?? "",
    heartNotes: product?.heartNotes.join(", ") ?? "",
    baseNotes: product?.baseNotes.join(", ") ?? "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  };
}

export function ProductForm({
  product,
  categories,
  hasOrders = false,
}: {
  product?: Product;
  categories: Category[];
  hasOrders?: boolean;
}) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const form = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toDefaults(product),
  });
  const { errors, isSubmitting } = form.formState;
  const nameField = form.register("name");

  const onSubmit = form.handleSubmit(async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    toast.success(product ? `${data.name} saved` : `${data.name} created`, {
      description: "Design preview — changes aren't saved to a database yet.",
    });
    router.push("/admin/products");
  });

  const text = (
    id: keyof ProductFormInput,
    label: string,
    opts: { hint?: string; inputMode?: "decimal" | "numeric"; prefix?: string; className?: string } = {},
  ) => (
    <div className={opts.className}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-2">
        {opts.prefix && <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">{opts.prefix}</span>}
        <Input
          id={id}
          inputMode={opts.inputMode}
          className={opts.prefix ? "pl-7" : undefined}
          aria-invalid={!!errors[id]}
          aria-describedby={`${id}-error ${id}-hint`}
          {...form.register(id)}
        />
      </div>
      {opts.hint && !errors[id] && <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">{opts.hint}</p>}
      <FieldError id={`${id}-error`} message={errors[id]?.message} />
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <section className="space-y-5 rounded-md border bg-card p-6">
          <h2 className="font-sans text-base font-medium tracking-normal">Details</h2>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="mt-2"
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
              {...nameField}
              onChange={(e) => {
                void nameField.onChange(e);
                if (!slugTouched) form.setValue("slug", slugify(e.target.value));
              }}
            />
            <FieldError id="name-error" message={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="slug">URL slug</Label>
            <div className="mt-2 flex items-center rounded-md border border-input bg-muted/40 pl-3 text-sm text-muted-foreground focus-within:ring-[3px] focus-within:ring-ring/40">
              /products/
              <input
                id="slug"
                className="h-10 flex-1 rounded-r-md bg-card px-2 text-foreground outline-none"
                aria-invalid={!!errors.slug}
                aria-describedby="slug-error slug-hint"
                {...form.register("slug", { onChange: () => setSlugTouched(true) })}
              />
            </div>
            {!errors.slug && <p id="slug-hint" className="mt-1.5 text-xs text-muted-foreground">Filled in from the name — edit if you like.</p>}
            <FieldError id="slug-error" message={errors.slug?.message} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} className="mt-2" aria-invalid={!!errors.description} aria-describedby="description-error" {...form.register("description")} />
            <FieldError id="description-error" message={errors.description?.message} />
          </div>
        </section>

        <section className="space-y-4 rounded-md border bg-card p-6">
          <h2 className="font-sans text-base font-medium tracking-normal">Photos</h2>
          <ImageManager />
        </section>

        <section className="grid gap-5 rounded-md border bg-card p-6 sm:grid-cols-2">
          <h2 className="font-sans text-base font-medium tracking-normal sm:col-span-2">Fragrance</h2>
          <div>
            <Label htmlFor="concentration">Concentration</Label>
            <div className="mt-2">
              <NativeSelect id="concentration" {...form.register("concentration")}>
                {CONCENTRATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </NativeSelect>
            </div>
          </div>
          {text("sizeMl", "Size (ml)", { inputMode: "numeric" })}
          {text("topNotes", "Top notes", { hint: "Separate with commas", className: "sm:col-span-2" })}
          {text("heartNotes", "Heart notes", { hint: "Separate with commas", className: "sm:col-span-2" })}
          {text("baseNotes", "Base notes", { hint: "Separate with commas", className: "sm:col-span-2" })}
        </section>
      </div>

      <div className="space-y-6">
        <section className="space-y-4 rounded-md border bg-card p-6">
          <h2 className="font-sans text-base font-medium tracking-normal">Visibility</h2>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-0.5 size-4 accent-burgundy" {...form.register("isActive")} />
            <span>
              <span className="font-medium">Active</span>
              <span className="block text-xs text-muted-foreground">Visible in the store</span>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-0.5 size-4 accent-burgundy" {...form.register("isFeatured")} />
            <span>
              <span className="font-medium">Featured</span>
              <span className="block text-xs text-muted-foreground">Shown on the home page</span>
            </span>
          </label>
        </section>

        <section className="space-y-5 rounded-md border bg-card p-6">
          <h2 className="font-sans text-base font-medium tracking-normal">Pricing & stock</h2>
          {text("price", "Price", { prefix: "₦", inputMode: "decimal" })}
          {text("compareAtPrice", "Compare-at price", { prefix: "₦", inputMode: "decimal", hint: "Optional — shown struck through when higher" })}
          {text("stock", "Stock", { inputMode: "numeric" })}
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <div className="mt-2">
              <NativeSelect id="categoryId" aria-invalid={!!errors.categoryId} aria-describedby="categoryId-error" {...form.register("categoryId")}>
                <option value="">Choose…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </NativeSelect>
            </div>
            <FieldError id="categoryId-error" message={errors.categoryId?.message} />
          </div>
        </section>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : product ? "Save changes" : "Create product"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/products")}>Cancel</Button>
          {product && (
            <ConfirmDialog
              trigger={
                <Button type="button" variant="ghost" className="text-destructive hover:text-destructive">
                  {hasOrders ? "Deactivate product" : "Delete product"}
                </Button>
              }
              title={hasOrders ? `Deactivate ${product.name}?` : `Delete ${product.name}?`}
              description={
                hasOrders
                  ? "This product appears in past orders, so it can't be deleted. Deactivating hides it from the store and keeps order history intact."
                  : "This permanently removes the product and its photos. This can't be undone."
              }
              confirmLabel={hasOrders ? "Deactivate" : "Delete"}
              destructive
              onConfirm={() => {
                toast.success(hasOrders ? `${product.name} deactivated` : `${product.name} deleted`, {
                  description: "Design preview — nothing was changed.",
                });
                router.push("/admin/products");
              }}
            />
          )}
        </div>
      </div>
    </form>
  );
}
