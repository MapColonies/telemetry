import * as api from '@opentelemetry/api';
import { metrics } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import {} from '@opentelemetry/sdk-metrics';
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader, MetricReader } from '@opentelemetry/sdk-metrics';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION, SEMRESATTRS_HOST_NAME } from '@opentelemetry/semantic-conventions';
import { TelemetryBase } from '../common/interfaces';
import { MetricsConfig, getMetricsConfig } from './config';

/**
 * Configuration options for metrics collection.
 * Extends the base metrics configuration with optional parameters.
 *
 * @interface MetricsOptions
 * @group Metrics
 */
export interface MetricsOptions extends Partial<MetricsConfig> {
  /**
   * Optional attributes to be associated with the metrics.
   */
  attributes?: api.Attributes;
}

/**
 * Represents a metrics class that provides telemetry functionality.
 * @group Metrics
 */
export class Metrics implements TelemetryBase<void> {
  private provider?: MeterProvider;
  private readonly config: MetricsConfig;
  private readonly attributes?: api.Attributes;

  /**
   * Creates a new instance of the metrics class.
   * @param options - Configuration options for metrics
   */
  public constructor(options: MetricsOptions = {}) {
    const { attributes, ...config } = options;
    this.config = getMetricsConfig(config);
    this.attributes = attributes;
  }

  /**
   * Starts the metrics collection and exporting process.
   */
  public start(): void {
    if (!this.config.isEnabled) {
      return;
    }
    const { serviceVersion, sendInterval, url, serviceName, hostname } = this.config;

    const exporter = new OTLPMetricExporter({ url });
    let readers = [new PeriodicExportingMetricReader({ exporter, exportIntervalMillis: sendInterval })];

    if (this.config.debug) {
      api.diag.setLogger(new api.DiagConsoleLogger(), api.DiagLogLevel.ALL);
      readers = [new PeriodicExportingMetricReader({ exporter: new ConsoleMetricExporter(), exportIntervalMillis: sendInterval })];
    }

    this.provider = new MeterProvider({
      readers,
      resource: new Resource({
        ...{
          [ATTR_SERVICE_NAME]: serviceName,
          [ATTR_SERVICE_VERSION]: serviceVersion,
          [SEMRESATTRS_HOST_NAME]: hostname,
        },
        ...this.attributes,
      }),
    });

    metrics.setGlobalMeterProvider(this.provider);
  }

  /**
   * Stops the metrics collection and exporting process.
   * @returns A promise that resolves when the metrics provider is successfully shutdown.
   */
  public async stop(): Promise<void> {
    await this.provider?.shutdown();
  }
}
