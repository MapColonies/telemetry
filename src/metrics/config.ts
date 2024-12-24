import { JSONSchemaType } from 'ajv';
import { CommonConfig, getCommonConfig, mergeAndValidateConfig } from '../common/config';

const DEFAULT_URL = 'http://localhost:4318/v1/metrics';
const DEFAULT_SEND_INTERVAL = 15000;

/**
 * Represents the configuration options for metrics.
 */
interface BaseMetricsConfig {
  /**
   * Specifies whether metrics is enabled.
   */
  isEnabled: boolean;
  /**
   * The URL to an HTTP OTLP endpoint to send the metrics to.
   */
  url: string;
  /**
   * The interval in milliseconds to send the metrics.
   */
  sendInterval: number;
  /**
   * Specifies whether to enable debug mode for metrics.
   * Debug mode will enable the opentelemetry debug log and log metrics to the console.
   */
  debug: boolean;
}

type MetricsConfig = BaseMetricsConfig & CommonConfig;

const metricsConfigSchema: JSONSchemaType<BaseMetricsConfig> = {
  type: 'object',
  properties: {
    isEnabled: { type: 'boolean', default: false },
    url: { type: 'string', default: DEFAULT_URL, format: 'uri', pattern: '^http://|^https://' },
    sendInterval: { type: 'number', default: DEFAULT_SEND_INTERVAL, minimum: 0 },
    debug: { type: 'boolean', default: false },
  },
  required: ['isEnabled'],
};

const metricsConfigEnv: Partial<Record<keyof BaseMetricsConfig, string>> = {
  isEnabled: process.env.TELEMETRY_METRICS_ENABLED,
  url: process.env.TELEMETRY_METRICS_URL,
  sendInterval: process.env.TELEMETRY_METRICS_INTERVAL,
};

/**
 * Retrieves the metrics configuration.
 * @returns The metrics configuration object.
 */
function getMetricsConfig(options: Partial<BaseMetricsConfig> & Partial<CommonConfig> = {}): MetricsConfig {
  const { sendInterval, isEnabled, url, debug, ...commonConfigInput } = options;
  const commonConfig = getCommonConfig(commonConfigInput);

  const metricsConfig = mergeAndValidateConfig<BaseMetricsConfig>({ sendInterval, isEnabled, url, debug }, metricsConfigEnv, metricsConfigSchema);

  return {
    ...commonConfig,
    ...metricsConfig,
  };
}

export { type MetricsConfig, getMetricsConfig };
