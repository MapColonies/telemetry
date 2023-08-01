import { hostname as osHostname } from 'os';
import { Registry, collectDefaultMetrics, Gauge, register } from 'prom-client';
import * as promBundle from 'express-prom-bundle';
import * as express from 'express';
import { loadPackageInfo } from '../../common/packageInfoLoader';

const deconstructSemver = (semverString: string): { major: string; minor: string; patch: string; prerelease: string; build: string } | null => {
  const match = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([\w-]+))?(?:\+([\w-]+))?/i.exec(semverString);
  if (!match) {
    return null;
  }
  return {
    major: match[1],
    minor: match[2],
    patch: match[3],
    prerelease: match[4],
    build: match[5],
  };
};

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

interface Opts {
  registry: Registry;
  collectNodeMetrics: boolean;
  collectServiceVersion: boolean;
  prefix: string;
  labels: Record<string, string>;
}

export function collectMetricsExpressMiddleware(options: Partial<Opts>): promBundle.Middleware {
  const pacakgeInfo = loadPackageInfo();
  const defaultOpts: Opts = {
    prefix: '',
    labels: {},
    collectNodeMetrics: true,
    collectServiceVersion: true,
    registry: new Registry(),
  };
  const meregedOptions = { ...defaultOpts, ...options };

  const mergedLabels = {
    hostname: osHostname(),
    service_name: pacakgeInfo.name,
    ...(options.labels ? options.labels : {}),
  };
  register.setDefaultLabels(mergedLabels);
  if (meregedOptions.collectNodeMetrics) {
    collectDefaultMetrics({ prefix: meregedOptions.prefix, labels: mergedLabels, register: meregedOptions.registry });
  }

  if (meregedOptions.collectServiceVersion) {
    const gaugeLabels = ['service_version_major', 'service_version_minor', 'service_version_patch', 'service_version_prerelease'];
    const semver = deconstructSemver(pacakgeInfo.version);
    if (!semver) {
      throw new Error('package.json includes version not according to semver spec');
    }
    const { major, minor, patch, prerelease } = semver;
    const serviceVersionGauge = new Gauge({
      name: `${meregedOptions.prefix ? `${meregedOptions.prefix}_` : ''}service_version`,
      help: 'Service Version Specified in package.json file',
      labelNames: gaugeLabels,
      registers: [meregedOptions.registry],
    });
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

  let promBundleConfig: promBundle.Opts = {
    promRegistry: meregedOptions.registry,
    autoregister: true,
    includeUp: true,
    customLabels: mergedLabels,
    includeMethod: true,
    includeStatusCode: true,
    includePath: true,
  };
  return promBundle(promBundleConfig);
}
