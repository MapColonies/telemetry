import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { getNodeAutoInstrumentations, InstrumentationConfigMap } from '@opentelemetry/auto-instrumentations-node';
import { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { InstrumentationOption, registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import * as api from '@opentelemetry/api';
import { Prettify } from '../common/types';
import { TelemetryBase } from '../common/interfaces';
import { getTracingConfig, TracingConfig } from './config';

/**
 * The options to configure the tracing functionality.
 */
export type TracingOptions = Prettify<
  Partial<TracingConfig> & {
    /**
     * Optional array of instrumentations.
     */
    instrumentations?: InstrumentationOption[];
    /**
     * Optional map of auto-instrumentation configurations.
     */
    autoInstrumentationsConfigMap?: InstrumentationConfigMap;
    /**
     * Optional attributes to be added to the resource.
     */
    attributes?: api.Attributes;
    /**
     * Optional flag to enable debug mode.
     */
    debug?: boolean;
  }
>;

/**
 * Represents a Tracing instance that provides telemetry functionality.
 */
export class Tracing implements TelemetryBase<void> {
  private provider?: NodeTracerProvider;
  private readonly config: TracingConfig;
  private readonly instrumentations?: InstrumentationOption[];
  private readonly autoInstrumentationsConfigMap?: InstrumentationConfigMap;
  private readonly attributes?: api.Attributes;

  /**
   * Creates a new instance of the Tracing class.
   * @param options - The options to configure the tracing functionality.
   */
  public constructor(options: TracingOptions = {}) {
    const { instrumentations, autoInstrumentationsConfigMap, attributes, ...config } = options;
    this.config = getTracingConfig(config);
    this.instrumentations = options.instrumentations;
    this.autoInstrumentationsConfigMap = autoInstrumentationsConfigMap;
    this.attributes = attributes;
  }

  /**
   * Starts the tracing functionality.
   */
  public start(): void {
    if (!this.config.isEnabled) {
      return;
    }
    const { version, serviceName, traceRatio, ...exporterConfig } = this.config;
    this.provider = new NodeTracerProvider({
      sampler: new ParentBasedSampler({
        root: new TraceIdRatioBasedSampler(traceRatio),
      }),
      resource: new Resource({
        ...{
          [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
          [SemanticResourceAttributes.SERVICE_VERSION]: version,
        },
        ...this.attributes,
      }),
    });

    const exporter = new OTLPTraceExporter(exporterConfig);

    this.provider.addSpanProcessor(new BatchSpanProcessor(exporter));

    if (this.config.debug) {
      api.diag.setLogger(new api.DiagConsoleLogger(), api.DiagLogLevel.ALL);
      this.provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    }

    this.provider.register();

    registerInstrumentations({
      instrumentations: [
        ...(getNodeAutoInstrumentations({
          ...this.autoInstrumentationsConfigMap,
          ['@opentelemetry/instrumentation-pino']: { enabled: false },
        }) as InstrumentationOption[]),
        ...(this.instrumentations ?? []),
      ],
    });
  }

  /**
   * Stops the tracing functionality.
   * @returns A promise that resolves when the tracing is stopped.
   */
  public async stop(): Promise<void> {
    await this.provider?.shutdown();
  }
}
