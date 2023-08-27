const { collectMetricsExpressMiddleware } = require('@map-colonies/telemetry');
const promClient = require('prom-client');

const express = require('express');
const app = express();

const Registry = promClient.Registry;
const register = new Registry();

const prom = collectMetricsExpressMiddleware({ collectNodeMetrics: true, collectServiceVersion: true, register, labels: { meow: 'a' } });

app.use(prom);
app.get('/', (req, res) => {
  res.json({ x: 'd' });
});

app.listen(8080, () => console.log('server listening on 8080'));
