import { IncomingMessage, RequestOptions } from 'http';
import api, { Span, SpanOptions, SpanStatusCode, Tracer } from '@opentelemetry/api';
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

/**
 * Calls the given asynchronous function with oTel tracing span instrumentation
 * @param fn function to be called
 * @param tracer tracer to be used
 * @param spanName name of the span to be created
 * @param spanOptions Options object needed for span creation with optional attributes: kind, attributes, links, startTime, root
 * @returns the result of the original function
 */
export const asyncCallWithSpan = async <T>(
  fn: (span?: Span) => Promise<T>,
  tracer: Tracer,
  spanName: string,
  spanOptions?: SpanOptions
): Promise<T> => {
  if (!tracingConfig.isEnabled) {
    return fn();
  }
  return new Promise((resolve, reject) => {
    return tracer.startActiveSpan(spanName, spanOptions ?? {}, (span) => {
      fn(span)
        .then((result) => {
          handleSpanOnSuccess(span);
          return resolve(result);
        })
        .catch((error) => {
          handleSpanOnError(span, error);
          return reject(error);
        });
    });
  });
};

/**
 * Calls the given function with oTel tracing span instrumentation
 * @param fn function to be called
 * @param tracer tracer to be used
 * @param spanName name of the span to be created
 * @param spanOptions Options object needed for span creation with optional attributes: kind, attributes, links, startTime, root
 * @returns the result of the original function
 */
export const callWithSpan = <T>(fn: (span?: Span) => T, tracer: Tracer, spanName: string, spanOptions?: SpanOptions): T => {
  if (!tracingConfig.isEnabled) {
    return fn();
  }
  return tracer.startActiveSpan(spanName, spanOptions ?? {}, (span) => {
    try {
      const result = fn(span);
      handleSpanOnSuccess(span);
      return result;
    } catch (error) {
      handleSpanOnError(span, error);
      throw error;
    }
  });
};

/**
 * Ends the given span with status OK
 * @param span span to be ended
 */
export const handleSpanOnSuccess = (span: Span | undefined): void => {
  if (!span) {
    return;
  }

  span.setStatus({ code: SpanStatusCode.OK });
  span.end();
};

/**
 * Ends the given span with status ERROR and records the error
 * @param span span to be ended
 * @param error error to be recorded
 */
export const handleSpanOnError = (span: Span | undefined, error?: unknown): void => {
  if (!span) {
    return;
  }

  span.setStatus({ code: SpanStatusCode.ERROR });

  if (error instanceof Error) {
    span.recordException(error);
  }

  span.end();
};
