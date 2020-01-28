---
title: 'Create a Workflow Instance'
date: 2019-10-27T17:01:15+10:00
draft: false
---

## Workflow Instances

A _Workflow instance_ (also known as a process instance) is a specific instance of a process. Each instance has its own variables and its own lifecycle.

## Create a Workflow Instance

Creating and starting a workflow is a single operation:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'
import type { CreateWorkflowInstanceResponse } from 'zeebe-node' // TS 3.8+

const zbc = new ZBClient()

async function startWorkflowInstance(bpmnProcessId: string, initialVariables = {}): Promise<ZB.CreateWorkflowInstanceResponse | undefined> {
  try {
    const res = await zbc.createWorkflowInstanceWithResult(bpmnProcessId, {
			sourceValue: 5,
		})
    console.log(`Started an instance of the ${bpmnProcessId} workflow, with instance id ${res.workflowInstanceKey}`)
    return res
  } catch (e) {
      console.log(`There was an error starting an instance of ${bpmnProcessId}!`)
      console.log(e)
      return undefined
  }
}

startWorkflowInstance('my-workflow', {
    userid: 34,
    name: 'Jane Doe'
}).then(console.log)
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

async function startWorkflowInstance(bpmnProcessId, initialVariables = {}) {
  try {
    const res = await zbc.createWorkflowInstance(filepaths, initialVariables)
    console.log(`Started an instance of the ${bpmnProcessId} workflow, with instance id ${res.workflowInstanceKey}`)
    return res
  } catch (e) {
      console.log(`There was an error starting an instance of ${bpmnProcessId}!`)
      console.log(e)
      return undefined
  }
}

startWorkflowInstance('my-workflow', {
    userid: 34,
    name: 'Jane Doe'
}).then(console.log)
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Create a workflow instance and await its outcome

A common requirement in an application is to react to or communicate the final state of a workflow instance. For short running workflows, Zeebe provides a command that returns a Promise of the workflow outcome: `createWorkflowInstanceWithResult`.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient, CreateWorkflowInstanceWithResultResponse } from 'zeebe-node'

const zbc = new ZBClient()

async function processUser(user: UserRecord) {
  try {
    const res = await zbc.createWorkflowInstanceWithResult('user-something-process', user)
    return res
  } catch (e) {
      console.log(`There was an error running the 'user-something-process'!`)
      throw e
  }
}

processUser({
    userid: 34,
    name: 'Jane Doe'
})
    .then(({variables}) => console.log(`User ${variables.name} approved: `, variables.approved))
    .catch(e => console.log(e))
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

async function processUser(user) {
  try {
    const res = await zbc.createWorkflowInstanceWithResult('user-something-process', user)
    return res
  } catch (e) {
      console.log(`There was an error running the 'user-something-process'!`)
      throw e
  }
}

processUser({
    userid: 34,
    name: 'Jane Doe'
})
    .then(({variables}) => console.log(`User ${variables.name} approved: `, variables.approved))
    .catch(e => console.log(e))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## IMPORTANT! createWorkflowInstanceWithResult has a timeout

Be aware that if your `createWorkflowInstanceWithResult` request times out, or the connection with the broker is lost during this operation, you will not receive the outcome, and will you not receive the process instance id to search for the outcome in an exporter like ElasticSearch. You can mitigate against this by specifying a request timeout, and also by appending a key to allow you to find it in the exporter data, if you need to.

The default timeout for this operation is the Zeebe gateway request timeout, which - if you didn't modify the setting in `zeebe.cfg.toml` on the broker - is 15 seconds. If your workflow instance takes longer than the timeout to complete, the operation will throw.

You can mitigate this by raising the request timeout on the broker, or specifying a custom request timeout for this call. See below for an example of a call that specifies a request timeout, and a user-assigned key (in the variables) to search for the instance in the exporter.


<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient, CreateWorkflowInstanceWithResultResponse } from 'zeebe-node'

const zbc = new ZBClient()

async function processUser(user: UserRecord) {
  try {
    const res = await zbc.createWorkflowInstanceWithResult({
        processId: 'user-something-process',
        variables: user,
        requestTimeout: 2 * 60 * 1000 // 2m
    })
    return res
  } catch (e) {
      console.log(`There was an error running the 'user-something-process'!`)
      throw e
  }
}

processUser({
    userid: 34,
    name: 'Jane Doe',
    myProcessUid: 'to-find-instance-in-exporter'
})
    .then(({variables}) => console.log(`User ${variables.name} approved: `, variables.approved))
    .catch(e => console.log(e))
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

async function processUser(user) {
  try {
    const res = await zbc.createWorkflowInstanceWithResult({
        processId: 'user-something-process',
        variables: user,
        requestTimeout: 2 * 60 * 1000 // 2m
    })
    return res
  } catch (e) {
      console.log(`There was an error running the 'user-something-process'!`)
      throw e
  }
}

processUser({
    userid: 34,
    name: 'Jane Doe',
    myProcessUid: 'to-find-instance-in-exporter'
})
    .then(({variables}) => console.log(`User ${variables.name} approved: `, variables.approved))
    .catch(e => console.log(e))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

You may not care about losing the information about the identity and outcome of a workflow instance, and your system may be resilient to this failure mode. It may not be - the outcome may be critical, or the process expensive to run, or your workflow may be long-running and you cannot rely on your application maintaining state for the duration of the workflow instance (maybe your application gets redeployed, in which case all of these operations in-flight disappear). In these cases you should investigate another design solution, such as the Outcome Worker pattern (see [this blog post](https://zeebe.io/blog/2019/08/zeebe-rest-affinity/)).
