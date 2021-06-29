import { context, getSpanContext, TraceFlags } from '@opentelemetry/api';
import { Handler } from 'express';

const VERSION = '00';
const RADIX = 16;

export const getTraceContexHeaderMiddleware: () => Handler = () => {
  const traceContexHeaderMiddleware: Handler = (req, res, next): void => {
    const spanContext = getSpanContext(context.active());

    if (spanContext) {
      const traceParent = `${VERSION}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || TraceFlags.NONE).toString(
        RADIX
      )}`;
      res.setHeader('traceparent', traceParent);
    }
    next();
  };

  return traceContexHeaderMiddleware;
};
