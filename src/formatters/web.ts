// src/formatters/web.ts

/**
 * Generic webhook format - just clean JSON
 * Works with any webhook service
 */
export function formatForWeb(data: any) {
    return {
      timestamp: new Date().toISOString(),
      ...data
    };
  }