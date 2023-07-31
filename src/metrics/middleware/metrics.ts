import os from 'os';
import client, { Registry, collectDefaultMetrics } from 'prom-client';
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

/**
 * @deprecated since version v5.1, please use collectMetricsExpressMiddleware
 */
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

export function collectMetricsExpressMiddleware(
  register: Registry = new Registry(),
  collectExpressAppMetrics: boolean = true,
  collectNodeMetrics: boolean = true,
  collectServiceVersion: boolean = true,
  prefix?: string,
  labels?: Record<string, string>
): express.RequestHandler {
  const pacakgeInfo = loadPackageInfo();
  const mergedLabels = {
    hostname: os.hostname(),
    service_name: pacakgeInfo.name,
    ...labels,
  };
  if (collectNodeMetrics) {
    collectDefaultMetrics({ prefix, labels: mergedLabels, register });
  }
  if (collectServiceVersion) {
    const gaugeLabels = ['hostname'];
    const versionArr = pacakgeInfo.version.split('.').map(parseInt);
    const serviceVersionGaugeMajor = new client.Gauge({
      name: 'service_version_major',
      help: 'Major semver version of service',
      labelNames: gaugeLabels,
    });
    const serviceVersionGaugeMinor = new client.Gauge({
      name: 'service_version_minor',
      help: 'Minor semver version of service',
      labelNames: gaugeLabels,
    });
    const serviceVersionGaugePatch = new client.Gauge({
      name: 'service_version_patch',
      help: 'Patch semver version of service',
      labelNames: gaugeLabels,
    });
    serviceVersionGaugeMajor.set({ hostname: mergedLabels.hostname }, versionArr[0]);
    serviceVersionGaugeMinor.set({ hostname: mergedLabels.hostname }, versionArr[1]);
    serviceVersionGaugePatch.set({ hostname: mergedLabels.hostname }, versionArr[2]);
  }

  let promBundleConfig: promBundle.Opts = {
    includeUp: true,
    customLabels: mergedLabels,
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
