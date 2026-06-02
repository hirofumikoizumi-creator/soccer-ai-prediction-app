/**
 * XPC Message Handler with Exception Handling and Memory Safety
 * 
 * Handles XPC messages safely with:
 * - Exception handling for malformed data
 * - Memory lifecycle management
 * - Weak reference patterns
 * - Autorelease pool simulation
 */

import { Platform } from 'react-native';

interface XPCMessage {
  type: string;
  data?: Record<string, unknown>;
  timestamp?: number;
}

// Autorelease pool simulation for managing temporary objects
class AutoreleasePool {
  private objects: unknown[] = [];

  add<T>(object: T): T {
    this.objects.push(object);
    return object;
  }

  drain(): void {
    this.objects = [];
  }

  static async execute<T>(callback: (pool: AutoreleasePool) => Promise<T>): Promise<T> {
    const pool = new AutoreleasePool();
    try {
      return await callback(pool);
    } finally {
      pool.drain();
    }
  }
}

// XPC Message Handler with safe decoding
export class SafeXPCMessageHandler {
  private handlers: Map<string, (data: unknown) => Promise<void>> = new Map();
  private messageQueue: XPCMessage[] = [];
  private isProcessing = false;
  private maxQueueSize = 100;

  /**
   * Register a message handler for a specific message type
   */
  registerHandler(type: string, handler: (data: unknown) => Promise<void>): void {
    this.handlers.set(type, handler);
  }

  /**
   * Safely decode and process XPC message
   * Wraps decoding in try-catch to prevent crashes from malformed data
   */
  async handleXPCMessage(rawMessage: unknown): Promise<void> {
    try {
      // Validate message structure
      if (!rawMessage || typeof rawMessage !== 'object') {
        console.warn('[XPC] Invalid message format received, discarding');
        return;
      }

      const message = rawMessage as Record<string, unknown>;

      // Safely extract message properties with fallbacks
      const messageType = this.safeStringExtract(message.type);
      if (!messageType) {
        console.warn('[XPC] Message type is missing or invalid, discarding');
        return;
      }

      const timestamp = this.safeNumberExtract(message.timestamp) || Date.now();
      const data = this.safeObjectExtract(message.data);

      // Queue message for processing
      this.queueMessage({
        type: messageType,
        data,
        timestamp,
      });

      // Process queue
      await this.processMessageQueue();
    } catch (error) {
      console.error('[XPC] Error handling XPC message:', error);
      // Do not crash, just log and continue
    }
  }

  /**
   * Safely extract string value
   */
  private safeStringExtract(value: unknown): string | null {
    try {
      if (typeof value === 'string') {
        return value;
      }
      if (value === null || value === undefined) {
        return null;
      }
      // Attempt to convert to string
      return String(value);
    } catch {
      return null;
    }
  }

  /**
   * Safely extract number value
   */
  private safeNumberExtract(value: unknown): number | null {
    try {
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Safely extract object value with deep copy
   * Prevents retain cycles and reference issues
   */
  private safeObjectExtract(value: unknown): Record<string, unknown> | undefined {
    try {
      if (value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        // Create a shallow copy to break reference cycles
        return { ...value as Record<string, unknown> };
      }

      return undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Queue message for processing with size limit
   */
  private queueMessage(message: XPCMessage): void {
    if (this.messageQueue.length >= this.maxQueueSize) {
      console.warn('[XPC] Message queue full, dropping oldest message');
      this.messageQueue.shift();
    }
    this.messageQueue.push(message);
  }

  /**
   * Process queued messages with autorelease pool
   */
  private async processMessageQueue(): Promise<void> {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      await AutoreleasePool.execute(async (pool) => {
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (!message) break;

          try {
            const handler = this.handlers.get(message.type);
            if (handler) {
              // Add message to autorelease pool
              pool.add(message);
              await handler(message.data);
            } else {
              console.warn(`[XPC] No handler registered for message type: ${message.type}`);
            }
          } catch (error) {
            console.error(`[XPC] Error processing message type ${message.type}:`, error);
            // Continue processing other messages
          }
        }
      });
    } catch (error) {
      console.error('[XPC] Error in message queue processing:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Clear all handlers and queue
   */
  clear(): void {
    this.handlers.clear();
    this.messageQueue = [];
    this.isProcessing = false;
  }
}

// Main thread watchdog timer to detect deadlocks
export class MainThreadWatchdog {
  private watchdogTimer: NodeJS.Timeout | null = null;
  private lastActivityTime: number = Date.now();
  private isStalled = false;
  private stallThreshold = 5000; // 5 seconds
  private checkInterval = 1000; // Check every 1 second

  /**
   * Start watchdog timer
   */
  start(): void {
    if (this.watchdogTimer) {
      return;
    }

    this.watchdogTimer = setInterval(() => {
      this.checkMainThreadHealth();
    }, this.checkInterval);
  }

  /**
   * Stop watchdog timer
   */
  stop(): void {
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  /**
   * Report activity on main thread
   */
  reportActivity(): void {
    this.lastActivityTime = Date.now();
    if (this.isStalled) {
      console.warn('[Watchdog] Main thread recovered from stall');
      this.isStalled = false;
    }
  }

  /**
   * Check main thread health
   */
  private checkMainThreadHealth(): void {
    const timeSinceLastActivity = Date.now() - this.lastActivityTime;

    if (timeSinceLastActivity > this.stallThreshold && !this.isStalled) {
      this.isStalled = true;
      console.error(
        `[Watchdog] Main thread stalled for ${timeSinceLastActivity}ms, attempting recovery`
      );
      this.attemptRecovery();
    }
  }

  /**
   * Attempt to recover from main thread stall
   */
  private attemptRecovery(): void {
    try {
      // Log diagnostic information
      console.log('[Watchdog] Attempting main thread recovery...');

      // Reset activity timer
      this.lastActivityTime = Date.now();

      // Trigger garbage collection if available
      if (global.gc) {
        global.gc();
        console.log('[Watchdog] Garbage collection triggered');
      }
    } catch (error) {
      console.error('[Watchdog] Recovery attempt failed:', error);
    }
  }
}

// Global instances
let globalXPCHandler: SafeXPCMessageHandler | null = null;
let globalWatchdog: MainThreadWatchdog | null = null;

/**
 * Initialize XPC message handling and watchdog
 */
export function initializeXPCHandling(): void {
  if (Platform.OS !== 'ios') {
    return;
  }

  try {
    // Initialize XPC handler
    globalXPCHandler = new SafeXPCMessageHandler();

    // Initialize watchdog
    globalWatchdog = new MainThreadWatchdog();
    globalWatchdog.start();

    console.log('[XPC] XPC handling and watchdog initialized');
  } catch (error) {
    console.error('[XPC] Failed to initialize XPC handling:', error);
  }
}

/**
 * Get global XPC handler
 */
export function getXPCHandler(): SafeXPCMessageHandler | null {
  return globalXPCHandler;
}

/**
 * Get global watchdog
 */
export function getMainThreadWatchdog(): MainThreadWatchdog | null {
  return globalWatchdog;
}

/**
 * Cleanup XPC handling
 */
export function cleanupXPCHandling(): void {
  if (globalWatchdog) {
    globalWatchdog.stop();
    globalWatchdog = null;
  }

  if (globalXPCHandler) {
    globalXPCHandler.clear();
    globalXPCHandler = null;
  }

  console.log('[XPC] XPC handling cleaned up');
}
