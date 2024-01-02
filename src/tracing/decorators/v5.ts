import { Tracer } from '@opentelemetry/api';
import { asyncCallWithSpan, callWithSpan } from '../utils/tracing';

/**
 * Decorator that creates a trace span for the decorated method logic.
 * using the typescript decorators stage 3, which available in typescript v5 and above.
 * requires the "experimentalDecorators" compiler option to be false.
 * @param target the method to decorate
 * @param context the class method decorator context
 * @returns the decorated method
 */
export function withSpan<This extends { tracer: Tracer }, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  return function (this: This, ...args: Args): Return {
    return callWithSpan(() => target.call(this, ...args), this.tracer, String(context.name));
  };
}

/**
 * Decorator that creates a trace span for the decorated async method logic.
 * using the typescript decorators stage 3, which available in typescript v5 and above.
 * requires the "experimentalDecorators" compiler option to be false.
 * @param target the async method to decorate
 * @param context the class method decorator context
 * @returns the decorated async method
 */
export function withSpanAsync<This extends { tracer: Tracer }, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Promise<Return>,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>
) {
  return async function (this: This, ...args: Args): Promise<Return> {
    return asyncCallWithSpan(async () => target.call(this, ...args), this.tracer, String(context.name));
  };
}
