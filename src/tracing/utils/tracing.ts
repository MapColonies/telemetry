import { IncomingMessage, RequestOptions } from 'http';
import api, { Span, SpanStatusCode, Tracer } from '@opentelemetry/api';
import { getTracingConfig } from '../config';

const tracingConfig = getTracingConfig();

export const contexBindingHelper = <T>(parentSpan: Span, func: T): T => {
  const ctx = api.trace.setSpan(api.context.active(), parentSpan);
  return api.context.bind(ctx, func);
};

export const ignoreIncomingRequestUrl = (urlsToIgnore: RegExp[]): ((request: IncomingMessage) => boolean) => {
  return (request): boolean => urlsToIgnore.some((regex) => regex.test(request.url ?? ''));
};

export const ignoreOutgoingRequestPath = (pathsToIgnore: RegExp[]): ((request: RequestOptions) => boolean) => {
  return (request): boolean => pathsToIgnore.some((regex) => regex.test(request.path ?? ''));
};

export const asyncCallWithSpan = async <T>(fn: () => Promise<T>, tracer: Tracer, spanName: string): Promise<T> => {
  if (!tracingConfig.isEnabled) {
    return fn();
  }
  return new Promise((resolve, reject) => {
    return tracer.startActiveSpan(spanName, (span) => {
      fn()
        .then((result) => {
          handleSpanOnSuccess(span);
          resolve(result);
        })
        .catch((error) => {
          handleSpanOnError(span, error);
          reject(error);
        });
    });
  });
};

export const callWithSpan = <T>(fn: () => T, tracer: Tracer, spanName: string): T => {
  if (!tracingConfig.isEnabled) {
    return fn();
  }
  return tracer.startActiveSpan(spanName, (span) => {
    try {
      const result = fn();
      handleSpanOnSuccess(span);
      return result;
    } catch (error) {
      handleSpanOnError(span, error);
      throw error;
    }
  });
};

export const handleSpanOnSuccess = (span: Span): void => {
  span.setStatus({ code: SpanStatusCode.OK });
  span.end();
};

export const handleSpanOnError = (span: Span, error?: unknown): void => {
  span.setStatus({ code: SpanStatusCode.ERROR });

  if (error instanceof Error) {
    span.recordException(error);
  }

  span.end();
};
