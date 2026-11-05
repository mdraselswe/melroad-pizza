import type { Tenant } from "@/config/schema";

type Contact = Tenant["contact"];

/** One-line postal address, e.g. "422 Melbourne Road, Newport VIC 3015". */
export function addressLine({ address }: Pick<Contact, "address">): string {
  return `${address.street}, ${address.suburb} ${address.state} ${address.postcode}`;
}

/** Embeddable map for the shop: the configured URL, or a keyless Google Maps embed of the address. */
export function mapEmbedUrl(contact: Pick<Contact, "address" | "mapEmbedUrl">): string {
  if (contact.mapEmbedUrl) return contact.mapEmbedUrl;
  const q = encodeURIComponent(`${addressLine(contact)}, ${contact.address.country}`);
  return `https://www.google.com/maps?q=${q}&z=16&output=embed`;
}
