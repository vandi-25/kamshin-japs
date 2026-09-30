import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert } from "lucide-react";

import { Table, Td, Th } from "@/components/admin/data-table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatTile } from "@/components/admin/stat-tile";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { listLowStock } from "@/lib/catalog";
import { getDashboardStats } from "@/lib/demo/admin-stats";
import { customerById, orders } from "@/lib/demo/orders";
import { formatDateTime } from "@/lib/format";
import { formatNaira } from "@/lib/money";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = getDashboardStats();
  const lowStock = await listLowStock(10);
  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Revenue counts paid orders and everything after (processing, shipped, delivered)."
        actions={
          <Button asChild>
            <Link href="/admin/products/new">Add product</Link>
          </Button>
        }
      />

      <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Revenue today" value={formatNaira(stats.revenueTodayKobo)} />
        <StatTile label="Revenue this month" value={formatNaira(stats.revenueMonthKobo)} />
        <StatTile label="Orders this month" value={String(stats.ordersThisMonth)} note="All statuses" />
        <StatTile label="Waiting to ship" value={String(stats.toFulfil)} note="Paid or processing" />
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
        <section aria-labelledby="recent-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-heading" className="font-sans text-base font-medium tracking-normal">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-burgundy hover:underline">View all</Link>
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Placed</Th>
                <Th>Status</Th>
                <Th className="text-right">Total</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="hover:bg-muted/40">
                  <Td>
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-burgundy hover:underline">{o.orderNumber}</Link>
                  </Td>
                  <Td>{customerById(o.userId)?.name}</Td>
                  <Td className="text-muted-foreground">{formatDateTime(o.createdAt)}</Td>
                  <Td><OrderStatusBadge status={o.status} /></Td>
                  <Td className="text-right tabular-nums">{formatNaira(o.totalKobo)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>

        <section aria-labelledby="low-heading" className="h-fit rounded-md border bg-card">
          <div className="flex items-center gap-2 border-b px-5 py-4">
            <CircleAlert className="size-4 text-warning" aria-hidden />
            <h2 id="low-heading" className="font-sans text-base font-medium tracking-normal">Low stock</h2>
            <span className="ml-auto text-xs text-muted-foreground">10 or fewer</span>
          </div>
          <ul className="divide-y">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <Link href={`/admin/products/${p.id}`} className="hover:text-burgundy hover:underline">{p.name}</Link>
                <span className={p.stock === 0 ? "font-medium text-destructive" : "text-warning"}>
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
