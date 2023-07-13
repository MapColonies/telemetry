import os from 'os';
import { Registry, collectDefaultMetrics } from 'prom-client';
import promBundle from 'express-prom-bundle';
import * as express from 'express';
import { loadPackageInfo } from '../../common/packageInfoLoader';

/**
 * @deprecated since version v5.1, please use collectMetricsExpressMiddleware
 */
export function defaultMetricsMiddleware(prefix?: string, labels?: Record<string, string>): express.RequestHandler {
  const register = new Registry();
  collectDefaultMetrics({ prefix, register, labels });
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      return next(error);
    }
  };
}

export function collectMetricsExpressMiddleware(
  collectExpressAppMetrics: boolean = true,
  collectNodeMetrics: boolean = true,
  prefix?: string,
  labels?: Record<string, string>
): express.RequestHandler {
  const register = new Registry();
  if (collectNodeMetrics) {
    collectDefaultMetrics({ prefix, labels, register });
  }
  const defaultLabels = {
    hostname: os.hostname(),
    service_name: loadPackageInfo().name,
  };
  let promBundleConfig: promBundle.Opts = {
    includeUp: true,
    customLabels: { labels, ...defaultLabels },
    promRegistry: register,
    includeMethod: false,
    includeStatusCode: false,
    includePath: false,
  };
  if (collectExpressAppMetrics) {
    promBundleConfig = {
      ...promBundleConfig,
      includeMethod: true,
      includeStatusCode: true,
      includePath: true,
    };
  }
  return promBundle(promBundleConfig);
}
