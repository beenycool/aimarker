// Performance optimization utilities for AI Marker

// Request cache for API responses
class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global request cache instance
export const requestCache = new RequestCache();

// Generate cache key for API requests
export const generateCacheKey = (
  model: string,
  systemPrompt: string,
  userPrompt: string
): string => {
  const content = `${model}:${systemPrompt}:${userPrompt}`;
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `api_${Math.abs(hash)}`;
};

// Debounced function creator with cleanup
export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } => {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedFunc = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  }) as T & { cancel: () => void };

  debouncedFunc.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunc;
};

// Throttled function creator
export const createThrottledFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, delay - (now - lastCall));
    }
  }) as T;
};

// Memoization utility with LRU cache
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Memoization decorator
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  cacheSize: number = 50
): T => {
  const cache = new LRUCache<string, ReturnType<T>>(cacheSize);

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached !== undefined) {
      return cached;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Performance monitoring
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  startTimer(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const values = this.metrics.get(label)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  getAverageTime(label: string): number {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    for (const [label, values] of this.metrics) {
      if (values.length > 0) {
        result[label] = {
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          count: values.length,
          latest: values[values.length - 1]
        };
      }
    }
    
    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

// Global performance monitor
export const performanceMonitor = new PerformanceMonitor();

// Batch processing utility
export const batchProcess = async <T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  batchSize: number = 5,
  delayBetweenBatches: number = 100
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map((item, index) => 
      processor(item, i + index)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add delay between batches to prevent overwhelming the API
    if (i + batchSize < items.length && delayBetweenBatches > 0) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }
  
  return results;
};

// Retry utility with exponential backoff
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}; 