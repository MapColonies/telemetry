import * as env from 'env-var';
import { CommonConfig, getCommonConfig } from '../common/config';

const DEFAULT_URL = 'http://localhost:55681/v1/trace';

interface TracingEnabeldConfig extends CommonConfig {
  isEnabled: true;
  url?: string;
}
interface TracingDisabledConfig {
  isEnabled: false;
}

export type TracingConfig = TracingEnabeldConfig | TracingDisabledConfig;

export const getTracingConfig = (): TracingConfig => {
  const isEnabled = env.get('TELEMETRY_TRACING_ENABLED').default('false').asBool();

  if (!isEnabled) {
    return { isEnabled: false };
  }

  const commonConfig = getCommonConfig();

  return {
    isEnabled: true,
    url: env.get('TELEMETRY_TRACING_URL').asUrlString() ?? DEFAULT_URL,
    ...commonConfig,
  };
};
