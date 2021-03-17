import { NodeTracerProvider } from '@opentelemetry/node';
import { CollectorTraceExporter, CollectorMetricExporter } from '@opentelemetry/exporter-collector';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { InstrumentationOption, registerInstrumentations,  } from '@opentelemetry/instrumentation';
import {Meter, MeterProvider, ConsoleMetricExporter} from '@opentelemetry/metrics'
import { NoopTracerProvider, Tracer, } from '@opentelemetry/api';
import { TelemetryBase } from '../common/interfaces';

export class Metrics implements TelemetryBase<Meter> {
  private provider?: MeterProvider;
  public constructor(private readonly meterName:string) {
  }

  public start(): Meter {

    // if (!isEnabled) {
    //   const provider = new NoopTracerProvider();
    //   return provider.getTracer(this.tracerName);
    // }

    const exporter = new CollectorMetricExporter({serviceName:'aaaaa-bbbb'});

    this.provider = new MeterProvider({exporter, interval: 6000})
    return this.provider.getMeter(this.meterName);
  }

  public async stop(): Promise<void> {
    await this.provider?.shutdown();
  }
}
