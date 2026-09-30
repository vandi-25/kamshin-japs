"use client";

import { useState } from "react";
import { ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/demo/orders";

import { ConfirmDialog } from "./confirm-dialog";

export function RoleBadge({ role }: { role: Role }) {
  return role === "ADMIN" ? (
    <Badge variant="default"><ShieldCheck className="size-3" aria-hidden /> Admin</Badge>
  ) : (
    <Badge variant="outline"><User className="size-3" aria-hidden /> Customer</Badge>
  );
}

/** Promote/demote with confirmation. Server enforces requireAdmin() and blocks self-demotion (Phase 7). */
export function RoleControl({ name, initial, isSelf }: { name: string; initial: Role; isSelf: boolean }) {
  const [role, setRole] = useState<Role>(initial);
  const promote = role === "CUSTOMER";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">Role: <RoleBadge role={role} /></div>
      {isSelf ? (
        <p className="text-xs text-muted-foreground">You can&apos;t change your own role.</p>
      ) : (
        <ConfirmDialog
          trigger={<Button variant={promote ? "default" : "outline"} className="w-full">{promote ? "Make admin" : "Remove admin access"}</Button>}
          title={promote ? `Make ${name} an admin?` : `Remove admin access from ${name}?`}
          description={
            promote
              ? "They'll be able to sign in to the admin dashboard and manage products, orders and customers."
              : "They'll become a regular customer and lose access to the admin dashboard immediately."
          }
          confirmLabel={promote ? "Make admin" : "Remove access"}
          destructive={!promote}
          onConfirm={() => {
            const next: Role = promote ? "ADMIN" : "CUSTOMER";
            setRole(next);
            toast.success(promote ? `${name} is now an admin` : `${name} is now a customer`, {
              description: "Design preview — nothing saved.",
            });
          }}
        />
      )}
    </div>
  );
}
