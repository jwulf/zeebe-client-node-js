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

In there, import the Zeebe Node library:

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

Here is the same code to query the broker topology, written using async/await:

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

## Output

If the broker is running and accessible, you will see something like the following:

```
{
  "brokers": [
    {
      "partitions": [],
      "nodeId": 0,
      "host": "172.26.0.2",
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
{"context":"/Users/sitapati/workspace/tmp/myproject/node_modules/zeebe-node/dist/zb/ZBClient.js:382","level":50,"message":"14 UNAVAILABLE: failed to connect to all addresses","pollMode":"","taskType":"ZBClient","time":"2019 Nov-11 22:39:32PM","timestamp":"2019-11-11T12:39:32.155Z"}
{"context":"/Users/sitapati/workspace/tmp/myproject/node_modules/zeebe-node/dist/zb/ZBClient.js:374","level":50,"message":"gRPC connection is in failed state. Attempt 5. Retrying in 5s...","pollMode":"","taskType":"ZBClient","time":"2019 Nov-11 22:39:37PM","timestamp":"2019-11-11T12:39:37.159Z"}
```

These are due to the Zeebe Node client's built-in backoff-retry logic for network-related errors. The client automatically retries to establish the connection until it connects, or retries are exhausted.

You can disable automatic retries if you want network errors to bubble up immediately to your code, and write your own logic to handle them. See the later section on the ZBClient for more details.

## Logs

The client logs to the console by default (you can inject a replacement), using a structured JSON format - [ndjson](http://ndjson.org/). To view the log output in a human-readable format, you can use [`pino-pretty`](https://www.npmjs.com/package/pino-pretty).

Install pino-pretty globally:

{{< tabs >}}
{{< tab Bash >}}
{{< highlight bash >}}
npm i -g pino-pretty
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Now, pipe your program's output through pino-pretty:

{{< tabs >}}
{{< tab Bash >}}
{{< highlight bash >}}
node index.js | pino-pretty
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Log messages will now be formatted for your viewing pleasure:

```
[2019 Nov-11 23:43:48PM] ERROR:
    context: "/Users/sitapati/workspace/tmp/myproject/node_modules/zeebe-node/dist/zb/ZBClient.js:382"
    message: "14 UNAVAILABLE: failed to connect to all addresses"
    pollMode: ""
    taskType: "ZBClient"
[2019 Nov-11 23:43:53PM] ERROR:
    context: "/Users/sitapati/workspace/tmp/myproject/node_modules/zeebe-node/dist/zb/ZBClient.js:374"
    message: "gRPC connection is in failed state. Attempt 10. Retrying in 5s..."
    pollMode: ""
    taskType: "ZBClient"
```

## Deploy a Workflow

The next task is to deploy a workflow to the broker.

The method `ZBClient.deployWorkflow()` takes a path to a .bpmn file, and deploys that BPMN file to the broker, returning a Promise of a broker response.

Here is the sample workflow that we will be using:

<img src="/img/sample-workflow.png"/>

It has a single task in it.

Download [the sample bpmn file](https://raw.githubusercontent.com/jwulf/bpmn-sample/master/sample.bpmn) from this [bpmn-sample](https://github.com/jwulf/bpmn-sample) GitHub repository.

If you are using JavaScript or transpiling TypeScript in-place (outputting the .js files next to the .ts source files), then put the .bpmn file in the same directory as your index file. You will need to use the path `./sample.bpmn`.

If you are transpiling your TypeScript from a source directory to an output directory, then put the .bpmn file in the directory above your source directory. You will need to use the path `../sample.bpmn`.

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

## Output

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

The method `ZBClient.createWorkflowInstance()` creates (and starts) a workflow instance. It takes a BPMN Process Id and an initial variables object, and returns a Promise of a create workflow instance response.

There is no problem leaving the `deployWorkflow` command in the code - the broker will not update the deployment if the file has not changed since the last deployment, and it ensures that the workflow definition we are about to start an instance of is deployed.

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

## Output

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
