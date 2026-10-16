// ============================================================================
// SEVLEX AGENTGUARD™: AUTONOMOUS CIRCUIT BREAKER & TRAJECTORY ANOMALY ENGINE
// Tracks multi-turn agent sessions, detects infinite loops, and halts runaway models.
// ============================================================================

export interface CircuitStatus {
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  trippedReason?: string | undefined;
  trippedAt?: number | undefined;
  callCount: number;
  consecutiveFailures: number;
}

export interface CircuitCheckResult {
  allowed: boolean;
  reason?: string;
  code?: number;
}

export class AgentCircuitBreaker {
  private state: "CLOSED" | "OPEN" = "CLOSED";
  private trippedReason: string = "";
  private trippedAt: number = 0;

  // Sliding window velocity tracker
  private callTimestamps: number[] = [];
  private readonly maxCallsPerWindow: number;
  private readonly windowMs: number;

  // Failure and loop tracking
  private consecutiveFailures: number = 0;
  private readonly maxConsecutiveFailures: number;

  // Identical payload loop detection
  private lastCallSignature: string = "";
  private identicalCallCount: number = 0;
  private readonly maxIdenticalCalls: number;

  constructor(options?: {
    maxCallsPerWindow?: number;
    windowMs?: number;
    maxConsecutiveFailures?: number;
    maxIdenticalCalls?: number;
  }) {
    this.maxCallsPerWindow = options?.maxCallsPerWindow || 25; // max 25 calls per 30s
    this.windowMs = options?.windowMs || 30_000;
    this.maxConsecutiveFailures = options?.maxConsecutiveFailures || 5; // 5 errors = infinite loop
    this.maxIdenticalCalls = options?.maxIdenticalCalls || 3; // 3 identical calls = spam loop
  }

  /**
   * Pre-execution inspection: Checks if the circuit breaker is OPEN or if rate limits are violated.
   */
  public checkBeforeExecution(toolName: string, args: any): CircuitCheckResult {
    const now = Date.now();

    // 1. If Circuit is already OPEN, block immediately
    if (this.state === "OPEN") {
      return {
        allowed: false,
        code: -32002,
        reason: `Sevlex AgentGuard: Agent session circuit is OPEN. Tripped due to: ${this.trippedReason}. Execution paused to prevent runaway cost and damage.`,
      };
    }

    // 2. Sliding window velocity check
    this.callTimestamps = this.callTimestamps.filter((t) => now - t < this.windowMs);
    if (this.callTimestamps.length >= this.maxCallsPerWindow) {
      this.trip(`Rate-of-fire anomaly: Exceeded ${this.maxCallsPerWindow} calls within ${this.windowMs / 1000}s`);
      return {
        allowed: false,
        code: -32002,
        reason: `Sevlex AgentGuard: Circuit TRIPPED. Velocity threshold exceeded (${this.maxCallsPerWindow} calls in ${this.windowMs / 1000}s).`,
      };
    }

    // 3. Identical Call Loop Check
    const currentSignature = `${toolName}:${JSON.stringify(args || {})}`;
    if (currentSignature === this.lastCallSignature) {
      this.identicalCallCount++;
      if (this.identicalCallCount >= this.maxIdenticalCalls) {
        this.trip(`Identical call loop detected: Tool '${toolName}' executed ${this.identicalCallCount} times with identical arguments.`);
        return {
          allowed: false,
          code: -32002,
          reason: `Sevlex AgentGuard: Circuit TRIPPED. Hallucination loop detected on '${toolName}'. Execution halted.`,
        };
      }
    } else {
      this.lastCallSignature = currentSignature;
      this.identicalCallCount = 1;
    }

    // Record call timestamp
    this.callTimestamps.push(now);

    return { allowed: true };
  }

  /**
   * Post-execution feedback: Record tool success or failure to calibrate circuit health.
   */
  public recordResult(success: boolean, wasBlocked: boolean) {
    if (success && !wasBlocked) {
      // Healthy execution resets the failure counter
      this.consecutiveFailures = 0;
    } else {
      this.consecutiveFailures++;
      if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
        this.trip(`Consecutive error threshold reached: ${this.consecutiveFailures} sequential failures/blocks without successful execution.`);
      }
    }
  }

  private trip(reason: string) {
    this.state = "OPEN";
    this.trippedReason = reason;
    this.trippedAt = Date.now();
  }

  public reset() {
    this.state = "CLOSED";
    this.trippedReason = "";
    this.trippedAt = 0;
    this.consecutiveFailures = 0;
    this.identicalCallCount = 0;
    this.callTimestamps = [];
  }

  public getStatus(): CircuitStatus {
    return {
      state: this.state,
      trippedReason: this.trippedReason || undefined,
      trippedAt: this.trippedAt || undefined,
      callCount: this.callTimestamps.length,
      consecutiveFailures: this.consecutiveFailures,
    };
  }
}
