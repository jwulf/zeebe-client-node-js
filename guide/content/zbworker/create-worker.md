---
title: 'Create a Job Worker'
date: 2019-10-26T17:01:15+10:00
draft: false
---

To create a Job Worker, you must first create a ZBClient. The ZBClient defines the logging, connection, and retry configuration that will be inherited by any ZBWorkers that it creates.

This allows you to consolidate configuration, and also create various configurations for different scenarios. Refer to the section on the <a href="/zbclient">ZBClient</a> for more information on the ZBClient class.

## Create a Job Worker

Creating a job worker is simple:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

zbc.createWorker(null, 'get-customer', (job, complete) => {

    // Job handler goes here

})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

zbc.createWorker(null, 'get-customer', (job, complete) => {

    // Job handler goes here

})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

The first parameter of `createWorker` is an optional string id for the worker. This id is used in logging on the broker. If you do not assign one - passing in `null` as the value - then the library will assign a UUID.

The second parameter is the task type. In your BPM diagram your tasks have a string task type. One way to think of it is that your worker subscribes to the broker for tasks of this type. In practice, the worker polls the broker with the `ActivateJobs` gRPC command. When jobs of this task type are available, the broker returns them as an array.

The third parameter is the job handler. When work is available, the job handler is invoked for each of the available jobs.

## Job handler

The job handler takes three parameters - two required and one optional.

The first is the `job` ([API Docs](https://creditsenseau.github.io/zeebe-client-node-js/interfaces/job.html)). This is an object with metadata about the job instance from the broker, including any custom headers from the task in the BPM diagram, and the current variables from the workflow instance.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

zbc.createWorker(null, 'get-customer', (job, complete) => {
    console.log('Job', job)
    // Job handler goes here

})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

zbc.createWorker(null, 'get-customer', (job, complete) => {
    console.log('Job', job)
    // Job handler goes here

})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

The second is the `complete` context ([API Docs](https://creditsenseau.github.io/zeebe-client-node-js/interfaces/completefn.html)). It has two methods: `complete.success()` and `complete.failure`. When your worker is finished with its work, call one of the methods to inform the broker whether the work was a success or a failure.

If you call `complete.failure()` you must pass in a string message. If retries for this job are exhausted, then the message will be visible in Operate as the reason for the incident that is raised.

If you call `complete.success()` you can pass in a JavaScript object that is serializable to JSON. This is passed to the broker, which merges it with the current workflow instance variables.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const mockData = {
    "1": {
        name: "Joe Bloggs"
    }
}

const mockDB = {
    get: id => mockData[id]
}

const zbc = new ZBClient()

zbc.createWorker(null, 'get-customer', (job, complete) => {
    const id = job.variables.customerId
    const customer = mockDB.get(id)
    return customer ?
        complete.success({
            customerData: customer
        }) :
        complete.failure(`Customer with id ${id} not found`)
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const mockData = {
    "1": {
        name: "Joe Bloggs"
    }
}

const mockDB = {
    get: id => mockData[id]
}

const zbc = new ZBClient()

zbc.createWorker(null, 'get-customer', (job, complete) => {
    const id = job.variables.customerId
    const customer = mockDB.get(id)
    return customer ?
        complete.success({
            customerData: customer
        }) :
        complete.failure(`Customer with id ${id} not found`)
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

The third parameter is optional, and is a reference to the `worker` itself. This allows you to log inside the job handler using `worker.log()`.


<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const mockData = {
    "1": {
        name: "Joe Bloggs"
    }
}

const mockDB = {
    get: id => mockData[id]
}

const zbc = new ZBClient()

zbc.createWorker(null, 'get-customer', (job, complete, worker) => {
    const id = job.variables.customerId
    const customer = mockDB.get(id)
    worker.log(`Retrieved customer ${customer?.name}`) // TS 3.7+
    return customer ?
        complete.success({
            customerData: customer
        }) :
        complete.failure(`Customer with id ${id} not found`)
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const mockData = {
    "1": {
        name: "Joe Bloggs"
    }
}

const mockDB = {
    get: id => mockData[id]
}

const zbc = new ZBClient()

zbc.createWorker(null, 'get-customer', (job, complete, worker) => {
    const id = job.variables.customerId
    const customer = mockDB.get(id)
    worker.log(`Retrieved customer ${(customer || {}).name}`)
    return customer ?
        complete.success({
            customerData: customer
        }) :
        complete.failure(`Customer with id ${id} not found`)
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}
