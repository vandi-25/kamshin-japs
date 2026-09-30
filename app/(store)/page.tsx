import Link from "next/link";
import { Gift, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BottleArt } from "@/components/store/bottle-art";
import { NewsletterForm } from "@/components/store/newsletter-form";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { countProductsByCategory, listCategories, listFeaturedProducts, listNewArrivals } from "@/lib/catalog";
import { products } from "@/lib/demo/catalog";

const promises = [
  { icon: ShieldCheck, title: "100% authentic", text: "Every bottle sourced and sealed" },
  { icon: Truck, title: "Nationwide delivery", text: "Lagos, Abuja and every state" },
  { icon: Gift, title: "Gift wrapping", text: "Signature box and handwritten card" },
  { icon: Sparkles, title: "Secure payment", text: "Card, transfer or USSD via Paystack" },
];

const collectionBottle: Record<string, string> = {
  "for-her": "rose-de-minuit",
  "for-him": "velours-noir",
  unisex: "ambre-dore",
  "oud-oriental": "nuit-dor",
};

const collectionTones: Record<string, string> = {
  "for-her": "from-[#f3e3e1] to-[#e6ccc7]",
  "for-him": "from-[#e9e1d8] to-[#d6c6b5]",
  unisex: "from-[#f4efe8] to-[#e3d6c7]",
  "oud-oriental": "from-[#5e1a27] to-[#360a12]",
};

export default async function HomePage() {
  const [featured, arrivals, categories, counts] = await Promise.all([
    listFeaturedProducts(4),
    listNewArrivals(4),
    listCategories(),
    countProductsByCategory(),
  ]);
  const bottleFor = (slug: string) => products.find((p) => p.slug === collectionBottle[slug]);
  const heroBottles = ["oud-royale", "ambre-dore", "rose-de-minuit"]
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-burgundy text-ivory">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:py-28">
          <div className="space-y-7">
            <p className="text-xs tracking-[0.3em] text-gold uppercase">The Autumn Collection</p>
            <h1 className="text-5xl leading-[1.05] font-medium sm:text-6xl lg:text-7xl">
              The art of a <em className="text-gold">lasting</em> impression
            </h1>
            <p className="max-w-md text-base leading-relaxed text-ivory/80">
              Rare ouds, velvet florals and golden ambers — fine fragrances chosen for those who
              are remembered long after they leave the room.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold" className="tracking-[0.14em] uppercase">
                <Link href="/products">Shop fragrances</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-ivory/40 bg-transparent tracking-[0.14em] text-ivory uppercase hover:bg-ivory/10 hover:text-ivory"
              >
                <Link href="/products?category=oud-oriental">Discover oud</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto flex h-80 w-full max-w-lg items-end justify-center sm:h-[30rem]">
            <div aria-hidden className="absolute bottom-0 h-px w-3/4 bg-gradient-to-r from-transparent via-gold to-transparent" />
            {heroBottles.map((p, i) => (
              <div
                key={p.id}
                className={
                  i === 1
                    ? "z-10 h-full w-[44%]"
                    : "h-[72%] w-[36%] opacity-90 " + (i === 0 ? "-mr-8" : "-ml-8")
                }
              >
                <BottleArt tone={p.tone} shape={p.bottle} name={p.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section aria-label="Why Kamshin" className="border-b bg-card">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-gold-text" aria-hidden />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Signature scents */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <SectionHeading eyebrow="Signature scents" title="Our most loved" href="/products" linkLabel="Shop all" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <SectionHeading eyebrow="Collections" title="Find your signature" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const dark = c.slug === "oud-oriental";
            const bottle = bottleFor(c.slug);
            return (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className={`group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-md bg-gradient-to-b p-6 focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none sm:aspect-[4/5] ${collectionTones[c.slug] ?? "from-muted to-secondary"}`}
              >
                {bottle && (
                  <div aria-hidden className="absolute inset-x-0 top-[8%] mx-auto h-[48%] w-1/2 transition-transform duration-500 group-hover:-translate-y-1">
                    <BottleArt tone={bottle.tone} shape={bottle.bottle} />
                  </div>
                )}
                <p className={`text-xs tracking-[0.2em] uppercase ${dark ? "text-gold" : "text-gold-text"}`}>
                  {counts[c.id] ?? 0} fragrances
                </p>
                <h3 className={`mt-2 text-3xl ${dark ? "text-ivory" : "text-burgundy"}`}>{c.name}</h3>
                <p className={`mt-1 text-sm ${dark ? "text-ivory/75" : "text-muted-foreground"}`}>{c.tagline}</p>
                <span
                  className={`mt-5 text-xs tracking-[0.16em] uppercase underline-offset-8 group-hover:underline ${dark ? "text-ivory" : "text-burgundy"}`}
                >
                  Explore
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Story */}
      <section className="mt-24 bg-taupe/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <p className="text-xs tracking-[0.22em] text-gold-text uppercase">The Kamshin way</p>
            <h2 className="text-4xl text-burgundy sm:text-5xl">Scent is the most personal thing you wear</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-foreground/85">
            <p>
              We believe a fragrance should feel like it was made for you. That&apos;s why every scent
              in our collection is chosen for its character, its quality and the story it tells on
              the skin.
            </p>
            <p>
              Not sure where to start? Explore by mood, by notes or by collection — and let each
              bottle arrive beautifully wrapped, ready to be discovered.
            </p>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <SectionHeading eyebrow="Just arrived" title="New this season" href="/products?sort=newest" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {arrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-4 pt-24 text-center sm:px-6">
        <p className="text-xs tracking-[0.22em] text-gold-text uppercase">The Kamshin letter</p>
        <h2 className="mt-3 text-4xl text-foreground">First to know, first to try</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          New arrivals, private sales and fragrance notes — delivered occasionally, never too often.
        </p>
        <div className="mt-8 flex justify-center">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
