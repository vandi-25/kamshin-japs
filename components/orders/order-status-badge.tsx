import { Ban, CircleCheck, Clock, CreditCard, PackageCheck, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { statusLabel, type OrderStatus } from "@/lib/demo/orders";

const map: Record<OrderStatus, { variant: "warning" | "info" | "secondary" | "success" | "destructive" | "gold"; icon: typeof Clock }> = {
  PENDING: { variant: "warning", icon: Clock },
  PAID: { variant: "gold", icon: CreditCard },
  PROCESSING: { variant: "info", icon: PackageCheck },
  SHIPPED: { variant: "secondary", icon: Truck },
  DELIVERED: { variant: "success", icon: CircleCheck },
  CANCELLED: { variant: "destructive", icon: Ban },
};

/** Status always shows icon + label, never colour alone. */
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { variant, icon: Icon } = map[status];
  return (
    <Badge variant={variant}>
      <Icon className="size-3" aria-hidden />
      {statusLabel(status)}
    </Badge>
  );
}
