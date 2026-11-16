import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CheckoutFlow, mainPurchase } from "@/components/funnel/checkout-flow";
import { loadOrder, funnel } from "@/lib/funnel-config";
import { purchaseThenGo, track } from "@/lib/pixel";
import { readResume, warmUpWhop } from "@/components/funnel/whop-pay";

const Ctx = createContext<() => void>(() => {});

/** Call the returned function from any button to open the two-step checkout popup. */
export const useOpenCheckout = () => useContext(Ctx);

export function CheckoutModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState(false);

  // Buyer coming back from a bank / PayPal verification step → reopen at payment.
  useEffect(() => {
    warmUpWhop(); // download Whop's checkout in the background while the buyer reads
    const r = readResume();
    if (r?.key !== "main") return;
    if (r.paid) purchaseThenGo("main", mainPurchase(!!loadOrder()?.bump), "/oto");
    else {
      setResume(true);
      setOpen(true);
    }
  }, []);

  return (
    <Ctx.Provider
      value={() => {
        track("InitiateCheckout", {
          content_name: funnel.product,
          value: funnel.prices.main,
          currency: "USD",
        });
        setOpen(true);
      }}
    >
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[100dvh] w-full max-w-lg overflow-y-auto rounded-none bg-white p-5 sm:max-h-[92vh] sm:rounded-xl sm:p-6">
          <DialogTitle className="sr-only">Checkout</DialogTitle>
          <DialogDescription className="sr-only">
            Enter your details, then pay securely by card.
          </DialogDescription>
          {open && <CheckoutFlow resumeToPayment={resume} />}
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}
