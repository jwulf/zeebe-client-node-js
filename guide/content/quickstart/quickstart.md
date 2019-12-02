---
title: 'Zeebe Node Quickstart'
date: 2019-10-28T16:59:15+10:00
draft: false
---

## What you will do in this Quickstart

In this Quickstart you will establish a connection to a Zeebe broker cluster, deploy a workflow definition, create instances of that workflow, create a worker to service a task in the workflow, update the workflow variables via a worker, and await a workflow's outcome.

This workflow will get the current weather in London, UK, and output a recommendation to take an umbrella out with you or leave your umbrella at home.

## Prerequisites

-   Node.js / npm
-   A Zeebe broker

## Start a Zeebe broker

### Local broker

The easiest way to start a broker locally is to use Docker:

```
docker run -it -p 26500:26500 camunda/zeebe
```

For other ways to start a local Zeebe broker, refer to the [broker documentation](https://docs.zeebe.io).

## Camunda Cloud

If you have a Camunda Cloud account, you can run this entire Quickstart against Camunda Cloud.

If you want to do that, you need to set the appropriate environment variables for your Camunda Cloud cluster. See [this section](/connection/camunda-cloud/#environmentalizing-camunda-cloud) for details.

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

This establishes a connection to a Zeebe broker running on `localhost:26500` by default when no arguments are passed to the constructor, and no environment variables are set.

If you set environment variables to connect to Camunda Cloud, then it will connect to your Camunda Cloud cluster.

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
{"timestamp":"2019-11-21T13:52:00.961Z","context":"/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:433","level":50,"message":"[topology]: Attempt 5 (max: 50).","time":"2019 Nov-21 23:52:00PM","pollInterval":30000,"namespace":"ZBClient"}
{"timestamp":"2019-11-21T13:52:00.962Z","context":"/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:441","level":50,"message":"[topology]: 14 UNAVAILABLE: failed to connect to all addresses","time":"2019 Nov-21 23:52:00PM","pollInterval":30000,"namespace":"ZBClient"}
```

These are due to the Zeebe Node client's built-in backoff-retry logic for network-related errors. The client automatically retries to establish the connection until it connects, or retries are exhausted.

You can disable automatic retries if you want network errors to bubble up immediately to your code, and write your own logic to handle them. See the <a href="/grpc">gRPC Configuration</a> chapter for more details.

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
[2019 Nov-21 23:52:54PM] ERROR:
    context: "/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:433"
    message: "[topology]: Attempt 5 (max: 50)."
    pollInterval: 30000
    namespace: "ZBClient"
[2019 Nov-21 23:52:54PM] ERROR:
    context: "/Users/sitapati/workspace/Camunda/zeebe-client-node-js/src/zb/ZBClient.ts:441"
    message: "[topology]: 14 UNAVAILABLE: failed to connect to all addresses"
    pollInterval: 30000
    namespace: "ZBClient"
```

## Deploy a Workflow Definition

The next task is to deploy a workflow definition to the broker.

The method `ZBClient.deployWorkflow()` takes a path to a .bpmn file, and deploys that BPMN file to the broker, returning a Promise of a broker response - a `DeployWorkflowResponse`.

Here is the sample workflow definition that we will be using:

![](/img/sample-workflow.png)

It has three tasks in it.

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

## Output: Deploy a Workflow Definition

You will see output similar to the following:

```
{
  "workflows": [
    {
      "bpmnProcessId": "weather-report",
      "version": 1,
      "workflowKey": "2251799813685249",
      "resourceName": "sample.bpmn"
    }
  ],
  "key": "2251799813685250"
}
```

The workflow has been deployed to the broker, and you can now start an instance of the workflow, using its `bpmnProcessId` - "weather-report" (this is defined in the .bpmn file).

## Create a Workflow Instance

The method `ZBClient.createWorkflowInstance()` creates (and starts) a workflow instance. It takes a BPMN Process Id and an initial variables object, and returns a Promise of a `CreateWorkflowInstance` response.

There is no problem leaving the `deployWorkflow` command in the code - the broker will not update the deployment if the file has not changed since the last deployment, and it ensures that the workflow definition we are about to start an instance of is deployed.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

async function main() {
  try {
    await zbc.deployWorkflow('./sample.bpmn')
    const res = await zbc.createWorkflowInstance('weather-report', {
      city: "London,uk"
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
    const res = await zbc.createWorkflowInstance('weather-report', {
        city: "London,uk"
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

## Output: Create a Workflow Instance

You will see output similar to the following:

```
{
  "workflowKey": "2251799813685249",
  "bpmnProcessId": "weather-report",
  "version": 1,
  "workflowInstanceKey": "2251799813685252"
}
```

An instance of the workflow has been started.

## Create a Worker

A worker is a process that subscribes to a task type on the broker, polling for available jobs of that task type. When jobs of that task type are available, the broker streams them to the worker in response to its polling request. The workflow's job handler is invoked for each available job.

The method `ZBClient.createWorker` creates a new worker. It takes an optional worker id for tracing, a task type, and a job handler callback function. If the worker id is `null`, the library will assign a UUID.

### A Note on the API Key

We will be making a REST call to the [OpenWeatherMap API](https://openweathermap.org/api) to get the current weather. The API key in the example is my personal API key, and it is rate-limited to 60 calls/minute. Please don't use it in a load or through-put test. If you find that it doesn't work, you can grab your own API key for free from OpenWeatherMap.

### Install Axios

Install the `axios` library to your project:

```
npm i axios
```

Create a new file named `workers.js` (`workers.ts` for TypeScript).

We will create three workers: one to get the current weather report, and pass it back into the workflow, along with a `weather_code` to match the table of [Weather Conditions](https://openweathermap.org/weather-conditions) from OpenWeatherMap; and one each for the decision branches.

The `weather_code` will be used by the decision gate in the BPMN to determine the recommendation, which will be added to the broker variables by another worker. Of course we could do the recommendation in a single worker, but three things to note:

1. This is a demonstration that shows the interaction of a number of features.
2. Your business logic is materialised in the BPMN and can be viewed and understood by various stakeholders in the business.
3. Refactoring the business process and changing the system behavior is possible by modifying the BPMN (you could swap out a recommender for an IOT worker that fetches your umbrella, for example, or create a new behavior for snow).

Edit the content like this:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from "zeebe-node"
import axios from axios

const zbc = new ZBClient()
const API_KEY = 'f504fb70e7c6e76703f0a88df83cdd59'

zbc.createWorker(null, "get-weather-report", (job, complete) => {
  console.log(JSON.stringify(job, null, 2))
  const city = job.variables.city
  try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)

      const weather = res.data.weather[0]
      const weather_code = weather.id.toString[0] + "xx"
      complete.success({
          weather_code
      })
  } catch (e) {
      console.error("Something went wrong!")
      console.error(e)
      complete.fail(e.message)
  }
});

zbc.createWorker(null, "take-umbrella", (_, complete) => {
    complete.success({
        recommendation: "Take an umbrella!"
    })
})

zbc.createWorker(null, "leave-umbrella", (_, complete) => {
    complete.success({
        recommendation: "Leave the umbrella at home!"
    })
})
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')
const axios = require('axios')

const zbc = new ZBClient()
const API_KEY = 'f504fb70e7c6e76703f0a88df83cdd59'

zbc.createWorker(null, "get-weather-report", (job, complete) => {
  console.log(JSON.stringify(job, null, 2))
  const city = job.variables.city
  try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)

      const weather = res.data.weather[0]
      const weather_code = weather.id.toString[0] + "xx"
      complete.success({
          weather_code
      })
  } catch (e) {
      console.error("Something went wrong!")
      console.error(e)
      complete.fail(e.message)
  }
});

zbc.createWorker(null, "take-umbrella", (_, complete) => {
    complete.success({
        recommendation: "Take an umbrella!"
    })
})

zbc.createWorker(null, "leave-umbrella", (_, complete) => {
    complete.success({
        recommendation: "Leave the umbrella at home!"
    })
})
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

When you run this, the first worker polls the broker for jobs of type 'get-weather-report' and gets the job from the workflow instance you created in a previous step. It prints out the `job` object it receives from the broker so you can see what that looks like, then it grabs the current weather report from a REST API, and adds a workflow variable `weather_code` with the code for the recommendation to be made.

The broker then examines the variable to route the token in the workflow. One of the other workers then receives the job, and adds its recommendation to the workflow variables.

## Output: Create a Worker

You will see output similar to the following:

```
{
  "key": "2251799813686445",
  "type": "get-weather-report",
  "workflowInstanceKey": "2251799813686440",
  "bpmnProcessId": "weather-report",
  "workflowDefinitionVersion": 1,
  "workflowKey": "2251799813686430",
  "elementId": "ServiceTask_1aj1tsb",
  "elementInstanceKey": "2251799813686444",
  "customHeaders": {},
  "worker": "559fe180-c860-44ba-a6c5-8d32d6b9e026",
  "retries": 3,
  "deadline": "1574076501831",
  "variables": {
      "city": "London,uk"
  }
}
```

This is the job object that is received by the first worker. Your workers can perform any side-effects and any calculations they need to, and post any updates to the job variables.

The workflow ran to completion, but only the first worker has an I/O side-effect, so you won't see any further feedback.

Your workers are sitting there polling for more work. Hit Ctrl-C to kill the worker when you are ready to move on.

"_But where do I see the recommendation?_" I hear you ask. If you ran this against a local broker with Operate, or on Camunda Cloud, you could inspect the workflow in the Completed Instances filter in the Operate UI. You could log it out in the recommendation workers - but that's hardly useful in a real system. You probably want to get the outcome back to the requestor somehow. The simplest way to do this is to await the workflow outcome when starting it.

## Get the output of a workflow

This next step requires 0.22.0-alpha1 or later of the broker, and v0.22.0-alpha.1 or later of the Node client. We are going to use the `createWorkflowInstanceWithResult()` method of the client to await the outcome of the workflow. This method was introduced with that version and does not work in earlier versions.

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
    const res = await zbc.createWorkflowInstanceWithResult('weather-report', {
        city: "London,uk"
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
    const res = await zbc.createWorkflowInstanceWithResult('weather-report', {
        city: "London,uk"
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

## Output: Get the output of a workflow

In your process that creates and awaits the workflow, you will see something similar to the following, depending on the current weather in London:

```
{
  "workflowKey": "2251799813686430",
  "bpmnProcessId": "weather-report",
  "version": 1,
  "workflowInstanceKey": "2251799813686665",
  "variables": {
    "city": "London,uk",
    "weather_code": "2xx",
    "recommendation": "Leave the umbrella at home!"
  }
}
```

The completed workflow variables are now output.

## Summary

In this Quickstart you deployed a workflow definition, created instances of that workflow, created workers to service the single task in the workflow, updated job variables, and awaited a workflow's outcome.

This is 80% of what you'll be doing with the Zeebe Node client in your application.

The rest of this guide covers each of these aspects in more depth, and covers the other available methods
