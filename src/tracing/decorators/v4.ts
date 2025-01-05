/* eslint-disable @typescript-eslint/no-explicit-any , @typescript-eslint/no-unsafe-return */

import { Tracer } from '@opentelemetry/api';
import { asyncCallWithSpan, callWithSpan } from '../utils/tracing';

/**
 * Decorator that creates a trace span for the decorated method logic.
 * using the typescript decorators stage 2.
 * requires the "experimentalDecorators" compiler option to be true.
 * @param _target the class prototype
 * @param propertyKey the name of the decorated method
 * @param descriptor the method descriptor
 * @returns the decorated descriptor
 * @group Tracing Decorators
 */
export function withSpanV4<This extends { tracer: Tracer }, Args extends unknown[]>(
  _target: This,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(this: This, ...args: Args) => any>
): TypedPropertyDescriptor<(this: This, ...args: Args) => any> {
  const originalMethod = descriptor.value;

  if (originalMethod === undefined) {
    throw new Error('Decorated method is undefined');
  }

  descriptor.value = function (this: This, ...args: Args): any {
    return callWithSpan(() => originalMethod.call(this, ...args), this.tracer, String(propertyKey));
  };

  return descriptor;
}

/**
 * Decorator that creates a trace span for the decorated async method logic.
 * using the typescript decorators stage 2.
 * requires the "experimentalDecorators" compiler option to be true.
 * @param _target the class prototype
 * @param propertyKey the name of the decorated async method
 * @param descriptor the async method descriptor
 * @returns the decorated descriptor
 * @group Tracing Decorators
 */
export function withSpanAsyncV4<This extends { tracer: Tracer }, Args extends unknown[]>(
  _target: This,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(this: This, ...args: Args) => Promise<any>>
): TypedPropertyDescriptor<(this: This, ...args: Args) => Promise<any>> {
  const originalMethod = descriptor.value;

  if (originalMethod === undefined) {
    throw new Error('Decorated method is undefined');
  }

  descriptor.value = async function (this: This, ...args: Args): Promise<any> {
    return asyncCallWithSpan(async () => originalMethod.call(this, ...args), this.tracer, String(propertyKey));
  };

  return descriptor;
}
