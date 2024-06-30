import * as env from 'env-var';
import { CommonConfig, getCommonConfig } from '../common/config';

const DEFAULT_URL = 'http://localhost:4318/v1/traces';

interface TracingConfigInput extends Partial<CommonConfig> {
  isEnabled?: boolean;
  url?: string;
  traceRatio?: number;
}

export type TracingConfig =
  | {
      isEnabled: false;
    }
  | ({ isEnabled: true; url: string; traceRatio: number } & CommonConfig);

/**
 * Retrieves the tracing configuration.
 * @returns The tracing configuration object.
 */
export function getTracingConfig(options: TracingConfigInput): TracingConfig {
  const commonConfig = getCommonConfig();

  const isEnabled = env.get('TELEMETRY_TRACING_ENABLED').default('false').asBool();

  if (!isEnabled) {
    return { isEnabled: false, ...commonConfig };
  }

  const traceRatio = env.get('TELEMETRY_TRACING_RATIO').default(1).asFloat();

  if (traceRatio < 0 && traceRatio > 1) {
    throw new Error('trace ratio should be between 0 and 1');
  }

  return {
    ...commonConfig,
    url: env.get('TELEMETRY_TRACING_URL').asUrlString() ?? DEFAULT_URL,
    isEnabled: true,
    traceRatio,
  };
}
