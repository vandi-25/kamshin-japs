"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, MapPin, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { BottleArt } from "@/components/store/bottle-art";
import type { Address } from "@/lib/demo/orders";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";
import { addressSchema, NIGERIAN_STATES, type AddressInput } from "@/lib/validation/address";

import type { CartProduct } from "./types";
import { useCartLines } from "./use-cart-lines";

type SavedAddress = Address & { id: string; isDefault: boolean };

export function CheckoutView({
  products,
  shippingKobo,
  addresses,
  customerName,
}: {
  products: CartProduct[];
  shippingKobo: number;
  addresses: SavedAddress[];
  customerName: string;
}) {
  const router = useRouter();
  const { lines, subtotalKobo, itemCount } = useCartLines(products);
  const [selected, setSelected] = useState<string>(addresses.find((a) => a.isDefault)?.id ?? "new");
  const [paying, setPaying] = useState(false);
  const form = useForm<AddressInput>({ resolver: zodResolver(addressSchema), defaultValues: { state: "Lagos" } });
  const errors = form.formState.errors;

  if (lines.length === 0) {
    return (
      <div className="rounded-md border border-dashed bg-card px-6 py-20 text-center">
        <h2 className="text-3xl">Your bag is empty</h2>
        <p className="mt-2 text-muted-foreground">Add a fragrance before checking out.</p>
        <Button asChild className="mt-6 tracking-[0.12em] uppercase">
          <Link href="/products">Shop fragrances</Link>
        </Button>
      </div>
    );
  }

  const pay = () => {
    setPaying(true);
    toast.info("Design preview", {
      description: "In the live store you'd now be taken to Paystack to pay securely.",
    });
    setTimeout(() => router.push("/checkout/success"), 900);
  };

  const onPlaceOrder = selected === "new" ? form.handleSubmit(pay) : (e: React.FormEvent) => (e.preventDefault(), pay());

  return (
    <form onSubmit={onPlaceOrder} noValidate className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <div className="space-y-10">
        <p className="rounded-md border bg-card px-4 py-3 text-sm">
          Signed in as <span className="font-medium">{customerName}</span>
          <span className="text-muted-foreground"> (preview account)</span>
        </p>

        <fieldset>
          <legend className="font-serif text-3xl">Delivery address</legend>
          <div role="radiogroup" className="mt-5 grid gap-3 sm:grid-cols-2">
            {addresses.map((a) => (
              <label
                key={a.id}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-md border bg-card p-4 text-sm transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
                  selected === a.id ? "border-burgundy ring-1 ring-burgundy" : "hover:border-taupe",
                )}
              >
                <input
                  type="radio"
                  name="address"
                  value={a.id}
                  checked={selected === a.id}
                  onChange={() => setSelected(a.id)}
                  className="mt-1 accent-burgundy"
                />
                <span>
                  <span className="flex items-center gap-2 font-medium">
                    <MapPin className="size-3.5 text-gold-text" aria-hidden /> {a.fullName}
                    {a.isDefault && <span className="text-xs text-muted-foreground">Default</span>}
                  </span>
                  <span className="mt-1 block text-muted-foreground">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state}
                    <br />
                    {a.phone}
                  </span>
                </span>
              </label>
            ))}
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border border-dashed bg-card p-4 text-sm has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
                selected === "new" ? "border-burgundy ring-1 ring-burgundy" : "hover:border-taupe",
              )}
            >
              <input
                type="radio"
                name="address"
                value="new"
                checked={selected === "new"}
                onChange={() => setSelected("new")}
                className="accent-burgundy"
              />
              <Plus className="size-4" aria-hidden /> Add a new address
            </label>
          </div>

          {selected === "new" && (
            <div className="mt-6 grid gap-4 rounded-md border bg-card p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" className="mt-2" autoComplete="name" aria-invalid={!!errors.fullName} aria-describedby="fullName-error" {...form.register("fullName")} />
                <FieldError id="fullName-error" message={errors.fullName?.message} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" className="mt-2" type="tel" autoComplete="tel" placeholder="0803 123 4567" aria-invalid={!!errors.phone} aria-describedby="phone-error" {...form.register("phone")} />
                <FieldError id="phone-error" message={errors.phone?.message} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="line1">Street address</Label>
                <Input id="line1" className="mt-2" autoComplete="address-line1" aria-invalid={!!errors.line1} aria-describedby="line1-error" {...form.register("line1")} />
                <FieldError id="line1-error" message={errors.line1?.message} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="line2">
                  Apartment, estate or landmark <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input id="line2" className="mt-2" autoComplete="address-line2" {...form.register("line2")} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" className="mt-2" autoComplete="address-level2" aria-invalid={!!errors.city} aria-describedby="city-error" {...form.register("city")} />
                <FieldError id="city-error" message={errors.city?.message} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <div className="mt-2">
                  <NativeSelect id="state" aria-invalid={!!errors.state} aria-describedby="state-error" {...form.register("state")}>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
                <FieldError id="state-error" message={errors.state?.message} />
              </div>
            </div>
          )}
        </fieldset>
      </div>

      <aside aria-labelledby="review-heading" className="h-fit rounded-md border bg-card p-6 lg:sticky lg:top-28">
        <h2 id="review-heading" className="text-3xl">Review order</h2>
        <ul className="mt-5 space-y-4">
          {lines.map(({ product, quantity, lineKobo }) => (
            <li key={product.slug} className="flex items-center gap-3">
              <div className="relative flex aspect-[4/5] w-14 shrink-0 items-end justify-center rounded bg-gradient-to-b from-[#f6efe7] to-[#ebdfd2] p-1.5">
                <BottleArt tone={product.tone} shape={product.bottle} />
                <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-burgundy text-[10px] text-ivory">
                  {quantity}
                </span>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sizeMl}ml</p>
              </div>
              <p className="text-sm">{formatNaira(lineKobo)}</p>
            </li>
          ))}
        </ul>
        <Separator className="my-5" />
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal ({itemCount})</dt>
            <dd>{formatNaira(subtotalKobo)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd>{formatNaira(shippingKobo)}</dd>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-medium">
            <dt>Total</dt>
            <dd>{formatNaira(subtotalKobo + shippingKobo)}</dd>
          </div>
        </dl>
        <Button type="submit" size="lg" disabled={paying} className="mt-6 w-full tracking-[0.12em] uppercase">
          <Lock aria-hidden /> {paying ? "Redirecting…" : `Pay ${formatNaira(subtotalKobo + shippingKobo)}`}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Secure payment by Paystack · card, bank transfer or USSD
        </p>
      </aside>
    </form>
  );
}
