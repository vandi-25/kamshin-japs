import { cn } from "@/lib/utils";

/** Plain, accessible table styling shared by admin lists. */
export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <table className={cn("w-full min-w-[640px] text-sm", className)} {...props} />
    </div>
  );
}
export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn("border-b bg-muted/60 px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground", className)}
      {...props}
    />
  );
}
export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("border-b px-4 py-3 align-middle", className)} {...props} />;
}
