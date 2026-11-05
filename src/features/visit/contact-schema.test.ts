import { describe, expect, it } from "vitest";
import { CONTACT_DEFAULTS, contactSchema } from "./contact-schema";

const valid = { name: "Sam", email: "sam@example.com", phone: "", message: "Do you cater for parties?" };

describe("contactSchema", () => {
  it("accepts a complete message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects the empty form on every required field", () => {
    const result = contactSchema.safeParse(CONTACT_DEFAULTS);
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["name", "email", "message"]));
    expect(paths).not.toContain("phone");
  });

  it("rejects a too-short message and a bad email", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
});
