import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Table, Td, Th } from "@/components/admin/data-table";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { Separator } from "@/components/ui/separator";
import { customerById, orders } from "@/lib/demo/orders";
import { formatDateTime } from "@/lib/format";
import { formatNaira, lineTotalKobo } from "@/lib/money";

export const metadata: Metadata = { title: "Order" };
export const dynamic = "force-dynamic";

export default async function AdminOrderPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params;
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();
  const customer = customerById(order.userId);

  return (
    <>
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-burgundy">
        <ArrowLeft className="size-4" aria-hidden /> Orders
      </Link>
      <h1 className="text-4xl text-burgundy">{order.orderNumber}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Placed {formatDateTime(order.createdAt)} · Paystack ref {order.paystackReference}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <section aria-labelledby="items-h">
          <h2 id="items-h" className="mb-3 font-sans text-base font-medium tracking-normal">Items</h2>
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th className="text-right">Unit price</Th>
                <Th className="text-right">Qty</Th>
                <Th className="text-right">Line total</Th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.productId}>
                  <Td>
                    <Link href={`/admin/products/${i.productId}`} className="font-medium hover:underline">{i.name}</Link>
                  </Td>
                  <Td className="text-right tabular-nums">{formatNaira(i.unitPriceKobo)}</Td>
                  <Td className="text-right tabular-nums">{i.quantity}</Td>
                  <Td className="text-right tabular-nums">{formatNaira(lineTotalKobo(i.unitPriceKobo, i.quantity))}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <dl className="mt-4 ml-auto max-w-xs space-y-2 rounded-md border bg-card p-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{formatNaira(order.subtotalKobo)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{formatNaira(order.shippingKobo)}</dd></div>
            <Separator />
            <div className="flex justify-between font-medium"><dt>Total</dt><dd className="tabular-nums">{formatNaira(order.totalKobo)}</dd></div>
          </dl>
          <p className="mt-2 text-right text-xs text-muted-foreground">Prices are snapshots from when the order was placed.</p>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="status-h" className="rounded-md border bg-card p-5">
            <h2 id="status-h" className="mb-4 font-sans text-base font-medium tracking-normal">Status</h2>
            <OrderStatusControl initial={order.status} orderNumber={order.orderNumber} />
          </section>
          <section aria-labelledby="cust-h" className="rounded-md border bg-card p-5 text-sm">
            <h2 id="cust-h" className="mb-3 font-sans text-base font-medium tracking-normal">Customer</h2>
            {customer && (
              <>
                <Link href={`/admin/customers/${customer.id}`} className="font-medium text-burgundy hover:underline">{customer.name}</Link>
                <p className="text-muted-foreground">{customer.email}</p>
              </>
            )}
            <Separator className="my-4" />
            <h3 className="mb-2 font-sans text-xs tracking-[0.16em] text-gold-text uppercase">Ship to</h3>
            <address className="leading-relaxed not-italic">
              {order.shipping.fullName}
              <br />
              {order.shipping.line1}
              {order.shipping.line2 && (<><br />{order.shipping.line2}</>)}
              <br />
              {order.shipping.city}, {order.shipping.state}
              <br />
              {order.shipping.phone}
            </address>
          </section>
        </div>
      </div>
    </>
  );
}
