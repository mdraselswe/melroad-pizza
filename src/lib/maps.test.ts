import { describe, expect, it } from "vitest";
import { addressLine, mapEmbedUrl } from "./maps";

const address = { street: "1 Test St", suburb: "Newport", state: "VIC", postcode: "3015", country: "AU" };

describe("maps", () => {
  it("formats a one-line address", () => {
    expect(addressLine({ address })).toBe("1 Test St, Newport VIC 3015");
  });

  it("builds a Google Maps embed from the address", () => {
    const url = new URL(mapEmbedUrl({ address }));
    expect(url.hostname).toBe("www.google.com");
    expect(url.searchParams.get("q")).toBe("1 Test St, Newport VIC 3015, AU");
    expect(url.searchParams.get("output")).toBe("embed");
  });

  it("prefers a configured embed URL", () => {
    expect(mapEmbedUrl({ address, mapEmbedUrl: "https://maps.example.com/x" })).toBe(
      "https://maps.example.com/x",
    );
  });
});
