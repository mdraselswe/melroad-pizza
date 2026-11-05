export interface RewardProgress {
  /** Whole rewards unlocked. */
  rewards: number;
  /** Progress toward the next reward, 0–1. */
  fraction: number;
  /** Points still needed for the next reward. */
  toNext: number;
}

export function rewardProgress(points: number, threshold: number): RewardProgress {
  const safe = Math.max(1, threshold);
  const rewards = Math.floor(points / safe);
  const into = points - rewards * safe;
  return { rewards, fraction: into / safe, toNext: safe - into };
}
