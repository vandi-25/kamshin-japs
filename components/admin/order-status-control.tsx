"use client";

import { useState } from "react";
import { toast } from "sonner";

import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { ORDER_TRANSITIONS, statusLabel, type OrderStatus } from "@/lib/demo/orders";

import { ConfirmDialog } from "./confirm-dialog";

/** Only valid next statuses are offered; the server re-checks the transition (Phase 7). */
export function OrderStatusControl({ initial, orderNumber }: { initial: OrderStatus; orderNumber: string }) {
  const [status, setStatus] = useState<OrderStatus>(initial);
  const options = ORDER_TRANSITIONS[status];
  const [next, setNext] = useState<OrderStatus | "">(options[0] ?? "");

  const apply = (to: OrderStatus) => {
    setStatus(to);
    setNext(ORDER_TRANSITIONS[to][0] ?? "");
    toast.success(`${orderNumber} marked ${statusLabel(to).toLowerCase()}`, {
      description:
        to === "CANCELLED" && initial !== "PENDING"
          ? "Items would be returned to stock. Design preview — nothing saved."
          : "Design preview — nothing saved.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        Current status: <OrderStatusBadge status={status} />
      </div>
      {options.length === 0 ? (
        <p className="text-sm text-muted-foreground">This order is {statusLabel(status).toLowerCase()} — no further changes.</p>
      ) : (
        <div className="space-y-3">
          <div>
            <Label htmlFor="next-status">Move to</Label>
            <div className="mt-2">
              <NativeSelect id="next-status" value={next} onChange={(e) => setNext(e.target.value as OrderStatus)}>
                {options.map((s) => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </NativeSelect>
            </div>
          </div>
          {next === "CANCELLED" ? (
            <ConfirmDialog
              trigger={<Button variant="destructive" className="w-full">Cancel order</Button>}
              title={`Cancel ${orderNumber}?`}
              description={
                status === "PENDING"
                  ? "The customer hasn't paid yet. The order will be closed."
                  : "This order is paid. Cancelling returns its items to stock; refund the customer from your Paystack dashboard."
              }
              confirmLabel="Cancel order"
              destructive
              onConfirm={() => apply("CANCELLED")}
            />
          ) : (
            <Button className="w-full" disabled={!next} onClick={() => next && apply(next)}>
              Update status
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
