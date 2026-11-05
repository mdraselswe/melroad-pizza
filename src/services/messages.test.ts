import { beforeEach, describe, expect, it } from "vitest";
import { listMessages, sendMessage } from "./messages";

describe("messages service", () => {
  beforeEach(() => localStorage.clear());

  it("stores the newest message first and drops an empty phone", () => {
    sendMessage({ name: "A", email: "a@x.com", phone: "", message: "first message" }, 1);
    const second = sendMessage({ name: "B", email: "b@x.com", message: "second message" }, 2);
    expect(second.sentAt).toBe(2);
    const list = listMessages();
    expect(list.map((m) => m.name)).toEqual(["B", "A"]);
    expect(list[1]?.phone).toBeUndefined();
  });
});
