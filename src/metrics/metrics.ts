import * as api from '@opentelemetry/api';
import { metrics } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { ConsoleMetricExporter, MeterProvider, MetricReader, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { ATTR_HOST_NAME } from '@opentelemetry/semantic-conventions/incubating';
import { TelemetryBase } from '../common/interfaces';
import { Prettify } from '../common/types';
import { getMetricsConfig, MetricsConfig } from './config';

export type MetricsOptions = Prettify<
  Partial<MetricsConfig> & {
    /**
     * Optional attributes to be associated with the metrics.
     */
    attributes?: api.Attributes;
    /**
     * Optional flag to enable debug mode.
     */
    debug?: boolean;
  }
>;

/**
 * Represents a metrics class that provides telemetry functionality.
 */
export class Metrics implements TelemetryBase<void> {
  private provider?: MeterProvider;
  private readonly config: MetricsConfig;
  private readonly attributes?: api.Attributes;

  /**
   * Creates an instance of the Metrics class.
   * @param attributes - The attributes to be associated with the metrics.
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

    const metricReader: MetricReader[] = [new PeriodicExportingMetricReader({ exporter, exportIntervalMillis: sendInterval })];

    if (this.config.debug) {
      api.diag.setLogger(new api.DiagConsoleLogger(), api.DiagLogLevel.ALL);
      metricReader.push(new PeriodicExportingMetricReader({ exporter: new ConsoleMetricExporter(), exportIntervalMillis: sendInterval }));
    }

    this.provider = new MeterProvider({
      resource: new Resource({
        ...{
          [ATTR_SERVICE_NAME]: serviceName,
          [ATTR_SERVICE_VERSION]: serviceVersion,
          [ATTR_HOST_NAME]: hostname,
        },
        ...this.attributes,
      }),
      readers: metricReader,
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
