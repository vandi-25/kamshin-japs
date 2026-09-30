import { z } from "zod";

import { nairaToKobo } from "@/lib/money";

const one = (v: unknown) => (Array.isArray(v) ? v[0] : v);

const nairaParam = z.preprocess(one, z.string().optional()).transform((v) => {
  if (!v) return undefined;
  const kobo = nairaToKobo(v);
  return kobo === null ? undefined : kobo;
});

/** Parses /products URL search params. Invalid values are dropped, never trusted. */
export const productFiltersSchema = z.object({
  q: z.preprocess(one, z.string().trim().max(80).optional()).catch(undefined),
  category: z.preprocess(one, z.string().regex(/^[a-z0-9-]+$/).max(60).optional()).catch(undefined),
  min: nairaParam.catch(undefined),
  max: nairaParam.catch(undefined),
  sort: z.preprocess(one, z.enum(["newest", "price-asc", "price-desc"]).optional()).catch(undefined),
  page: z.preprocess(one, z.coerce.number().int().min(1).max(1000).optional()).catch(undefined),
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;
