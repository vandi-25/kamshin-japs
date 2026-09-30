import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";

import { Table, Td, Th } from "@/components/admin/data-table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { customerById, ORDER_STATUSES, orders, statusLabel } from "@/lib/demo/orders";
import { formatDateTime } from "@/lib/format";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

const one = (v: unknown) => (Array.isArray(v) ? v[0] : v);
const paramsSchema = z.object({ status: z.preprocess(one, z.enum(ORDER_STATUSES).optional()).catch(undefined) });

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  const { status } = paramsSchema.parse(await props.searchParams);
  const list = [...orders]
    .filter((o) => !status || o.status === status)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const count = (s?: (typeof ORDER_STATUSES)[number]) => orders.filter((o) => !s || o.status === s).length;

  const tab = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
      active ? "border-burgundy bg-burgundy text-ivory" : "bg-card hover:border-taupe",
    );

  return (
    <>
      <AdminPageHeader title="Orders" description="Filter by status and open an order to move it forward." />
      <nav aria-label="Filter by status" className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <Link href="/admin/orders" className={tab(!status)} aria-current={!status ? "page" : undefined}>
          All ({count()})
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={tab(status === s)} aria-current={status === s ? "page" : undefined}>
            {statusLabel(s)} ({count(s)})
          </Link>
        ))}
      </nav>

      {list.length === 0 ? (
        <div className="rounded-md border border-dashed bg-card px-6 py-16 text-center text-sm text-muted-foreground">
          No {status ? statusLabel(status).toLowerCase() : ""} orders.
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Placed</Th>
              <Th>Items</Th>
              <Th>Status</Th>
              <Th className="text-right">Total</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="hover:bg-muted/40">
                <Td>
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-burgundy hover:underline">{o.orderNumber}</Link>
                </Td>
                <Td>{customerById(o.userId)?.name}</Td>
                <Td className="text-muted-foreground">{formatDateTime(o.createdAt)}</Td>
                <Td className="tabular-nums">{o.items.reduce((n, i) => n + i.quantity, 0)}</Td>
                <Td><OrderStatusBadge status={o.status} /></Td>
                <Td className="text-right tabular-nums">{formatNaira(o.totalKobo)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
