import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Table, Td, Th } from "@/components/admin/data-table";
import { RoleControl } from "@/components/admin/role-control";
import { StatTile } from "@/components/admin/stat-tile";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { customerById, orders, REVENUE_STATUSES } from "@/lib/demo/orders";
import { formatDate, formatDateTime } from "@/lib/format";
import { formatNaira, sumKobo } from "@/lib/money";

export const metadata: Metadata = { title: "Customer" };
export const dynamic = "force-dynamic";

const SIGNED_IN_ADMIN_ID = "u_admin";

export default async function AdminCustomerPage(props: PageProps<"/admin/customers/[id]">) {
  const { id } = await props.params;
  const customer = customerById(id);
  if (!customer) notFound();
  const theirs = orders.filter((o) => o.userId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const spent = sumKobo(theirs.filter((o) => REVENUE_STATUSES.includes(o.status)).map((o) => o.totalKobo));

  return (
    <>
      <Link href="/admin/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-burgundy">
        <ArrowLeft className="size-4" aria-hidden /> Customers
      </Link>
      <h1 className="text-4xl text-burgundy">{customer.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {customer.email} · {customer.phone} · joined {formatDate(customer.createdAt)}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatTile label="Orders" value={String(theirs.length)} />
            <StatTile label="Total spent" value={formatNaira(spent)} note="Paid orders only" />
          </div>
          <section aria-labelledby="orders-h">
            <h2 id="orders-h" className="mb-3 font-sans text-base font-medium tracking-normal">Orders</h2>
            {theirs.length === 0 ? (
              <p className="rounded-md border border-dashed bg-card px-6 py-10 text-center text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Order</Th>
                    <Th>Placed</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Total</Th>
                  </tr>
                </thead>
                <tbody>
                  {theirs.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/40">
                      <Td><Link href={`/admin/orders/${o.id}`} className="font-medium text-burgundy hover:underline">{o.orderNumber}</Link></Td>
                      <Td className="text-muted-foreground">{formatDateTime(o.createdAt)}</Td>
                      <Td><OrderStatusBadge status={o.status} /></Td>
                      <Td className="text-right tabular-nums">{formatNaira(o.totalKobo)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </section>
        </div>
        <section aria-labelledby="access-h" className="h-fit rounded-md border bg-card p-5">
          <h2 id="access-h" className="mb-4 font-sans text-base font-medium tracking-normal">Access</h2>
          <RoleControl name={customer.name} initial={customer.role} isSelf={customer.id === SIGNED_IN_ADMIN_ID} />
        </section>
      </div>
    </>
  );
}
