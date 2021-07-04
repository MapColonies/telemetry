import { NodeTracerProvider } from '@opentelemetry/node';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { InstrumentationOption, registerInstrumentations } from '@opentelemetry/instrumentation';
import { TelemetryBase } from '../common/interfaces';
import { getTracingConfig, TracingConfig } from './config';

export class Tracing implements TelemetryBase<void> {
  private provider?: NodeTracerProvider;
  private readonly config: TracingConfig;
  public constructor(private readonly insturmentations?: InstrumentationOption[], private readonly resource?: Resource) {
    this.config = getTracingConfig();
  }

  public start(): void {
    const { version, isEnabled, serviceName, ...exporterConfig } = this.config;

    if (!isEnabled) {
      return;
    }

    let actualResource = new Resource({ 'service.version': version, 'service.name': serviceName });

    if (this.resource) {
      actualResource = actualResource.merge(this.resource);
    }

    this.provider = new NodeTracerProvider({ resource: actualResource });

    registerInstrumentations({ tracerProvider: this.provider, instrumentations: this.insturmentations });

    const exporter = new CollectorTraceExporter({
      ...exporterConfig,
    });

    // consider batch processor
    this.provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    this.provider.register();
  }

  public async stop(): Promise<void> {
    await this.provider?.shutdown();
  }
}
