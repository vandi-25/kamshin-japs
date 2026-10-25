import { getExchangeRates } from "@/app/lib/exchange-rates";
import { payAction } from "@/app/lib/payments";
import CurrencyPayment from "@/app/ui/currency-payment";

export const revalidate = 3600;

export default async function Home() {
  const rates = await getExchangeRates("USD");

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 p-6 font-sans dark:bg-black">
      <CurrencyPayment payAction={payAction} defaultCurrency="USD" rates={rates} />
    </div>
  );
}
