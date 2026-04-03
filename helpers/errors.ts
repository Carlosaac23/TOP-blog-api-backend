import type { $ZodIssue } from 'zod/v4/core';

export function apiError(code: string, message: string, details?: unknown) {
  return {
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
}

export function validationError(issues: $ZodIssue[]) {
  return apiError('validation_error', 'Request validation failed', issues);
}
