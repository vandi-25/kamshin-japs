import { payAction } from "@/app/lib/payments";
import CurrencyPayment from "@/app/ui/currency-payment";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 p-6 font-sans dark:bg-black">
      <CurrencyPayment payAction={payAction} defaultCurrency="USD" />
    </div>
  );
}
