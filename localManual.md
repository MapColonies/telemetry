# Local Grafana Deployment

## Motive

When adding metrics, tracing, and logs to our services, we aim to deploy the Grafana stack locally to facilitate easier development and testing. This manual provides the steps necessary to achieve that.

## Let's Get Started

You will run the Grafana stack using `docker-compose`. This manual includes some modifications to the original Grafana setup to enable comprehensive telemetry collection.

> **Note:**  
> Don't run the `docker-compose` command yet; we are making some changes first.

[Link to Grafana official manual on Tempo](https://grafana.com/docs/tempo/latest/getting-started/docker-example/)

### 1. Clone the Repository

As mentioned in the manual above, clone the repository to your local machine.

### 2. Remove Fake Clients to Reduce Noise

- Open the cloned repository and navigate to `tempo/example/docker-compose/local/docker-compose.yaml`.
- Remove the `k6-tracing` section to eliminate fake clients.

**Don't forget to save.**

### 3. Enable Prometheus Collector from Your Local App

- Open the cloned repository and navigate to `tempo/example/docker-compose/shared/prometheus.yaml`.
- Add the following job according to the service you are running locally:

    ```yaml
    - job_name: 'app'
      static_configs:
        - targets:
          - '172.17.0.1:8081'
    ```

    - Docker internal network IP that is static: `172.17.0.1`
    - The port your service is running on: `8081`

**Don't forget to save.**

These two simple steps enable the following:
1. Removal of fake clients from Tempo.
2. Configuration of Prometheus to collect metrics from your local app.

Now you can run `docker-compose` from `tempo/example/docker-compose/local` and access Grafana at [localhost:3000](http://localhost:3000).

Access Prometheus at [localhost:9090](http://localhost:9090), go to `Status -> Targets`, and you should see the job you created with the path provided in the endpoint.

# Happy observability adventure! 😊

