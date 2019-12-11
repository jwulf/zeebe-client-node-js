---
title: 'Writing Type-Safe Workers'
date: 2019-10-26T17:01:15+10:00
draft: false
---

_This section only applies if you are using TypeScript_

The `job` parameter that is passed to your worker handler is, by default, partially typed.

The metadata from the broker is strongly typed, but the `customHeaders` and `variables` are typed as `any`.

The argument that you pass to the `complete.success()` function is also typed as `object`.

You can provide explicit type information for these fields to provide greater type-safety and Intellisense support in your IDE.

## Explicitly typing Job Variables and the complete function

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

interface JobVariables {
    customerId: number
}

interface CompleteVariables extends JobVariables {
    customerData: CustomerRecord
}

interface CustomerRecord {
    name: string
}

const mockData: {[key: number]: CustomerRecord} = {
    1: {
        name: "Joe Bloggs"
    }
}

const mockDB = {
    get: (id: number): CustomerRecord | undefined => mockData[id]
}

const zbc = new ZBClient()

zbc.createWorker<JobVariables, any, CompleteVariables>(null, 'get-customer', (job, complete, worker) => {
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
// Only applicable to TypeScript
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Explicitly typing Custom Headers

Your task instances in the BPM can specify custom headers. You can use this feature to do things like write a generic Slack messaging worker, and derive the message to send from the job variables, and the specify which channel to send it to in the task instance via a custom header:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'
import { sendSlackMessage } from './slack'

interface JobVariables {
    message: string
}

interface CompleteVariables {
    message: '' // erase message after sending
}

interface CustomHeaders {
    channel: string
}


const zbc = new ZBClient()

zbc.createWorker<JobVariables, CustomHeaders, CompleteVariables>
async (null, 'send-slack-message', (job, complete, worker) => {
    const { message } = job.variables
    const { channel } = job.customHeaders
    worker.log(`Sending ${message} to ${channel}`)
    try {
        await sendSlackMessage({
            channel,
            message
        })
        return complete.success({
            message: ''
        })
    } catch (e) {
        worker.log(e.message)
        return complete.failure(e.message)
    }
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
// Only applicable to TypeScript
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Explicitly typing Task Types

Task types are arbitrary strings. This can lead to hard to diagnose bugs. To aid you in catching these as far forward as possible, the Node client can generate type information from your BPMN files.

