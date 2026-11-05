import { describe, expect, it } from "vitest";
import { rewardProgress } from "./progress";

describe("rewardProgress", () => {
  it("splits points into unlocked rewards and progress", () => {
    expect(rewardProgress(0, 1500)).toEqual({ rewards: 0, fraction: 0, toNext: 1500 });
    expect(rewardProgress(750, 1500)).toEqual({ rewards: 0, fraction: 0.5, toNext: 750 });
    expect(rewardProgress(3300, 1500)).toEqual({ rewards: 2, fraction: 0.2, toNext: 1200 });
  });
});
