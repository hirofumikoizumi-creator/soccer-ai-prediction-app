/**
 * Memory Lifecycle Manager
 * 
 * Manages object lifecycle across thread boundaries with:
 * - Weak reference patterns
 * - Safe object copying
 * - Retain/release tracking
 * - Autorelease pool management
 */

interface ObjectReference {
  id: string;
  object: unknown;
  retainCount: number;
  createdAt: number;
  lastAccessedAt: number;
}

interface MemoryStats {
  totalObjects: number;
  totalRetainCount: number;
  oldestObject: ObjectReference | null;
  averageAge: number;
}

/**
 * Weak reference holder for preventing retain cycles
 */
export class WeakRef<T extends object> {
  private ref: WeakMap<T, boolean>;
  private value: T | null;

  constructor(value: T) {
    this.ref = new WeakMap();
    this.value = value;
    this.ref.set(value, true);
  }

  /**
   * Get the referenced object if it still exists
   */
  get(): T | null {
    if (this.value && this.ref.has(this.value)) {
      return this.value;
    }
    this.value = null;
    return null;
  }

  /**
   * Check if reference is still valid
   */
  isValid(): boolean {
    return this.value !== null && this.ref.has(this.value);
  }

  /**
   * Clear the reference
   */
  clear(): void {
    this.value = null;
  }
}

/**
 * Safe object copy for thread-safe passing
 */
export class SafeObjectCopy {
  /**
   * Create a deep copy of an object for safe thread passing
   */
  static deepCopy<T>(obj: T): T {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Handle primitives
    if (typeof obj !== 'object') {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepCopy(item)) as unknown as T;
    }

    // Handle objects
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof Map) {
      const newMap = new Map();
      obj.forEach((value, key) => {
        newMap.set(this.deepCopy(key), this.deepCopy(value));
      });
      return newMap as unknown as T;
    }

    if (obj instanceof Set) {
      return new Set([...obj].map((item) => this.deepCopy(item))) as unknown as T;
    }

    // Handle plain objects
    const copy: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = this.deepCopy((obj as Record<string, unknown>)[key]);
      }
    }
    return copy as T;
  }

  /**
   * Create a shallow copy for performance-critical scenarios
   */
  static shallowCopy<T extends object>(obj: T): T {
    if (Array.isArray(obj)) {
      return [...obj] as unknown as T;
    }

    if (obj instanceof Map) {
      return new Map(obj) as unknown as T;
    }

    if (obj instanceof Set) {
      return new Set(obj) as unknown as T;
    }

    return { ...obj };
  }
}

/**
 * Memory Lifecycle Manager for tracking object lifecycle
 */
export class MemoryLifecycleManager {
  private objectRegistry: Map<string, ObjectReference> = new Map();
  private nextId = 0;
  private maxTrackedObjects = 1000;

  /**
   * Register an object for lifecycle tracking
   */
  registerObject<T>(object: T): string {
    const id = `obj_${this.nextId++}`;

    if (this.objectRegistry.size >= this.maxTrackedObjects) {
      // Remove oldest object
      let oldestId = '';
      let oldestTime = Date.now();

      for (const [key, ref] of this.objectRegistry.entries()) {
        if (ref.lastAccessedAt < oldestTime) {
          oldestTime = ref.lastAccessedAt;
          oldestId = key;
        }
      }

      if (oldestId) {
        this.objectRegistry.delete(oldestId);
        console.warn(`[MemoryLifecycle] Evicted oldest object: ${oldestId}`);
      }
    }

    this.objectRegistry.set(id, {
      id,
      object,
      retainCount: 1,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
    });

    return id;
  }

