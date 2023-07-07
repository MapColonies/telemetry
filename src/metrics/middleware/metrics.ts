import { Registry, collectDefaultMetrics } from 'prom-client';
import * as express from 'express';

export function metricsMiddleware(
  registry: Registry,
  shouldCollectDefaultMetrics = true,
  defaultMetricsPrefix?: string,
  defaultMetricsLabels?: Record<string, string>
): express.RequestHandler {
  if (shouldCollectDefaultMetrics) {
    collectDefaultMetrics({ prefix: defaultMetricsPrefix, register: registry, labels: defaultMetricsLabels });
  }
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      res.set('Content-Type', registry.contentType);
      res.end(await registry.metrics());
    } catch (error) {
      return next(error);
    }
  };
}
