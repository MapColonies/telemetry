import { hostname as osHostname } from 'os';
import { Registry, collectDefaultMetrics, Gauge, register } from 'prom-client';
import * as promBundle from 'express-prom-bundle';
import * as express from 'express';
import { loadPackageInfo } from '../../common/packageInfoLoader';
import { deconstructSemver } from '../../common/util';

interface Opts {
  registry: Registry;
  collectNodeMetrics: boolean;
  collectServiceVersion: boolean;
  prefix: string;
  labels: Record<string, string>;
}

export function metricsMiddleware(
  registry: Registry,
  shouldCollectDefaultMetrics = true,
  defaultMetricsPrefix?: string,
  defaultMetricsLabels?: Record<string, string>
): express.RequestHandler {
  if (shouldCollectDefaultMetrics) {
    collectDefaultMetrics({ prefix: defaultMetricsPrefix, register: registry, labels: defaultMetricsLabels });
  }
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    registry
      .metrics()
      .then((metrics) => {
        res.set('Content-Type', registry.contentType);
        res.end(metrics);
      })
      .catch((error) => {
        next(error);
      });
  };
}

/**
 * @deprecated since version v5.1, please use collectMetricsExpressMiddleware
 */
export function defaultMetricsMiddleware(prefix?: string, labels?: Record<string, string>): express.RequestHandler {
  const register = new Registry();
  collectDefaultMetrics({ prefix, register, labels });
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    register
      .metrics()
      .then((metrics) => {
        res.set('Content-Type', register.contentType);
        res.end(metrics);
      })
      .catch((error) => {
        next(error);
      });
  };
}

export function collectMetricsExpressMiddleware(options: Partial<Opts>): promBundle.Middleware {
  const pacakgeInfo = loadPackageInfo();
  const defaultOpts = {
    prefix: '',
    labels: {},
    collectNodeMetrics: true,
    collectServiceVersion: true,
    registry: new Registry(),
  } satisfies Opts;
  const mergedOptions = { ...defaultOpts, ...options };
  /* eslint-disable @typescript-eslint/naming-convention */
  const mergedLabels = {
    hostname: osHostname(),
    service_name: pacakgeInfo.name,
    ...(options.labels ? options.labels : {}),
  };
  register.setDefaultLabels(mergedLabels);
  if (mergedOptions.collectNodeMetrics) {
    collectDefaultMetrics({ prefix: mergedOptions.prefix, labels: mergedLabels, register: mergedOptions.registry });
  }

  if (mergedOptions.collectServiceVersion) {
    const gaugeLabels = [
      ...Object.keys(mergedLabels),
      'service_version_major',
      'service_version_minor',
      'service_version_patch',
      'service_version_prerelease',
    ];
    const semver = deconstructSemver(pacakgeInfo.version);
    if (!semver) {
      throw new Error('package.json includes version not according to semver spec');
    }
    const { major, minor, patch, prerelease } = semver;
    const serviceVersionGauge = new Gauge({
      name: `${mergedOptions.prefix ? `${mergedOptions.prefix}_` : ''}service_version`,
      help: 'Service Version Specified in package.json file',
      labelNames: gaugeLabels,
      registers: [mergedOptions.registry],
    });
    /* eslint-disable @typescript-eslint/naming-convention */
    serviceVersionGauge.set(
      {
        ...mergedLabels,
        service_version_major: major,
        service_version_minor: minor,
        service_version_patch: patch,
        service_version_prerelease: prerelease,
      },
      1
    );
  }

  const promBundleConfig: promBundle.Opts = {
    promRegistry: mergedOptions.registry,
    autoregister: true,
    includeUp: true,
    customLabels: mergedLabels,
    includeMethod: true,
    includeStatusCode: true,
    includePath: true,
  };
  return promBundle(promBundleConfig);
}