  /**
   * Retain an object (increment reference count)
   */
  retain(id: string): boolean {
    const ref = this.objectRegistry.get(id);
    if (ref) {
      ref.retainCount++;
      ref.lastAccessedAt = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Release an object (decrement reference count)
   */
  release(id: string): boolean {
    const ref = this.objectRegistry.get(id);
    if (ref) {
      ref.retainCount--;
      ref.lastAccessedAt = Date.now();

      if (ref.retainCount <= 0) {
        this.objectRegistry.delete(id);
        return true; // Object was deallocated
      }
      return false;
    }
    return false;
  }

  /**
   * Get an object by ID
   */
  getObject<T>(id: string): T | null {
    const ref = this.objectRegistry.get(id);
    if (ref) {
      ref.lastAccessedAt = Date.now();
      return ref.object as T;
    }
    return null;
  }

  /**
   * Get retain count for an object
   */
  getRetainCount(id: string): number {
    const ref = this.objectRegistry.get(id);
    return ref ? ref.retainCount : 0;
  }

  /**
   * Get memory statistics
   */
  getStats(): MemoryStats {
    let totalRetainCount = 0;
    let oldestObject: ObjectReference | null = null;
    let oldestTime = Date.now();

    for (const ref of this.objectRegistry.values()) {
      totalRetainCount += ref.retainCount;

      if (ref.createdAt < oldestTime) {
        oldestTime = ref.createdAt;
        oldestObject = ref;
      }
    }

    const now = Date.now();
    const ages = Array.from(this.objectRegistry.values()).map((ref) => now - ref.createdAt);
    const averageAge = ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0;

    return {
      totalObjects: this.objectRegistry.size,
      totalRetainCount,
      oldestObject,
      averageAge,
    };
  }

  /**
   * Clear all tracked objects
   */
  clear(): void {
    this.objectRegistry.clear();
    this.nextId = 0;
  }

  /**
   * Detect potential memory leaks
   */
  detectLeaks(): string[] {
    const leaks: string[] = [];
    const now = Date.now();
    const leakThreshold = 60000; // 60 seconds

    for (const [id, ref] of this.objectRegistry.entries()) {
      const age = now - ref.createdAt;
      if (age > leakThreshold && ref.retainCount > 0) {
        leaks.push(`${id}: age=${age}ms, retainCount=${ref.retainCount}`);
      }
    }

    return leaks;
  }
}

/**
 * Autorelease pool for managing temporary objects
 */
export class AutoreleasePool {
  private objects: unknown[] = [];
  private manager: MemoryLifecycleManager;

  constructor(manager: MemoryLifecycleManager) {
    this.manager = manager;
  }

  /**
   * Add object to autorelease pool
   */
  add<T>(object: T): T {
    this.objects.push(object);
    return object;
  }

  /**
   * Drain the pool (release all objects)
   */
  drain(): void {
    for (const obj of this.objects) {
      if (typeof obj === 'object' && obj !== null && 'id' in obj) {
        const id = (obj as Record<string, unknown>).id as string;
        this.manager.release(id);
      }
    }
    this.objects = [];
  }

  /**
   * Execute callback within autorelease pool context
   */
  static async execute<T>(
    manager: MemoryLifecycleManager,
    callback: (pool: AutoreleasePool) => Promise<T>
  ): Promise<T> {
    const pool = new AutoreleasePool(manager);
    try {
      return await callback(pool);
    } finally {
      pool.drain();
    }
  }
}

// Global instance
let globalMemoryManager: MemoryLifecycleManager | null = null;

/**
 * Initialize global memory lifecycle manager
 */
export function initializeMemoryLifecycleManager(): MemoryLifecycleManager {
  if (!globalMemoryManager) {
    globalMemoryManager = new MemoryLifecycleManager();
    console.log('[MemoryLifecycle] Memory lifecycle manager initialized');
  }
  return globalMemoryManager;
}

/**
 * Get global memory lifecycle manager
 */
export function getMemoryLifecycleManager(): MemoryLifecycleManager | null {
  return globalMemoryManager;
}

/**
 * Cleanup memory lifecycle manager
 */
export function cleanupMemoryLifecycleManager(): void {
  if (globalMemoryManager) {
    const leaks = globalMemoryManager.detectLeaks();
    if (leaks.length > 0) {
      console.warn('[MemoryLifecycle] Potential memory leaks detected:', leaks);
    }

    globalMemoryManager.clear();
    globalMemoryManager = null;
    console.log('[MemoryLifecycle] Memory lifecycle manager cleaned up');
  }
}
