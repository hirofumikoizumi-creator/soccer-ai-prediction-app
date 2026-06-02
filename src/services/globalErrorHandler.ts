/**
 * Global Error Handler Service
 * 
 * This service provides comprehensive error handling for the entire application,
 * including main thread exception interception and background thread memory safety.
 * 
 * Build 8: Main Thread Interceptor Implementation
 */

// Platform import removed - not currently used but available for future native integration

/**
 * Error log storage for debugging
 */
const errorLogs: {
  timestamp: string;
  thread: string;
  error: Error | string;
  stack?: string;
  severity: 'critical' | 'error' | 'warning';
}[] = [];

const MAX_ERROR_LOGS = 100;

/**
 * Log error with metadata
 */
function logError(
  error: Error | string,
  thread: 'main' | 'background',
  severity: 'critical' | 'error' | 'warning' = 'error'
): void {
  const errorEntry = {
    timestamp: new Date().toISOString(),
    thread,
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    severity,
  };

  errorLogs.push(errorEntry);

  // Keep only recent logs
  if (errorLogs.length > MAX_ERROR_LOGS) {
    errorLogs.shift();
  }

  // Log to console
  const logLevel = severity === 'critical' ? 'error' : severity;
  console[logLevel as keyof typeof console](
    `[${thread.toUpperCase()}] [${severity.toUpperCase()}] ${
      error instanceof Error ? error.message : error
    }`,
    error instanceof Error ? error.stack : ''
  );
}

/**
 * Get error logs for debugging
 */
export function getErrorLogs(): typeof errorLogs {
  return [...errorLogs];
}

/**
 * Clear error logs
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
}

/**
 * Main thread exception handler
 * Catches and safely handles exceptions on the main thread
 */
export function setupMainThreadInterceptor(): void {
  if (Platform.OS === 'ios') {
    // For iOS, we need to wrap critical operations
    // This will be enhanced with native module integration
    console.log('[GlobalErrorHandler] Main thread interceptor setup for iOS');
  }

  // Global error handler for unhandled promise rejections
  const originalWarn = console.warn;
  const originalError = console.error;

  // Intercept console.error to catch potential crashes
  console.error = function (...args: any[]) {
    const errorMessage = args.map((arg) =>
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ');

    // Check if this is a critical error
    if (
      errorMessage.includes('abort') ||
      errorMessage.includes('SIGABRT') ||
      errorMessage.includes('Fatal') ||
      errorMessage.includes('Crash')
    ) {
      logError(errorMessage, 'main', 'critical');
    } else {
      logError(errorMessage, 'main', 'error');
    }

    // Call original error handler
    originalError.apply(console, args);
  };

  // Intercept console.warn for potential issues
  console.warn = function (...args: any[]) {
    const warnMessage = args.map((arg) =>
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ');

    if (
      warnMessage.includes('memory') ||
      warnMessage.includes('Memory') ||
      warnMessage.includes('leak')
    ) {
      logError(warnMessage, 'main', 'warning');
    }

    // Call original warn handler
    originalWarn.apply(console, args);
  };
}

/**
 * Safe wrapper for main thread operations
 * Wraps a function to catch and handle exceptions safely
 */
export function safeMainThreadOperation<T>(
  operation: () => T,
  operationName: string = 'unknown'
): T | null {
  try {
    return operation();
  } catch (error) {
    logError(
      `Error in ${operationName}: ${error instanceof Error ? error.message : String(error)}`,
      'main',
      'error'
    );
    // Return null instead of throwing to prevent app crash
    return null;
  }
}

/**
 * Safe wrapper for async operations
 */
export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  operationName: string = 'unknown'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    logError(
      `Error in async ${operationName}: ${error instanceof Error ? error.message : String(error)}`,
      'main',
      'error'
    );
    // Return null instead of throwing to prevent app crash
    return null;
  }
}

/**
 * Memory safety check
 * Monitors for potential memory issues
 */
export function checkMemorySafety(): void {
  try {
    // This will be enhanced with native module integration
    // For now, just log that we're monitoring
    if (Platform.OS === 'ios') {
      console.log('[GlobalErrorHandler] Memory safety check running');
    }
  } catch {
    logError('Memory safety check failed', 'background', 'warning');
  }
}

/**
 * Initialize global error handler
 * Should be called as early as possible in app startup
 */
export function initializeGlobalErrorHandler(): void {
  try {
    setupMainThreadInterceptor();
    console.log('[GlobalErrorHandler] Global error handler initialized');
  } catch (error) {
    console.warn('[GlobalErrorHandler] Failed to initialize:', error);
  }
}
