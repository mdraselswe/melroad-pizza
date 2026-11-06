import { describe, expect, it } from "vitest";
import { pageUrl, ROUTES } from "./routes";

describe("pageUrl", () => {
  it("adds the trailing slash the static export uses", () => {
    expect(pageUrl(ROUTES.menu)).toBe("/menu/");
    expect(pageUrl(ROUTES.home)).toBe("/");
  });

  it("encodes order ids into the query string", () => {
    expect(ROUTES.order("MR 1")).toBe("/order?id=MR%201");
  });
});
