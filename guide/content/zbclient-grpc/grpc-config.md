---
title: 'ZBClient gRPC retries'
date: 2019-10-27T17:01:15+10:00
draft: false
---

## Failure - part of success

All ZBClient methods that involve sending a gRPC command to the broker may fail.

If you are using async/await that means they will throw. If you are using Promises, they will reject and take the `.catch` path.

We divide failures into two categories: 

* "Business logic errors" - for example, trying to create an instance of a workflow for which no workflow definition is deployed on the broker.
* "Network errors" - for example, the gRPC connection to the gateway is in a failed state while the gateway is being rescheduled by Kubernetes.

Business errors will always throw / reject. 

The Node client can automatically retry on network errors, and does this by default.


## Automatic retry on network errors

Network errors return [gRPC error code 14](https://github.com/grpc/grpc/blob/master/doc/statuscodes.md).

According to the spec:

> The service is currently unavailable. This is most likely a transient condition, which can be corrected by retrying with a backoff. Note that it is not always safe to retry non-idempotent operations.


To help you write robust applications that continue to operate around transient network failures and recover automatically as the network recovers, the Node client is configured by default to automatically retry operations on network failures, with a back-off.

## Disable automatic retries

You can configure this, or disable it entirely if you want to code some other strategy. If you need your application to page you immediately on a network error, and _definitely do not try that again_ (or some other custom handling), pass `retry: false` to the ZBClient constructor:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

// Don't retry. I will handle all errors.
const zbc = new ZBClient({
  retry: false
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

// Don't retry. I will handle all errors.
const zbc = new ZBClient({
  retry: false
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

Note that you can create more than one ZBClient in an application, each with its own retry configuration, and then use the retry strategy that makes sense for each operation.

## Configure retries

If you have retries enabled, you can set the maximum number of retries that are attempted before an exception is thrown, and the maximum time between retries.

The retry mechanism is implemented using the [promise-retry](https://www.npmjs.com/package/promise-retry) module. The backoff is exponential by a factor of 2, and by default it retries 50 times, with a maximum of 5 seconds between retries.

To change this, pass in values for `maxRetries` and `maxRetryTimeout` to the ZBClient constructor:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

// These are the default settings.
const zbc = new ZBClient({
	maxRetries: 50
	maxRetryTimeout: 5000
})
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

// These are the default settings.
const zbc = new ZBClient({
	maxRetries: 50
	maxRetryTimeout: 5000
})
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

## Broker backpressure

There is a third category of response that can be handled with automated retries. The Zeebe broker has an adaptive algorithm that detects growing latency in the system due to load, and produces backpressure. When the broker detects this, it responds to commands (other than completeJob) with gRPC error code `8 - RESOURCE EXHAUSTED`. 

If retries are enabled, in this situation the Node client applies the same retry strategy that is configured for transient network failures.