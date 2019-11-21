---
title: 'Deploy Workflow Definitions'
date: 2019-10-27T17:01:15+10:00
draft: false
---

## Workflow Definitions

_Workflow definitions_ are XML files that specify a process using the BPMN ([Business Process Model and Notation](https://en.wikipedia.org/wiki/Business_Process_Model_and_Notation)) schema with Zeebe extensions.

<img src="/img/ecommerce.png"/>

You can create and edit these files using the graphical [Zeebe modeler](https://github.com/zeebe-io/zeebe-modeler).

## Deploy workflow definition files

The method `ZBClient.deployWorkflow` can take a string or an array of strings, where each string is a file path to a BPMN file containing a workflow definition to deploy:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'
import path from 'path'

const zbc = new ZBClient()

async function deployMyWorkflowDefinition(filepaths: string | string[]) {
  const res = await zbc.deployWorkflow(filepaths)
  console.log(res)
  return res
}

deployMyWorkflowDefinition(
  path.join(
    __dirname, 
    '..', 
    'bpmn', 
    'my-workflow.bpmn'
))
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')
const path = require('path')

const zbc = new ZBClient()

async function deployMyWorkflowDefinition(filepaths) {
  const res = await zbc.deployWorkflow(filepaths)
  console.log(res)
  return res
}

deployMyWorkflowDefinition(
  path.join(
    __dirname, 
    '..', 
    'bpmn', 
    'my-workflow.bpmn'
))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

The deployWorkflow command returns a `DeployWorkflowResponse`. This has an array of `WorkflowMetadata`, containing information about the workflow definitions deployed.

The method will throw if any of the workflow definitions are malformed - in this case none are deployed. @TODO - verify

**Note on versioning:** Re-deploying a workflow definition does not create a new version of that workflow definition in the broker cluster, unless the definition has been modified - in which case a new version is created. 

## Deploy a workflow definition from an in-memory buffer

`ZBClient.deployWorkflow` can also deploy a workflow definition from an in-memory buffer. 

This is useful if, for example, you perform template processing on a workflow definition after loading it from a file, before deploying it. See [here](https://github.com/jwulf/zeebe-cloud-canary/blob/master/src/ZeebeCanary.ts#L58) for an example of doing that with micromustache.

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'
import { transformWfd } from './my-workflow-transformer'
import fs from 'fs';
import path from 'path'

const zbc = new ZBClient()

async function deployMyWorkflowDefinition(filepath: string) {
  const workflow = fs.readFileSync(filepath, 'utf-8')
  const xFormedWfd = transformWfd(workflow)
  const res = await zbc.deployWorkflow({
    definition: Buffer.from(xFormedWfd),
    name: path.basename(filepath)
  })
  console.log(res)
  return res
}

deployMyWorkflowDefinition(
  path.join(
    __dirname, 
    '..', 
    'bpmn', 
    'my-workflow.bpmn'
))
{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
const { ZBClient } = require('zeebe-node')
import { transformWfd } from './my-workflow-transformer'
import fs from 'fs';
const path = require('path')

const zbc = new ZBClient()

async function deployMyWorkflowDefinition(filepath: string) {
  const workflow = fs.readFileSync(filepath, 'utf-8')
  const xFormedWfd = transformWfd(workflow)
  const res = await zbc.deployWorkflow({
    definition: Buffer.from(xFormedWfd),
    name: path.basename(filepath)
  })
  console.log(res)
  return res
}

deployMyWorkflowDefinition(
  path.join(
    __dirname, 
    '..', 
    'bpmn', 
    'my-workflow.bpmn'
))
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}