# Telemetry
## Motive
This package goal is to make the experience of configuring and working with OpenTelemetry easier.

## [Manual for easy local grafana deployment](./docs/localManual.md)
## example
Below are short examples for tracing and metrics. More examples are available at the [examples folder](examples/), and the various opentelemetry repos.
### Tracing
The following code shows a simple example of how to work with tracing. please notice that you need to manually install any auto-instrumentation library that you require.

```typescript
import { Tracing } from '@map-colonies/telemetry';
import { trace } from '@opentelemetry/api';

const tracing = new Tracing();

tracing.start();

const tracer = trace.getTracer('tracing-name')

const span = tracer.startSpan('some-action');

span.setAttribute('some-attribute');

// DO STUFF

span.end();

tracing.stop().then(() => console.log('done'));
```

Another way for initialize tracing with custom resource:

```typescript
import { Tracing } from '@map-colonies/telemetry';
import { Resource } from '@opentelemetry/resources';

const resource = new Resource({ 'service.version': number, 'service.name': 'my-service-name' });

const tracing = new Tracing([], resource);
...
```

### Metrics
The following code shows a simple example of how to work with metrics.

```typescript
import { Metrics } from '@map-colonies/telemetry';

const metrics = new Metrics('sample-meter');

const meter = metrics.start();

const counter = meter.createCounter('sample_counter');

counter.add(1);

metrics.stop().then(() => console.log('done'));
```

## Metrics middleware
The package provides a middleware for express that will automatically measure the duration of each request and the number of requests.
In addition the middleware can be configured to collect NodeJS metrics.

```typescript
import { collectMetricsExpressMiddleware } from '@map-colonies/telemetry/prom-metrics';
import express from 'express';
import { Registry } from 'prom-client';

const prom = collectMetricsExpressMiddleware({ registry: new Registry(), labels: { meow: 'a' } });

app.use('/metrics', prom);
app.get('/', (req, res) => {
  res.json({ x: 'd' });
});

app.listen(8080, () => console.log('server listening on 8080'));
```

> [!NOTE]
> If you are not running the `express-openapi-validator` middleware, its recommended to turn off the `includeOperationId` option in the `collectMetricsExpressMiddleware` function as the operation label will always be null.



## Semantic Conventions
#### The package's Semantic Conventions submodule defines a common set of (semantic) attributes which provide meaning to data when collecting, producing and consuming it.
Based on the [official OpenTelemetry conventions](https://opentelemetry.io/docs/specs/semconv/)

[Link to full documentation](src/semanticConventions/README.md)

## Configuration
### Common configuration
| name |allowed value| default value | description
|---|---|---|---|
|TELEMETRY_SERVICE_NAME|string|from package.json| The service name
|TELEMETRY_SERVICE_VERSION|string| from package.json| The service version
|TELEMETRY_HOST_NAME|string|`os.hostname()`|The host name
<br/>

### Tracing configuration
| name |allowed value| default value | description 
|---|---|---|---|
|TELEMETRY_TRACING_ENABLED|'true', 'false'|'false'|Should Tracing be enabled
|TELEMETRY_TRACING_URL<span style="color:red">*</span>|string|http://localhost:4318/v1/traces|The URL to the OpenTelemetry Collector
|TELEMETRY_TRACING_RATIO|float|1|The amount of traces to sample 

<span style="color:red">*</span> required (only when tracing is enabled).
<br/>
### Metric configuration
| name |allowed value| default value | description
|---|---|---|---|
|TELEMETRY_METRICS_ENABLED|'true', 'false'|'false'|Should Metrics be enabled| 
|TELEMETRY_METRICS_URL<span style="color:red">*</span>|string|http://localhost:4318/v1/metrics|The URL to the OpenTelemetry Collector
|TELEMETRY_METRICS_INTERVAL|number|15000|The interval in miliseconds between sending data to the collector

<span style="color:red">*</span> required (only when tracing is enabled).

### How to release
Run the command `npm run release --` to bump the version in all the files and create a changelog.

For more detailed documentation and examples check: https://github.com/conventional-changelog/standard-version

