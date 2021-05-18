import { context, getSpanContext } from '@opentelemetry/api';
import * as express from 'express';
import { Application, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';
import { Tracing } from '../../src';
import { getTraceContexHeaderMiddleware } from '../../src/common/middleware/traceOnHeaderMiddleware';

// eslint-disable-next-line jest/no-focused-tests
describe.only('#traceOnHeaderMiddleware', function () {
  let expressApp: Application;
  let resFn: jest.Mock;

  beforeAll(function () {
    resFn = jest.fn();
    expressApp = express();
    expressApp.use(getTraceContexHeaderMiddleware());
    expressApp.use('/avi', resFn);
  });

  describe('Response with traceparent header', function () {
    it('for 200 requests return the traceparant header', async function () {
      process.env.TELEMETRY_TRACING_ENABLED = 'true';
      process.env.TELEMETRY_TRACING_URL = 'http://localhost:55681/v1/trace';

      const tracing = new Tracing('test');
      const tracer = tracing.start();

      resFn.mockImplementationOnce((req: Request, res: Response) => {
        res.sendStatus(StatusCodes.OK);
      });

      const superTestAgent = supertest.agent(expressApp);
      const response = await superTestAgent.get('/avi');
      expect(response).toHaveProperty('body.message', 'meow');
      expect(response.status).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
    });
  });
});
