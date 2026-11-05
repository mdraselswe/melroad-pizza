import { describe, expect, it } from "vitest";
import { tenant } from "@/config/tenant";
import { CHECKOUT_DEFAULTS, checkoutSchema } from "./checkout-schema";

const schema = checkoutSchema(tenant.ordering.delivery);
const base = { ...CHECKOUT_DEFAULTS, name: "Sam Lee", phone: "0412 345 678" };
const errorPaths = (values: object) => {
  const r = schema.safeParse(values);
  return r.success ? [] : r.error.issues.map((i) => i.path.join("."));
};

describe("checkout schema", () => {
  it("accepts a pickup order with just a name and phone", () => {
    expect(errorPaths(base)).toEqual([]);
  });

  it("validates contact details", () => {
    expect(errorPaths({ ...base, name: " ", phone: "12", email: "nope" })).toEqual([
      "name",
      "phone",
      "email",
    ]);
  });

  it("requires an address inside the delivery zone", () => {
    expect(errorPaths({ ...base, mode: "delivery" })).toEqual(["street", "suburb", "postcode"]);
    const address = { street: "1 Main St", suburb: "Newport" };
    expect(errorPaths({ ...base, mode: "delivery", ...address, postcode: "3000" })).toEqual(["postcode"]);
    expect(errorPaths({ ...base, mode: "delivery", ...address, postcode: "3015" })).toEqual([]);
  });

  it("needs a slot when scheduling", () => {
    expect(errorPaths({ ...base, when: "later" })).toEqual(["slot"]);
    expect(errorPaths({ ...base, when: "later", slot: "0@1080" })).toEqual([]);
  });
});
