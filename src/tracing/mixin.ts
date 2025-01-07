import { trace, context, isSpanContextValid } from '@opentelemetry/api';

const HEXADECIMAL_BASE = 16;

/**
 * Returns a function that creates an OpenTelemetry mixin object for pino logger.
 * The function lets you add trace information to the log record object.
 * The mixin object contains trace information such as trace ID, span ID, and trace flags.
 * @returns A function that takes in a mergeObject and level, and returns an object with trace information.
 * @group Tracing Utilities
 */
/* eslint-disable @typescript-eslint/ban-types */
export function getOtelMixin(): (mergeObject: object, level: number) => object {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function otelMixin(_context: object, level: number): object {
    /* eslint-enable  @typescript-eslint/ban-types */
    const span = trace.getSpan(context.active());

    if (!span) {
      return {};
    }

    const spanContext = span.spanContext();

    if (!isSpanContextValid(spanContext)) {
      return {};
    }

    const record = {
      /* eslint-disable @typescript-eslint/naming-convention */
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
      trace_flags: `0${spanContext.traceFlags.toString(HEXADECIMAL_BASE)}`,
      /* eslint-enable @typescript-eslint/naming-convention */
    };

    return record;
  };
}
