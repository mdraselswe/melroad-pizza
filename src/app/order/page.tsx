import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderTracker } from "@/features/order-tracking";

export const metadata: Metadata = { title: "Order", robots: { index: false } };

export default function OrderPage() {
  return (
    <div className="wrap relative pt-[clamp(120px,14vw,150px)] pb-24">
      <div
        aria-hidden="true"
        className="horizon pointer-events-none absolute inset-x-0 top-0 -z-[1] h-[420px] opacity-60"
      />
      <Suspense>
        <OrderTracker />
      </Suspense>
    </div>
  );
}
