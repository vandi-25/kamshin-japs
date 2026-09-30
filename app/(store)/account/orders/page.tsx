import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { customerById, DEMO_CUSTOMER_ID, orders } from "@/lib/demo/orders";
import { formatDate } from "@/lib/format";
import { formatNaira } from "@/lib/money";

export const metadata: Metadata = { title: "My Orders", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function MyOrdersPage() {
  const customer = customerById(DEMO_CUSTOMER_ID);
  const mine = orders.filter((o) => o.userId === DEMO_CUSTOMER_ID);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs tracking-[0.22em] text-gold-text uppercase">My account · {customer?.name}</p>
      <h1 className="mt-2 text-5xl">My orders</h1>

      {mine.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-md border border-dashed bg-card px-6 py-20 text-center">
          <Package className="size-10 text-taupe" aria-hidden />
          <h2 className="mt-4 text-3xl">No orders yet</h2>
          <Button asChild className="mt-6 tracking-[0.12em] uppercase">
            <Link href="/products">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {mine.map((o) => (
            <li key={o.id}>
              <Link
                href={`/account/orders/${o.orderNumber}`}
                className="flex flex-col gap-3 rounded-md border bg-card p-5 transition-colors hover:border-taupe focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium">{o.orderNumber}</p>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(o.createdAt)} · {o.items.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="font-medium">{formatNaira(o.totalKobo)}</p>
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
