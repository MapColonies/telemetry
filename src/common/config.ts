import { hostname } from 'os';
import * as env from 'env-var';
import { loadPackageInfo } from '../common/packageInfoLoader';

interface CommonConfig {
  serviceName: string;
  hostname: string;
  version: string;
}

let commonConfig: CommonConfig | undefined;

function getCommonConfig(): CommonConfig {
  if (!commonConfig) {
    throw new Error('Common configuration has not been set');
  }

  const packageConfig = loadPackageInfo();
  commonConfig = {
    serviceName: env.get('TELEMETRY_SERVICE_NAME').asString() ?? packageConfig.name,
    hostname: env.get('TELEMETRY_HOST_NAME').asString() ?? hostname(),
    version: env.get('TELEMETRY_SERVICE_VERSION').asString() ?? packageConfig.version,
  };

  return commonConfig;
}

export { CommonConfig, getCommonConfig };
