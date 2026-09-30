/**
 * Sample customers and orders for the design preview (admin + "My orders").
 * Dates are generated relative to "now" so the dashboard always looks current.
 */
import { lineTotalKobo, sumKobo } from "@/lib/money";

import { products } from "./catalog";

export type Role = "CUSTOMER" | "ADMIN";
export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

/** Statuses that count as revenue (money received). */
export const REVENUE_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

/** Allowed admin transitions (enforced server-side once orders are live). */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
};

export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  unitPriceKobo: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotalKobo: number;
  shippingKobo: number;
  totalKobo: number;
  paystackReference: string;
  shipping: Address;
  createdAt: string;
};

export const DEMO_SHIPPING_KOBO = 350_000; // ₦3,500 flat (real value comes from SHIPPING_FLAT_FEE_KOBO)

const HOUR = 60 * 60 * 1000;
const ago = (hours: number) => new Date(Date.now() - hours * HOUR).toISOString();

export const customers: Customer[] = [
  { id: "u_admin", name: "Kamshin Admin", email: "admin@kamshin.ng", phone: "0803 000 0000", role: "ADMIN", createdAt: ago(24 * 120) },
  { id: "u_adaeze", name: "Adaeze Okafor", email: "adaeze.okafor@example.com", phone: "0803 214 7788", role: "CUSTOMER", createdAt: ago(24 * 60) },
  { id: "u_tunde", name: "Tunde Bakare", email: "tunde.bakare@example.com", phone: "0812 555 0192", role: "CUSTOMER", createdAt: ago(24 * 45) },
  { id: "u_amina", name: "Amina Bello", email: "amina.bello@example.com", phone: "0706 331 4420", role: "CUSTOMER", createdAt: ago(24 * 32) },
  { id: "u_chidi", name: "Chidi Nwosu", email: "chidi.nwosu@example.com", phone: "0909 118 2203", role: "CUSTOMER", createdAt: ago(24 * 21) },
  { id: "u_folake", name: "Folake Adeyemi", email: "folake.adeyemi@example.com", phone: "0815 870 6612", role: "ADMIN", createdAt: ago(24 * 15) },
  { id: "u_ibrahim", name: "Ibrahim Musa", email: "ibrahim.musa@example.com", phone: "0802 440 9051", role: "CUSTOMER", createdAt: ago(24 * 9) },
  { id: "u_ngozi", name: "Ngozi Eze", email: "ngozi.eze@example.com", phone: "0817 902 3346", role: "CUSTOMER", createdAt: ago(24 * 3) },
];

/** The signed-in shopper shown in the preview's "My account" pages. */
export const DEMO_CUSTOMER_ID = "u_adaeze";

const addresses: Record<string, Address> = {
  u_adaeze: { fullName: "Adaeze Okafor", phone: "0803 214 7788", line1: "14 Admiralty Way", line2: "Lekki Phase 1", city: "Lagos", state: "Lagos" },
  u_tunde: { fullName: "Tunde Bakare", phone: "0812 555 0192", line1: "7 Awolowo Road", line2: "Ikoyi", city: "Lagos", state: "Lagos" },
  u_amina: { fullName: "Amina Bello", phone: "0706 331 4420", line1: "22 Aminu Kano Crescent", line2: "Wuse II", city: "Abuja", state: "FCT" },
  u_chidi: { fullName: "Chidi Nwosu", phone: "0909 118 2203", line1: "5 Stadium Road", city: "Port Harcourt", state: "Rivers" },
  u_ibrahim: { fullName: "Ibrahim Musa", phone: "0802 440 9051", line1: "18 Ahmadu Bello Way", city: "Kaduna", state: "Kaduna" },
  u_ngozi: { fullName: "Ngozi Eze", phone: "0817 902 3346", line1: "3 Ogui Road", city: "Enugu", state: "Enugu" },
};

export const demoAddresses: (Address & { id: string; isDefault: boolean })[] = [
  { id: "addr_home", isDefault: true, ...addresses.u_adaeze },
  { id: "addr_office", isDefault: false, fullName: "Adaeze Okafor", phone: "0803 214 7788", line1: "Plot 1668B Oyin Jolayemi St", line2: "Victoria Island", city: "Lagos", state: "Lagos" },
];

function item(slug: string, quantity: number): OrderItem {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown demo product ${slug}`);
  return { productId: product.id, slug, name: product.name, unitPriceKobo: product.priceKobo, quantity };
}

function order(n: number, userId: string, status: OrderStatus, hoursAgo: number, items: OrderItem[]): Order {
  const subtotalKobo = sumKobo(items.map((i) => lineTotalKobo(i.unitPriceKobo, i.quantity)));
  const created = ago(hoursAgo);
  const ymd = created.slice(2, 10).replace(/-/g, "");
  return {
    id: `o_${n}`,
    orderNumber: `KMS-${ymd}-${String(1000 + n)}`,
    userId,
    status,
    items,
    subtotalKobo,
    shippingKobo: DEMO_SHIPPING_KOBO,
    totalKobo: subtotalKobo + DEMO_SHIPPING_KOBO,
    paystackReference: `kms_demo_${n}`,
    shipping: addresses[userId],
    createdAt: created,
  };
}

export const orders: Order[] = [
  order(24, "u_ngozi", "PAID", 2, [item("rose-de-minuit", 1), item("musc-celeste", 1)]),
  order(23, "u_ibrahim", "PENDING", 3, [item("velours-noir", 1)]),
  order(22, "u_adaeze", "PROCESSING", 5, [item("oud-royale", 1)]),
  order(21, "u_chidi", "PAID", 9, [item("cuir-imperial", 1), item("santal-blanc", 1)]),
  order(20, "u_amina", "SHIPPED", 30, [item("fleur-de-soie", 2)]),
  order(19, "u_tunde", "DELIVERED", 70, [item("nuit-dor", 1)]),
  order(18, "u_adaeze", "DELIVERED", 24 * 6, [item("jardin-de-lagos", 1), item("ambre-dore", 1)]),
  order(17, "u_chidi", "CANCELLED", 24 * 8, [item("encens-sacre", 1)]),
  order(16, "u_amina", "DELIVERED", 24 * 12, [item("santal-blanc", 2)]),
  order(15, "u_tunde", "DELIVERED", 24 * 18, [item("velours-noir", 1), item("vetiver-sauvage", 1)]),
  order(14, "u_adaeze", "DELIVERED", 24 * 26, [item("rose-de-minuit", 1)]),
];

export function customerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function statusLabel(status: OrderStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}
