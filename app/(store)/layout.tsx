import { DemoBanner } from "@/components/demo-banner";
import { CurrencyProvider } from "@/components/store/currency-provider";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { getDisplayCurrency } from "@/lib/display-currency";
import { getExchangeRates } from "@/lib/exchange-rates";

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const [selected, rates] = await Promise.all([getDisplayCurrency(), getExchangeRates()]);
  return (
    <CurrencyProvider selected={selected} rates={rates}>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-card px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <DemoBanner />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </CurrencyProvider>
  );
}
