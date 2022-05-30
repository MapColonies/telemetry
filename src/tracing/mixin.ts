/* eslint-disable */
import { trace, context, isSpanContextValid } from '@opentelemetry/api';

export function getOtelMixin() {
  return function otelMixin(_context: object, level: number) {
    const span = trace.getSpan(context.active());

    if (!span) {
      return {};
    }

    const spanContext = span.spanContext();

    if (!isSpanContextValid(spanContext)) {
      return {};
    }

    const record = {
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
      trace_flags: `0${spanContext.traceFlags.toString(16)}`,
    };

    return record;
  };
}
