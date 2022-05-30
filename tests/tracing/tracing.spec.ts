// import * as api from '@opentelemetry/api';
// import { Tracing } from '../../src';

// describe('tracing', function () {
//   let envBackup: NodeJS.ProcessEnv;
//   beforeAll(function () {
//     envBackup = { ...process.env };
//   });

//   afterAll(function () {
//     process.env = envBackup;
//   });

//   it('should be disabled by default, and return a noop tracer', async function () {
//     const tracing = new Tracing();

//     tracing.start();
//     const tracer = api.trace.getTracer('test');

//     expect(tracer).toBeInstanceOf(Tracing);

//     await expect(tracing.stop()).resolves.toBeUndefined();
//   });

//   it('should return a tracer if everything is configured', async function () {
//     process.env.TELEMETRY_TRACING_ENABLED = 'true';
//     process.env.TELEMETRY_TRACING_URL = 'http://localhost:55681/v1/trace';

//     const tracing = new Tracing();
//     tracing.start();

//     expect(tracer).toBeInstanceOf(Tracing);

//     await expect(tracing.stop()).resolves.toBeUndefined();
//   });
// });
