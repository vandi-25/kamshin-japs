import { sumKobo } from "@/lib/money";

import { orders, REVENUE_STATUSES } from "./orders";

/** Calendar day/month in Lagos time (WAT, UTC+1, no daylight saving). */
function lagosParts(iso: string | Date) {
  const d = new Date(new Date(iso).getTime() + 60 * 60 * 1000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), day: d.getUTCDate() };
}

export function getDashboardStats(now = new Date()) {
  const today = lagosParts(now);
  const paid = orders.filter((o) => REVENUE_STATUSES.includes(o.status));
  const isToday = (iso: string) => {
    const p = lagosParts(iso);
    return p.y === today.y && p.m === today.m && p.day === today.day;
  };
  const isThisMonth = (iso: string) => {
    const p = lagosParts(iso);
    return p.y === today.y && p.m === today.m;
  };
  return {
    revenueTodayKobo: sumKobo(paid.filter((o) => isToday(o.createdAt)).map((o) => o.totalKobo)),
    revenueMonthKobo: sumKobo(paid.filter((o) => isThisMonth(o.createdAt)).map((o) => o.totalKobo)),
    ordersThisMonth: orders.filter((o) => isThisMonth(o.createdAt)).length,
    toFulfil: orders.filter((o) => o.status === "PAID" || o.status === "PROCESSING").length,
  };
}
