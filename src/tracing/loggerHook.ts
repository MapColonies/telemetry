import * as api from '@opentelemetry/api';
import { pino } from 'pino';

// ignored because its the same type needed for LogFn
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LogFnArgs = [obj: object, msg?: string, ...args: any[]] | [msg: string, ...args: any[]];

/**
 * @deprecated use mixin instead
 * @group Tracing Utilities
 */
// disabled because this function signature is required by pino
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logMethod(this: pino.Logger, args: LogFnArgs, method: pino.LogFn, level: number): void {
  const span = api.trace.getSpan(api.context.active());

  if (!span) {
    method.apply<pino.Logger, LogFnArgs, void>(this, args);
    return;
  }
  const traceObj = { spanId: span.spanContext().spanId, traceId: span.spanContext().traceId };

  let logFnArgs: LogFnArgs;
  const [firstArg, ...rest] = args;
  if (typeof firstArg === 'object') {
    logFnArgs = [{ ...firstArg, ...traceObj }, ...rest];
  } else {
    logFnArgs = [traceObj, firstArg, ...rest];
  }

  method.apply<pino.Logger, LogFnArgs, void>(this, logFnArgs);
}
