"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { IMAGE_RULES } from "@/lib/validation/product";
import { cn } from "@/lib/utils";

type LocalImage = { id: string; url: string; name: string };

/**
 * Product photo manager. DESIGN PREVIEW: files stay in the browser as local previews.
 * Phase 7 uploads them to Vercel Blob (client upload, resized to ≤1600px WebP) and
 * deletes removed blobs with del().
 */
export function ImageManager() {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted: LocalImage[] = [];
    for (const file of Array.from(files)) {
      if (!(IMAGE_RULES.types as readonly string[]).includes(file.type)) {
        toast.error(`${file.name}: use JPEG, PNG or WebP`);
        continue;
      }
      if (file.size > IMAGE_RULES.maxBytes) {
        toast.error(`${file.name}: images must be 5MB or smaller`);
        continue;
      }
      accepted.push({ id: crypto.randomUUID(), url: URL.createObjectURL(file), name: file.name });
    }
    if (accepted.length) setImages((prev) => [...prev, ...accepted]);
  };

  const move = (index: number, by: -1 | 1) =>
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(index + by, 0, item);
      return next;
    });

  const remove = (id: string) =>
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-gold bg-gold/5" : "border-input bg-muted/30",
        )}
      >
        <ImagePlus className="size-8 text-gold-text" aria-hidden />
        <p className="mt-3 text-sm font-medium">Drag photos here or</p>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => inputRef.current?.click()}>
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_RULES.types.join(",")}
          multiple
          className="sr-only"
          aria-label="Upload product photos"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          JPEG, PNG or WebP · up to 5MB each · automatically resized to 1600px and converted to WebP
        </p>
      </div>

      {images.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <li key={img.id} className="group relative overflow-hidden rounded-md border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not optimisable */}
              <img src={img.url} alt={`Photo ${i + 1}: ${img.name}`} className="aspect-[4/5] w-full object-cover" />
              {i === 0 && (
                <span className="absolute top-2 left-2 rounded bg-burgundy px-2 py-0.5 text-[10px] tracking-wider text-ivory uppercase">
                  Main
                </span>
              )}
              <div className="flex items-center justify-between border-t p-1.5">
                <div className="flex">
                  <Button type="button" variant="ghost" size="icon-sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move photo ${i + 1} left`}>
                    <ArrowLeft />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" disabled={i === images.length - 1} onClick={() => move(i, 1)} aria-label={`Move photo ${i + 1} right`}>
                    <ArrowRight />
                  </Button>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(img.id)} aria-label={`Delete photo ${i + 1}`} className="text-destructive">
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          No photos yet — the store shows the styled bottle placeholder until you add some. The first photo is the main image.
        </p>
      )}
    </div>
  );
}
