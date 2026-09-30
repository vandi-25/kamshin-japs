"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/slug";

import { Table, Td, Th } from "./data-table";
import { ConfirmDialog } from "./confirm-dialog";

type Row = { id: string; name: string; slug: string; tagline: string; productCount: number };

export function CategoriesManager({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [error, setError] = useState<string | null>(null);

  const open = (row: Row | "new") => {
    setEditing(row);
    setName(row === "new" ? "" : row.name);
    setTagline(row === "new" ? "" : row.tagline);
    setError(null);
  };

  const save = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return setError("Enter a category name");
    const slug = slugify(trimmed);
    if (rows.some((r) => r.slug === slug && (editing === "new" || r.id !== editing?.id))) {
      return setError("A category with this name already exists");
    }
    if (editing === "new") {
      setRows((r) => [...r, { id: crypto.randomUUID(), name: trimmed, slug, tagline: tagline.trim(), productCount: 0 }]);
      toast.success(`${trimmed} created`, { description: "Design preview — not saved yet." });
    } else if (editing) {
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...x, name: trimmed, slug, tagline: tagline.trim() } : x)));
      toast.success(`${trimmed} updated`, { description: "Design preview — not saved yet." });
    }
    setEditing(null);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => open("new")}>
          <Plus aria-hidden /> Add category
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Slug</Th>
            <Th>Tagline</Th>
            <Th>Products</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-muted/40">
              <Td className="font-medium">{row.name}</Td>
              <Td className="font-mono text-xs text-muted-foreground">{row.slug}</Td>
              <Td className="text-muted-foreground">{row.tagline || "—"}</Td>
              <Td className="tabular-nums">{row.productCount}</Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => open(row)} aria-label={`Edit ${row.name}`}>
                    <Pencil />
                  </Button>
                  {row.productCount > 0 ? (
                    <span title={`${row.productCount} products use this category`}>
                      <Button variant="ghost" size="icon-sm" disabled aria-label={`Can't delete ${row.name}: ${row.productCount} products use it`}>
                        <Trash2 />
                      </Button>
                    </span>
                  ) : (
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon-sm" className="text-destructive" aria-label={`Delete ${row.name}`}>
                          <Trash2 />
                        </Button>
                      }
                      title={`Delete ${row.name}?`}
                      description="This category has no products and will be removed."
                      confirmLabel="Delete"
                      destructive
                      onConfirm={() => {
                        setRows((r) => r.filter((x) => x.id !== row.id));
                        toast.success(`${row.name} deleted`, { description: "Design preview — not saved yet." });
                      }}
                    />
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="mt-3 text-xs text-muted-foreground">
        Categories that still have products can&apos;t be deleted — move or deactivate those products first.
      </p>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogTitle>{editing === "new" ? "Add category" : "Edit category"}</DialogTitle>
          <DialogDescription>The URL slug is created from the name.</DialogDescription>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" className="mt-2" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!error} aria-describedby="cat-error" />
              <p className="mt-1.5 text-xs text-muted-foreground">Slug: {slugify(name) || "—"}</p>
              {error && <p id="cat-error" role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
            </div>
            <div>
              <Label htmlFor="cat-tagline">Tagline <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="cat-tagline" className="mt-2" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
