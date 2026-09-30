import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { OrderProgress } from "@/components/orders/order-progress";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Separator } from "@/components/ui/separator";
import { BottleArt } from "@/components/store/bottle-art";
import { products } from "@/lib/demo/catalog";
import { DEMO_CUSTOMER_ID, orders } from "@/lib/demo/orders";
import { formatDateTime } from "@/lib/format";
import { formatNaira, lineTotalKobo } from "@/lib/money";

export const metadata: Metadata = { title: "Order Details", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrderDetailPage(props: PageProps<"/account/orders/[orderNumber]">) {
  const { orderNumber } = await props.params;
  // Customers only ever see their own orders (enforced server-side again in Phase 6).
  const order = orders.find((o) => o.orderNumber === orderNumber && o.userId === DEMO_CUSTOMER_ID);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-burgundy">
        <ArrowLeft className="size-4" aria-hidden /> All orders
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <h1 className="text-4xl sm:text-5xl">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Placed {formatDateTime(order.createdAt)}</p>

      <div className="mt-10 rounded-md border bg-card p-6">
        <OrderProgress status={order.status} />
        {order.status === "CANCELLED" && <p className="text-sm text-destructive">This order was cancelled. Any payment has been refunded.</p>}
        {order.status === "PENDING" && <p className="text-sm text-warning">Awaiting payment confirmation from Paystack.</p>}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
        <section aria-labelledby="items-heading">
          <h2 id="items-heading" className="text-3xl">Items</h2>
          <ul className="mt-4 divide-y border-y">
            {order.items.map((item) => {
              const p = products.find((x) => x.id === item.productId);
              return (
                <li key={item.productId} className="flex items-center gap-4 py-4">
                  <div className="flex aspect-[4/5] w-16 shrink-0 items-end justify-center rounded bg-gradient-to-b from-[#f6efe7] to-[#ebdfd2] p-2">
                    {p && <BottleArt tone={p.tone} shape={p.bottle} />}
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.slug}`} className="font-serif text-xl hover:text-burgundy">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {formatNaira(item.unitPriceKobo)}
                    </p>
                  </div>
                  <p>{formatNaira(lineTotalKobo(item.unitPriceKobo, item.quantity))}</p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-4 ml-auto max-w-xs space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatNaira(order.subtotalKobo)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatNaira(order.shippingKobo)}</dd></div>
            <Separator />
            <div className="flex justify-between text-base font-medium"><dt>Total</dt><dd>{formatNaira(order.totalKobo)}</dd></div>
          </dl>
        </section>
        <aside aria-labelledby="ship-heading" className="h-fit rounded-md border bg-card p-5 text-sm">
          <h2 id="ship-heading" className="font-sans text-xs tracking-[0.18em] text-gold-text uppercase">Delivering to</h2>
          <address className="mt-3 leading-relaxed not-italic">
            <span className="font-medium">{order.shipping.fullName}</span>
            <br />
            {order.shipping.line1}
            {order.shipping.line2 && (<><br />{order.shipping.line2}</>)}
            <br />
            {order.shipping.city}, {order.shipping.state}
            <br />
            {order.shipping.phone}
          </address>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">Payment reference</p>
          <p className="font-mono text-xs">{order.paystackReference}</p>
        </aside>
      </div>
    </div>
  );
}
