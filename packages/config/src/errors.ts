export type ErrorCode =
  | 'VALIDATION_FAILED'
  | 'AUTHENTICATION_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'QURAN_API_ERROR'
  | 'AI_PROVIDER_ERROR'
  | 'MEDIA_PROCESSING_ERROR'
  | 'STORAGE_ERROR'
  | 'INTERNAL_ERROR';

export abstract class BaseAppError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly statusCode: number;
  readonly isOperational: boolean = true;

  constructor(
    message: string,
    public readonly details?: unknown,
    public readonly cause?: Error
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

export class ValidationError extends BaseAppError {
  readonly code = 'VALIDATION_FAILED';
  readonly statusCode = 400;
}

export class AuthenticationError extends BaseAppError {
  readonly code = 'AUTHENTICATION_REQUIRED';
  readonly statusCode = 401;
}

export class ForbiddenError extends BaseAppError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;
}

export class NotFoundError extends BaseAppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
}

export class RateLimitExceededError extends BaseAppError {
  readonly code = 'RATE_LIMIT_EXCEEDED';
  readonly statusCode = 429;
}

export class QuranApiError extends BaseAppError {
  readonly code = 'QURAN_API_ERROR';
  readonly statusCode = 502;
}

export class AiProviderError extends BaseAppError {
  readonly code = 'AI_PROVIDER_ERROR';
  readonly statusCode = 502;
}

export class MediaProcessingError extends BaseAppError {
  readonly code = 'MEDIA_PROCESSING_ERROR';
  readonly statusCode = 500;
}

export class StorageError extends BaseAppError {
  readonly code = 'STORAGE_ERROR';
  readonly statusCode = 500;
}
