---
title: 'Zeebe Node Quickstart'
date: 2019-10-28T16:59:15+10:00
draft: false
---

## Prerequisites

-   Node.js / npm
-   A Zeebe broker running locally (refer to the [broker documentation](https://docs.zeebe.io)).

## Import the Zeebe Node library

Create an `index.js` file (or `index.ts` for TypeScript).

Edit the file, and import the Zeebe Node library:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'
    {{< /highlight >}}
  {{< /tab >}}
  {{< tab "JavaScript (ES6)">}}
    {{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

## Create a ZBClient

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

This establishes a connection to a Zeebe broker running on `localhost:26500`. This is the default when no arguments are passed to the constructor and no environment variables are set.

The connection is eager. This will throw if a broker connection cannot be established - although at this point, this program exits before the connection timeout is reached.

## Query the broker topology

The `ZBClient.topology()` method queries the broker topology. It returns a Promise of a broker topology object.

Operations involving the broker are _asynchronous_. They involve network calls, so they return Promises that need to be awaited, or composed using `Promise.then`.

Here we query the broker topology using the Promise interface:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

zbc.topology()
  .catch(console.error)
  .then(res => console.log(JSON.stringify(res, null, 2)))
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

zbc.topology()
  .catch(console.error)
  .then(res => console.log(JSON.stringify(res, null, 2)))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

For the rest of this guide, we will mostly be using the async/await approach to Promise handling in examples.

Here is the same code to query the broker topology, written using async/await syntax:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

async function main() {
  try {
    const res = await zbc.topology()
    console.log(JSON.stringify(res, null, 2))
  } catch (e) {
    console.error(e)
  }
}

main()
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

async function main() {
  try {
    const res = await zbc.topology()
    console.log(JSON.stringify(res, null, 2))
  } catch (e) {
    console.error(e)
  }
}

main()
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

You can use either style in your code.

## Output: Query the broker topology

If the broker is running and accessible, you will see something like the following:

```
{
  "brokers": [
    {
      "partitions": [
        {
          "partitionId": 1,
          "role": "LEADER"
        }
      ],
      "nodeId": 0,
      "host": "172.24.0.2",
      "port": 26501
    }
  ],
  "clusterSize": 1,
  "partitionsCount": 1,
  "replicationFactor": 1
}
```

Note: _if the broker is running in Docker, the `host` IP address reported by the topology command is the internal Docker network IP of the broker._

## Network errors and automatic retries

If the broker is not started, or is not accessible to your client, you will see a stream of errors - similar to the one below - that slow down over time.

```
{"timestamp":"2019-11-21T11:37:37.939Z","context":"/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:441","level":50,"message":"14 UNAVAILABLE: failed to connect to all addresses","time":"2019 Nov-21 21:37:37PM","pollInterval":30000,"namespace":"ZBClient"}
{"timestamp":"2019-11-21T11:37:37.940Z","context":"/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:433","level":50,"message":"gRPC connection is in failed state. Attempt 2. Retrying in 5s...","time":"2019 Nov-21 21:37:37PM","pollInterval":30000,"namespace":"ZBClient"}
```

These are due to the Zeebe Node client's built-in backoff-retry logic for network-related errors. The client automatically retries to establish the connection until it connects, or retries are exhausted.

You can disable automatic retries if you want network errors to bubble up immediately to your code, and write your own logic to handle them. See the later section on the ZBClient for more details.

## Logs

The client logs to the console by default (you can inject a replacement), using a structured JSON format - [ndjson](http://ndjson.org/). To view the log output in a human-readable format, you can use [`pino-pretty`](https://www.npmjs.com/package/pino-pretty).

Install pino-pretty globally:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab Bash >}}
    {{< highlight bash >}}
npm i -g pino-pretty
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

Now, pipe your program's output through pino-pretty:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab Bash >}}
    {{< highlight bash >}}
node index.js | pino-pretty
    {{< /highlight >}}
  {{< /tab >}}
{{< /tabs >}}

Log messages will now be formatted for your viewing pleasure:

```
[2019 Nov-21 21:38:22PM] ERROR:
    context: "/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:441"
    message: "14 UNAVAILABLE: failed to connect to all addresses"
    pollInterval: 30000
    namespace: "ZBClient"
[2019 Nov-21 21:38:23PM] ERROR:
    context: "/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:433"
    message: "gRPC connection is in failed state. Attempt 2. Retrying in 5s..."
    pollInterval: 30000
    namespace: "ZBClient"
```

## Deploy a Workflow

The next task is to deploy a workflow to the broker.

The method `ZBClient.deployWorkflow()` takes a path to a .bpmn file, and deploys that BPMN file to the broker, returning a Promise of a broker response - a `DeployWorkflowResponse`.

Here is the sample workflow that we will be using:

<img src="/img/sample-workflow.png"/>

It has a single task in it.

Download [the sample bpmn file](https://raw.githubusercontent.com/jwulf/bpmn-sample/master/sample.bpmn) from this [bpmn-sample](https://github.com/jwulf/bpmn-sample) GitHub repository.

If you are using JavaScript or transpiling TypeScript in-place (outputting the .js files next to the .ts source files), then put the .bpmn file in the same directory as your index file. You will need to use the path `./sample.bpmn`.

If you are transpiling your TypeScript from a source directory to an output directory, then put the .bpmn file in the directory above your source directory. You will need to use the path `../sample.bpmn`.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

async function main() {
  try {
    const res = await zbc.deployWorkflow('./sample.bpmn')
    console.log(JSON.stringify(res, null, 2))
  } catch (e) {
    console.error(e)
  }
}

main()
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

async function main() {
  try {
    const res = await zbc.deployWorkflow('./sample.bpmn')
    console.log(JSON.stringify(res, null, 2))
  } catch (e) {
    console.error(e)
  }
}

main()
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Output: Deploy a Workflow

You will see output similar to the following:

```
{
  "workflows": [
    {
      "bpmnProcessId": "sample-process",
      "version": 1,
      "workflowKey": "2251799813685249",
      "resourceName": "sample.bpmn"
    }
  ],
  "key": "2251799813685250"
}
```

The workflow has been deployed to the broker, and you can now start an instance of the workflow, using its `bpmnProcessId` - "sample-process" (this is defined in the .bpmn file).

## Create a Workflow Instance

The method `ZBClient.createWorkflowInstance()` creates (and starts) a workflow instance. It takes a BPMN Process Id and an initial variables object, and returns a Promise of a `CreateWorkflowInstance` response.

There is no problem leaving the `deployWorkflow` command in the code - the broker will not update the deployment if the file has not changed since the last deployment, and it ensures that the workflow definition we are about to start an instance of is, in fact, deployed.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

async function main() {
  try {
    await zbc.deployWorkflow('./sample.bpmn')
    const res = await zbc.createWorkflowInstance('sample-process', {});
    console.log(JSON.stringify(res, null, 2))
  } catch (e) {
    console.error(e)
  }
}

main()
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

async function main() {
  try {
    await zbc.deployWorkflow('./sample.bpmn')
    const res = await zbc.createWorkflowInstance('sample-process', {});
    console.log(JSON.stringify(res, null, 2))
  } catch (e) {
    console.error(e)
  }
}

main()
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Output: Create a Workflow Instance

You will see output similar to the following:

```
{
  "workflowKey": "2251799813685249",
  "bpmnProcessId": "sample-process",
  "version": 1,
  "workflowInstanceKey": "2251799813685252"
}
```

An instance of the workflow has been started.

## Create a Worker

A worker is a process that subscribes to a task type on the broker, polling for available jobs of that task type. When jobs of that task type are available, the broker streams them to the worker in response to its polling request. The workflow's job handler is invoked for each available job.

The method `ZBClient.createWorker` creates a new worker. It takes an optional worker id for tracing, a task type, and a job handler callback function. If the worker id is `null`, the library will assign a UUID.

Create a new file named `worker.js` (`worker.ts` for TypeScript).

Edit the content like this:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from "zeebe-node";

const zbc = new ZBClient();

zbc.createWorker(null, "sample-task", (job, complete) => {
  console.log(JSON.stringify(job, null, 2));
  // Business logic
  complete.success();
});
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient();

zbc.createWorker(null, "sample-task", (job, complete) => {
  console.log(JSON.stringify(job, null, 2));
  // Business logic
  complete.success();
});
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

When you run this, the worker polls the broker for jobs of type 'sample-task', and gets the job from the workflow you created in a previous step.

## Output: Create a Worker

You will see output similar to the following:

```
{
  "key": "2251799813686445",
  "type": "sample-task",
  "workflowInstanceKey": "2251799813686440",
  "bpmnProcessId": "sample-process",
  "workflowDefinitionVersion": 1,
  "workflowKey": "2251799813686430",
  "elementId": "ServiceTask_1aj1tsb",
  "elementInstanceKey": "2251799813686444",
  "customHeaders": {},
  "worker": "559fe180-c860-44ba-a6c5-8d32d6b9e026",
  "retries": 3,
  "deadline": "1574076501831",
  "variables": {}
}
```

This is the job object that is received by the worker. Your worker can perform any side-effects and any calculations it needs to, and post any updates to the job variables.

Your worker is sitting there polling for more work, so you can experiment with starting more workflows. Hit Ctrl-C to kill the worker when you are ready to move on.

## Update the job

This next step requires 0.22.0-alpha1 or later of the broker, and v0.22.0-alpha.1 or later of the Node client. We are going to use the `createWorkflowInstanceWithResult()` method of the client to await the outcome of the workflow. This method was introduced with that version and does not work in earlier versions.

First, modify your worker like this:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from "zeebe-node";

const zbc = new ZBClient();

zbc.createWorker(null, "sample-task", (job, complete) => {
  console.log(JSON.stringify(job, null, 2));
  // Business logic
  complete.success({
    updateId: 'some-uuid'
  });
});
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient();

zbc.createWorker(null, "sample-task", (job, complete) => {
  console.log(JSON.stringify(job, null, 2));
  // Business logic
  complete.success({
    updateId: 'some-uuid'
  });
});
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Here, we update the workflow variables from the worker. This update will be merged with the other variables in the workflow and will be the job variables that workers servicing tasks later in the process receive. There is only one task in our sample workflow, so we will use a method call that starts a workflow and awaits the result to inspect the variable state after our worker does its thing.

Start the worker now, and modify `index.js|ts` to be this:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

async function main() {
  try {
    await zbc.deployWorkflow('./sample.bpmn')
    const res = await zbc.createWorkflowInstanceWithResult('sample-process', {
      requestId: 'someRequestId'
    });
    console.log(JSON.stringify(res, null, 2))
  } catch (e) {
    console.error(e)
  }
}

main()
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()

async function main() {
  try {
    await zbc.deployWorkflow('./sample.bpmn')
    const res = await zbc.createWorkflowInstanceWithResult('sample-process', {
      requestId: 'someRequestId'
    });
    console.log(JSON.stringify(res, null, 2))
  } catch (e) {
    console.error(e)
  }
}

main()
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

## Output: Update the job

You will see output similar to the following in the worker:

```
{
  "key": "2251799813686671",
  "type": "sample-task",
  "workflowInstanceKey": "2251799813686665",
  "bpmnProcessId": "sample-process",
  "workflowDefinitionVersion": 1,
  "workflowKey": "2251799813686430",
  "elementId": "ServiceTask_1aj1tsb",
  "elementInstanceKey": "2251799813686670",
  "customHeaders": {},
  "worker": "819f09a4-7fde-4782-808d-9ed86c8ee363",
  "retries": 3,
  "deadline": "1574079338555",
  "variables": {
    "requestId": "someRequestId"
  }
}
```

We created the workflow instance with variable `requestId` set to `someRequestId`, and you can see that your worker receives this in the job variables.

When the worker completes the job, it sends back an update: it sets `updateId` to `some-uuid`. In your process that creates and awaits the workflow, you will see something similar to the following:

```
{
  "workflowKey": "2251799813686430",
  "bpmnProcessId": "sample-process",
  "version": 1,
  "workflowInstanceKey": "2251799813686665",
  "variables": {
    "updateId": "some-uuid",
    "requestId": "someRequestId"
  }
}
```

The workflow variables were updated.

## Summary

In this Quickstart you deployed a workflow, created instances of that workflow, created a worker to service the single task in the workflow, updated job variables, and awaited a workflow's outcome.

This is 80% of what you'll be doing with the Zeebe Node client in your application.

The rest of this guide goes into more depth on each of these aspects, and also covers the other methods that are available.
