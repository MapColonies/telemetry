import { getSpan, context } from '@opentelemetry/api';
import { LogFn, Logger } from 'pino';

// ignored because its the same type needed for LogFn
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type Args = [obj: object, msg?: string, ...args: any[]] | [msg: string, ...args: any[]];

export function logMethod(this: Logger, args: Args, method: LogFn, level: number): void {
  const span = getSpan(context.active());

  if (!span) {
    method.apply<Logger, Args, void>(this, args);
    return;
  }
  const traceObj = { spanId: span.context().spanId, traceId: span.context().traceId };

  if (typeof args[0] === 'object') {
    const [obj, ...rest] = args;
    method.apply<Logger, Args, void>(this, [{ ...obj, ...traceObj }, ...rest]);
  } else {
    const [msg, ...rest] = args;
    method.apply<Logger, Args, void>(this, [traceObj, msg, ...rest]);
  }
}
