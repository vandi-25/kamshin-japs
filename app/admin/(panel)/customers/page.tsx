import type { Metadata } from "next";
import Link from "next/link";

import { Table, Td, Th } from "@/components/admin/data-table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { RoleBadge } from "@/components/admin/role-control";
import { customers, orders, REVENUE_STATUSES } from "@/lib/demo/orders";
import { formatDate } from "@/lib/format";
import { formatNaira, sumKobo } from "@/lib/money";

export const metadata: Metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

export default function AdminCustomersPage() {
  const rows = customers
    .map((c) => {
      const theirs = orders.filter((o) => o.userId === c.id);
      return {
        ...c,
        orderCount: theirs.length,
        spentKobo: sumKobo(theirs.filter((o) => REVENUE_STATUSES.includes(o.status)).map((o) => o.totalKobo)),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <AdminPageHeader title="Customers" description={`${rows.length} accounts · open one to see orders or change their role`} />
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Joined</Th>
            <Th className="text-right">Orders</Th>
            <Th className="text-right">Total spent</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="hover:bg-muted/40">
              <Td>
                <Link href={`/admin/customers/${c.id}`} className="font-medium text-burgundy hover:underline">{c.name}</Link>
              </Td>
              <Td className="text-muted-foreground">{c.email}</Td>
              <Td><RoleBadge role={c.role} /></Td>
              <Td className="text-muted-foreground">{formatDate(c.createdAt)}</Td>
              <Td className="text-right tabular-nums">{c.orderCount}</Td>
              <Td className="text-right tabular-nums">{formatNaira(c.spentKobo)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
