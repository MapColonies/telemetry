# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [10.0.1](https://github.com/MapColonies/telemetry/compare/v10.0.0...v10.0.1) (2025-03-20)


### Bug Fixes

* **tracing:** now when debug is enabled the otlp exporter still works ([#126](https://github.com/MapColonies/telemetry/issues/126)) ([3364927](https://github.com/MapColonies/telemetry/commit/33649276bf9fbdb81646fddc547279517851aa66))


### Dependency Updates

* bump @opentelemetry/auto-instrumentations-node ([#123](https://github.com/MapColonies/telemetry/issues/123)) ([650429c](https://github.com/MapColonies/telemetry/commit/650429c697704141e71814b31d6367a7ce962ea7))

## [10.0.0](https://github.com/MapColonies/telemetry/compare/v9.0.0...v10.0.0) (2025-03-13)


### ⚠ BREAKING CHANGES

* upgraded opentelemetry to new version ([#119](https://github.com/MapColonies/telemetry/issues/119))

### Features

* upgraded opentelemetry to new version ([#119](https://github.com/MapColonies/telemetry/issues/119)) ([93d8904](https://github.com/MapColonies/telemetry/commit/93d8904ba799641eb906d55b70431127ba619d09))

## [9.0.0](https://github.com/MapColonies/telemetry/compare/v8.0.0...v9.0.0) (2025-02-03)


### ⚠ BREAKING CHANGES

* added engine setting to package.json ([#81](https://github.com/MapColonies/telemetry/issues/81))

### Features

* moved to common tsconfig-package ([#83](https://github.com/MapColonies/telemetry/issues/83)) ([31e0df4](https://github.com/MapColonies/telemetry/commit/31e0df497d589a1453e9619c193f1c2a9215414a))


### Dependency Updates

* bump ajv from 8.16.0 to 8.17.1 ([#111](https://github.com/MapColonies/telemetry/issues/111)) ([3f02cd9](https://github.com/MapColonies/telemetry/commit/3f02cd971058065e5c0a7a7f370a7c4c5309bfa6))


### Build System

* added engine setting to package.json ([#81](https://github.com/MapColonies/telemetry/issues/81)) ([0a17899](https://github.com/MapColonies/telemetry/commit/0a17899ed655314953fd6b09aa30853ac829bf12))

## [8.0.0](https://github.com/MapColonies/telemetry/compare/v7.0.1...v8.0.0) (2024-10-27)


### ⚠ BREAKING CHANGES

* **metrics:** add operationId and remove path from metrics ([#78](https://github.com/MapColonies/telemetry/issues/78))

### Features

* **metrics:** add operationId and remove path from metrics ([#78](https://github.com/MapColonies/telemetry/issues/78)) ([99d9ab4](https://github.com/MapColonies/telemetry/commit/99d9ab466a67e24a476964a96da88493a80ce567))

## [7.0.1](https://github.com/MapColonies/telemetry/compare/v7.0.0...v7.0.1) (2024-09-08)


### Bug Fixes

* decorator return types ([#74](https://github.com/MapColonies/telemetry/issues/74)) ([8770968](https://github.com/MapColonies/telemetry/commit/877096895033904a9a27552104b7693705d5eb70))

## [7.0.0](https://github.com/MapColonies/telemetry/compare/v6.1.0...v7.0.0) (2024-07-30)


### ⚠ BREAKING CHANGES

* options change ([#69](https://github.com/MapColonies/telemetry/issues/69))

### Features

* add emoji ([22ab951](https://github.com/MapColonies/telemetry/commit/22ab951f65a58fbe6ce0bb0f38c311bfdf03c773))
* local manual for local grafana deployment ([51b0a5e](https://github.com/MapColonies/telemetry/commit/51b0a5ee0d054aeab3b5561d3b5056e907c7ef87))


### Bug Fixes

* moved manual to docs folder ([5b7a6fe](https://github.com/MapColonies/telemetry/commit/5b7a6fe8507e396e32058402d63459f7664fb395))
* pr changes ([3109455](https://github.com/MapColonies/telemetry/commit/3109455fec9f6ec4815b60c7a7269fffc6bca464))


### Code Refactoring

* options change ([#69](https://github.com/MapColonies/telemetry/issues/69)) ([8599539](https://github.com/MapColonies/telemetry/commit/8599539a6e847fbcdf2ae9db18a22b231dc49595))

## [6.1.0](https://github.com/MapColonies/telemetry/compare/v6.0.0...v6.1.0) (2024-06-17)


### Features

* add 3D semantic conventions ([05bedc2](https://github.com/MapColonies/telemetry/commit/05bedc2100fb1cc2bd10c78e68f7c8a67d0b1a78))
* validate also the domain ([9281ae5](https://github.com/MapColonies/telemetry/commit/9281ae5e5be7ecd82d50d26d78b8e5563fbc6684))


### Bug Fixes

* rename src folder in settings.json ([#66](https://github.com/MapColonies/telemetry/issues/66)) ([e6690ed](https://github.com/MapColonies/telemetry/commit/e6690eded50872977aa3d922c80fc92ace1aab6c))

## [6.0.0](https://github.com/MapColonies/telemetry/compare/v5.4.0...v6.0.0) (2024-04-14)


### ⚠ BREAKING CHANGES

* Changed module exported method, only supported if using the moduleResolution: NodeNext option. (#63)

### Features

* First JSON databases semantic-conv generator.
* Include Raster & Infra domain.
* Release includes auto-generated entities under telemetry/convention on importingץ

## [5.4.0](https://github.com/MapColonies/telemetry/compare/v5.3.1...v5.4.0) (2024-03-21)


### Bug Fixes

* enable providing spanOption arguments on span creation ([#61](https://github.com/MapColonies/telemetry/issues/61)) ([f47f4f4](https://github.com/MapColonies/telemetry/commit/f47f4f4c11d44360a8210867295a4b3f49ffba55))

### [5.3.1](https://github.com/MapColonies/telemetry/compare/v5.3.0...v5.3.1) (2024-01-02)


### Bug Fixes

* **tracing:** fix utils to handle undefined span ([#60](https://github.com/MapColonies/telemetry/issues/60)) ([7c3a69c](https://github.com/MapColonies/telemetry/commit/7c3a69c9127fd46086a3fbd5365dbd1e35f954e5))

## [5.3.0](https://github.com/MapColonies/telemetry/compare/v5.2.0...v5.3.0) (2024-01-02)


### Features

* **tracing:** add utils for using spans ([#58](https://github.com/MapColonies/telemetry/issues/58)) ([2257d1a](https://github.com/MapColonies/telemetry/commit/2257d1a0822725b31cfca4d66a219a6834de2db8))

## [5.2.0](https://github.com/MapColonies/telemetry/compare/v5.1.2...v5.2.0) (2023-12-27)


### Bug Fixes

* examples following v5.1.2 for gauge labels ([c331ea8](https://github.com/MapColonies/telemetry/commit/c331ea8ee7bf22417f88cb37a0c36b20a0ce760c))

### [5.1.2](https://github.com/MapColonies/telemetry/compare/v5.1.1...v5.1.2) (2023-09-27)

### [5.1.1](https://github.com/MapColonies/telemetry/compare/v5.1.0...v5.1.1) (2023-09-27)


### Bug Fixes

* added missing merrgedLabels to list of gauge labels ([5391ca6](https://github.com/MapColonies/telemetry/commit/5391ca65c15f5f79d26013d1afec3440ae0ce546))
* examples basic-prom-bundle pushing traces ([0840ec2](https://github.com/MapColonies/telemetry/commit/0840ec254e87c0f43ba4db5a2e5b8b01c74f5663))
* examples were pointing to localhost registry ([0ebb390](https://github.com/MapColonies/telemetry/commit/0ebb390674ec3249e19d7c5421bd2c98ba401549))

## [5.1.0](https://github.com/MapColonies/telemetry/compare/v5.0.0...v5.1.0) (2023-08-27)


### Features

* **metrics:** added collectMetricsExpressMiddleware and deprecated defaultMetricsMiddleware ([#54](https://github.com/MapColonies/telemetry/issues/54)) ([1148a83](https://github.com/MapColonies/telemetry/commit/1148a83bc516a8122762a859c77a32d3fd55e746))

## [5.0.0](https://github.com/MapColonies/telemetry/compare/v4.2.0...v5.0.0) (2023-07-07)


### ⚠ BREAKING CHANGES

* **deps:** upgraded to otel v1.14 (#52)

### Bug Fixes

* **deps:** fixed localhost on package-lock.json ([5e68870](https://github.com/MapColonies/telemetry/commit/5e6887027ab26b443b49f9f124c6280c50629cdc))


* **deps:** upgraded to otel v1.14 ([#52](https://github.com/MapColonies/telemetry/issues/52)) ([0e186ff](https://github.com/MapColonies/telemetry/commit/0e186ffeebc09a287186543463d10c8b7ebf9a3d))

## [4.2.0](https://github.com/MapColonies/telemetry/compare/v4.1.0...v4.2.0) (2023-06-22)


### Features

* add backstage docs ([425355b](https://github.com/MapColonies/telemetry/commit/425355b08bfb5887118d571db4f51f4020e55365))
* added new metrics middleware ([#51](https://github.com/MapColonies/telemetry/issues/51)) ([2779bca](https://github.com/MapColonies/telemetry/commit/2779bca27c3869087d94db5cdee1713ff1505934))

## [4.1.0](https://github.com/MapColonies/telemetry/compare/v4.0.0...v4.1.0) (2022-06-13)


### Features

* added functions to simplify ignoring request paths ([#48](https://github.com/MapColonies/telemetry/issues/48)) ([4e1f13a](https://github.com/MapColonies/telemetry/commit/4e1f13a20596384518e96986612fd5d9d7f9b962))

## [4.0.0](https://github.com/MapColonies/telemetry/compare/v3.1.0...v4.0.0) (2022-06-12)


### ⚠ BREAKING CHANGES

* upgraded to new otel version (#46)

### Features

* added node metrics middleware ([#47](https://github.com/MapColonies/telemetry/issues/47)) ([d211477](https://github.com/MapColonies/telemetry/commit/d21147717caedab13dbdc0074284a2a587fe375d))


* upgraded to new otel version ([#46](https://github.com/MapColonies/telemetry/issues/46)) ([c85ad8f](https://github.com/MapColonies/telemetry/commit/c85ad8fe6e665f428365f4cbb4314772755d4367))

## [3.1.0](https://github.com/MapColonies/telemetry/compare/v3.0.0...v3.1.0) (2021-07-14)


### Features

* **tracing:** context binding util ([#32](https://github.com/MapColonies/telemetry/issues/32)) ([9725ed7](https://github.com/MapColonies/telemetry/commit/9725ed7141994c3264a3016e642ca842f0d042a4))

## [3.0.0](https://github.com/MapColonies/telemetry/compare/v2.2.0...v3.0.0) (2021-07-04)


### ⚠ BREAKING CHANGES

* **tracing:** support in resource (#29)

### Features

* **tracing:** support in resource ([#29](https://github.com/MapColonies/telemetry/issues/29)) ([3df6c71](https://github.com/MapColonies/telemetry/commit/3df6c71f4d07b62da7cdfb1196dc6aa13ed6066d))

## [2.2.0](https://github.com/MapColonies/telemetry/compare/v2.2.0-0...v2.2.0) (2021-06-30)

## [2.2.0-0](https://github.com/MapColonies/telemetry/compare/v2.1.0...v2.2.0-0) (2021-06-30)


### Features

* **tracing:** added support in isEnabled env ([#28](https://github.com/MapColonies/telemetry/issues/28)) ([b58d3ee](https://github.com/MapColonies/telemetry/commit/b58d3ee1c0cfab28a39ec421621867d8dc0b798a))

## [2.1.0](https://github.com/MapColonies/telemetry/compare/v2.0.0...v2.1.0) (2021-06-29)


### Features

* **tracing:** trace id on header middleware ([#27](https://github.com/MapColonies/telemetry/issues/27)) ([a6a2a31](https://github.com/MapColonies/telemetry/commit/a6a2a31cebce3378d37fee1ebabd34261606de8e))

## [2.0.0](https://github.com/MapColonies/telemetry/compare/v2.0.0-0...v2.0.0) (2021-06-28)

## [2.0.0-0](https://github.com/MapColonies/telemetry/compare/v1.1.2-0...v2.0.0-0) (2021-06-28)


### ⚠ BREAKING CHANGES

* **deps:** upgrade to otel v1.0.1

### build

* **deps:** upgrade to otel v1.0.1 ([676483b](https://github.com/MapColonies/telemetry/commit/676483bb685b3bea7afa211af9b88a29b455177b))

### [1.1.2-0](https://github.com/MapColonies/telemetry/compare/v1.1.1...v1.1.2-0) (2021-06-27)

### [1.1.1](https://github.com/MapColonies/telemetry/compare/v1.1.0...v1.1.1) (2021-05-19)


### Bug Fixes

* **deps:** changed the api version to be fixed ([#22](https://github.com/MapColonies/telemetry/issues/22)) ([e09cbf5](https://github.com/MapColonies/telemetry/commit/e09cbf5d879f7611c7dd2a7d967b72fedfb5aecc))

## [1.1.0](https://github.com/MapColonies/telemetry/compare/v1.1.0-7...v1.1.0) (2021-04-29)

## [1.1.0-7](https://github.com/MapColonies/telemetry/compare/v1.1.0-6...v1.1.0-7) (2021-04-27)


### Bug Fixes

* **deps:** removed async hooks ([#19](https://github.com/MapColonies/telemetry/issues/19)) ([c6bd118](https://github.com/MapColonies/telemetry/commit/c6bd118f1cd85059c3dcef02d7c36aaca8d91a15))

## [1.1.0-6](https://github.com/MapColonies/telemetry/compare/v1.1.0-5...v1.1.0-6) (2021-04-27)

## [1.1.0-5](https://github.com/MapColonies/telemetry/compare/v1.1.0-4...v1.1.0-5) (2021-04-22)


### Features

* **tracing:** added hook to integrate with pino logger ([#17](https://github.com/MapColonies/telemetry/issues/17)) ([688d67f](https://github.com/MapColonies/telemetry/commit/688d67f299c9327726a9603c11cd55d33af44cdc))

## [1.1.0-4](https://github.com/MapColonies/telemetry/compare/v1.1.0-3...v1.1.0-4) (2021-04-04)

## [1.1.0-3](https://github.com/MapColonies/telemetry/compare/v1.1.0-2...v1.1.0-3) (2021-03-22)


### Features

* **metrics:** added metrics support ([d3da55f](https://github.com/MapColonies/telemetry/commit/d3da55fd3390ab072f006667bf86909a2b808d56))

## [1.1.0-2](https://github.com/MapColonies/telemetry/compare/v1.1.0-1...v1.1.0-2) (2021-02-07)


### Bug Fixes

* **tracing:** fix serviceName ([bc2b395](https://github.com/MapColonies/telemetry/commit/bc2b39523740d9a6e8cae31ea75a6075f7939b87))

## [1.1.0-1](https://github.com/MapColonies/telemetry/compare/v1.1.0-0...v1.1.0-1) (2021-02-07)


### Features

* **tracing:** added configurable tracing support ([#8](https://github.com/MapColonies/telemetry/issues/8)) ([dfc68fe](https://github.com/MapColonies/telemetry/commit/dfc68fea3718f4094e976b6c96c01a10f33cb718)), closes [#7](https://github.com/MapColonies/telemetry/issues/7)

## 1.1.0-0 (2021-01-19)


### Features

* **tracing:** add support for opentelemetry tracing ([#5](https://github.com/MapColonies/telemetry/issues/5)) ([de7e983](https://github.com/MapColonies/telemetry/commit/de7e983b6caa98520bd989d1d0705e7e8cc70edb)), closes [#2](https://github.com/MapColonies/telemetry/issues/2)

## 1.1.0 (2021-01-04)


### Features

* added jest and updated npm scripts ([cf75a56](https://github.com/MapColonies/ts-npm-package-boilerplate/commit/cf75a567f51824081771739d772384f1d7d7ef98))


### Bug Fixes

* **configurations:** corrected main property of package ([02c2935](https://github.com/MapColonies/ts-npm-package-boilerplate/commit/02c293510df9c5f5b626113a742788255322058c))
