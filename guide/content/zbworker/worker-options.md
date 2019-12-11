---
title: 'Worker Options'
date: 2019-10-26T17:01:15+10:00
draft: false
---

The `ZBClient.createWorker()` method takes an optional fourth parameter - an options object.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

const handler = (job, complete) => complete.success()

zbc.createWorker(null, 'get-customer', handler, {
    debug: false,
    failWorkflowOnException: false,
    maxJobsToActivate: 32,
    onConnectionErrorHandler: () => console.log('Disconnected!'),
    timeout: 60000
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

const handler = (job, complete) => complete.success()

zbc.createWorker(null, 'get-customer', handler, {
    debug: false,
    failWorkflowOnException: false,
    maxJobsToActivate: 32,
    onConnectionErrorHandler: () => console.log('Disconnected!'),
    timeout: 60000
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

The following options can be set ([API Docs](https://creditsenseau.github.io/zeebe-client-node-js/interfaces/zbworkeroptions.html)):

* `debug` - boolean. Set to true to turn on trace debugging for this worker. It is very verbose and is meant for debugging low-level connection issues.
* `failWorkflowOnException` - boolean. The default behavior of the client is to call `complete.failure()` on an unhandled exception in the job handler, passing in the exception message. If `failWorkflowOnException` is set to true, then an unhandled exception in the worker's job handler will reduce the retry count to 0 when it calls `complete.failure()`. These halts the workflow and raises an incident. This is useful to cause an immediate halt for debugging purposes.
* `fetchVariable` - an array of strings. By default, all variables in the workflow instance are passed from the broker to the worker. If you set this option, then only the variables named in this option are passed to the worker. This is useful, for example, the worker is templating variables into a transactional email to send to a customer. You do not want to accidentally template sensitive variables into the email, so you can explicitly whitelist which variables to pass to the worker.
* `maxJobsToActivate` - an integer number. By default, the worker will retrieve and work on 32 jobs simultaneously, using Node's event loop. If the handler is computationally-intensive, then you may want to limit this to a smaller number. Alternatively, you may want to raise it to a higher number.
* `onConnectionErrorHandler` - you can supply a callback function to be invoked when the gRPC connection to the broker gateway fails. This can be used to alert your infrastructure monitoring.
* `timeout` - an integer number of milliseconds. By default, the worker requests sixty seconds to complete its task. If the worker does not complete the job with either success or failure in this time, the broker will release the job to another worker. If your job handler requires more than sixty seconds to complete its work, pass in a higher value.
