export interface FlagContext {
  tenantId?: string;
  userId?: string;
  planName?: string;
}

/**
 * Planet-Scale Feature Flags: Gradual canary rollouts and dynamic tenant gates.
 */
class FeatureFlagManager {
  private defaultFlags: Record<string, boolean> = {
    "next-gen-editor": false,
    "ai-autowriter": false,
    "realtime-collaboration": false,
    "advanced-analytics": false,
  };

  /**
   * Evaluate if a feature flag is enabled in the current runtime context.
   */
  isEnabled(flag: string, context?: FlagContext): boolean {
    // 1. Check plan-specific gating overrides
    if (context?.planName) {
      const plan = context.planName.toUpperCase();
      if (flag === "ai-autowriter" && ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"].includes(plan)) {
        return true;
      }
      if (flag === "advanced-analytics" && ["PRO", "BUSINESS", "ENTERPRISE"].includes(plan)) {
        return true;
      }
      if (flag === "realtime-collaboration" && ["BUSINESS", "ENTERPRISE"].includes(plan)) {
        return true;
      }
    }

    // 2. Fallback to gradual rollout percentage checks using userId hashing
    if (flag === "next-gen-editor" && context?.userId) {
      const hash = this.hashCode(context.userId);
      return hash % 100 < 20; // 20% canary rollout
    }

    return this.defaultFlags[flag] || false;
  }

  /**
   * Helper hash calculator.
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }
}

export const flags = new FeatureFlagManager();
