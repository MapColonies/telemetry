import { hostname as osHostname } from 'os';
import { Registry, collectDefaultMetrics, Gauge, register } from 'prom-client';
import promBundle from 'express-prom-bundle';
import * as express from 'express';
import { loadPackageInfo } from '../../common/packageInfoLoader';
import { deconstructSemver } from '../../common/util';

/**
 * Options for configuring metrics middleware.
 */
interface Opts {
  /**
   * The Prometheus registry to use for the metrics.
   */
  registry: Registry;
  /**
   * Whether to collect node metrics.
   */
  collectNodeMetrics: boolean;
  /**
   * Whether to collect service version metrics.
   */
  collectServiceVersion: boolean;
  /**
   * The prefix for the metrics.
   * e.g. 'my_prefix_my_metric'
   */
  prefix: string;
  /**
   * The labels to attach to the metrics.
   */
  labels: Record<string, string>;
  /**
   * Function to transform labels with request and response objects.
   */
  transformLabels?: promBundle.Opts['transformLabels'];
  /**
   * Function to normalize the path to fix path params masking.
   * See {@link https://github.com/jochen-schweizer/express-prom-bundle?tab=readme-ov-file#more-details-on-includepath-option} for more details.
   */
  normalizePath?: promBundle.Opts['normalizePath'];
}

/**
 * Express middleware that returns the metrics collected by the registry.
 *
 * @param registry - The metrics registry.
 * @param shouldCollectDefaultMetrics - Indicates whether to collect default metrics. Default is `true`.
 * @param defaultMetricsPrefix - The prefix to be added to default metrics.
 * @param defaultMetricsLabels - The labels to be added to default metrics.
 * @returns The Express request handler function.
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

/**
 * Collects metrics for Express middleware.
 *
 * @param options - Optional configuration options for the middleware.
 * @returns The Express middleware function that collects metrics.
 */
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
    transformLabels: mergedOptions.transformLabels,
    normalizePath: mergedOptions.normalizePath,
  };
  return promBundle(promBundleConfig);
}
