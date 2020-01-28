
---
title: 'Type-safe Workflow Instances'
date: 2019-10-27T17:01:15+10:00
draft: false
---

# Type-safe applications

Both the `createWorkflowInstance` and `createWorkflowInstanceWithResult` methods of the ZBClient have parameterised types, also known as generic types. These can provide a degree of type-checking and intellisense for the `variables` payload while coding.

By default they are set to `any`, so you can ignore them and the `variables` in and out of these functions can be anything.

Both `createWorkflowInstance` and `createWorkflowInstanceWithResult` take in the initial variable payload. This an arbitrarily shaped object that represents something in the business domain of your application. `createWorkflowInstance` returns a record of the process instance that was started that is fixed in shape and known at design-time. It is defined as part of the broker API, so it is hard-coded into the library.

 `createWorkflowInstanceWithResult`, however, returns the final state of the `variables` in the process instance. This, obviously, is unknown to the library, and so by default it can't help you with the shape of the object.

 You can, however, supply typing for the input variables and the final variables shape. I recommend that you design a business domain API for your workflows, and created typed interfaces for your workflow and task inputs and outputs that are shared between workers and applications that start workflow.

This TypeScript example makes use of Generic typing to provide intellisense and type-safety for the variables. If you don't supply any Generic types (in angle brackets <>), the type of variables will be `any`. That also works fine, just with less safety.


<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'
import type { CreateWorkflowInstanceWithResultResponse } from 'zeebe-node' // TS 3.8+

const zbc = new ZBClient()

interface UserRecord {
    userid: number
    name: string
}

interface UserApprovalProcessOutcome extends UserRecord {
    approved: boolean
}

async function processUser(user: UserRecord): Promise<CreateWorkflowInstanceWithResultResponse<UserApprovalProcessOutcome>> {
  try {
    const res = await zbc.createWorkflowInstanceWithResult<UserRecord, UserApprovalProcessOutcome>('user-approval-process', user)
    return res
  } catch (e) {
      console.log(`There was an error running the 'user-approval-process'!`)
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
// If you want type-safety, you'll need to use TypeScript
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

In the above example, the call to `createWorkflowInstanceWithResult` has been parameterised to "takes a variables of shape `UserRecord`, returns a variables of shape `UserApprovalProcessOutcome`".

You can further bake your business domain API by extending the ZBClient with specialised overloads for concrete process ids.

For example, we now know that the shape of the input and output of the process with the id `user-approval-process`. So when this is stable, we can materialise it in one place in the application. This reduces hand-coding, duplication. and the chance of errors, and makes it easier and safer for new developers and maintainers to interact with the code.

You can specialise the ZBClient to materialise the input and output shape of your processes, like this:

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
import { ZBClient } from 'zeebe-node'
import type { CreateWorkflowInstanceWithResultResponse } from 'zeebe-node' // TS 3.8+


interface UserRecord {
  userid: number;
  name: string;
}

interface FinalState extends UserRecord {
  approved: boolean;
}

interface MyZBC extends ZB.ZBClient {
  createWorkflowInstanceWithResult(bpmnProcessId: 'user-approval-process', variables: UserRecord): Promise<CreateWorkflowInstanceWithResultResponse<FinalState>>;
  createWorkflowInstanceWithResult(config: {
    bpmnProcessId: 'user-something-process',
    variables: UserRecord,
    requestTimeout?: number,
    fetchVariables?: string[]
  }): Promise<CreateWorkflowInstanceWithResultResponse<FinalState>>;
}

const zbc: MyZBC = new ZB.ZBClient()

{{< /highlight >}}
{{< /tab >}}
{{< tab "JavaScript (ES6)">}}
{{< highlight javaScript >}}
// If you want type-safety, you'll need to use TypeScript
{{< /highlight >}}
{{< /tab >}}
{{< /tabs >}}

Now when we use `zbc` (which we cast to `MyZBC`) to create a workflow instance, we get this:

![](/createwf/result.png)

![](/createwf/return.png)

The input and output types are picked up for the process with the concrete id `user-approval-process`, and flow through your application code.

You can then reuse the business domain object interfaces to create type-safe workers.

There is a fair amount of manual wiring involved to bring your application to this level of type-safety. Some people begin with types, and define the structure of their data before writing an implementation. Others experiment and discover the shape of their modelled domain through experimentation (that's me!).

Either way, the gradual typing of TypeScript and the Zeebe Node library have your back - you can introduce as much or as little typing (all the way down to none) as you want at each step.

Future releases of the Zeebe Node client will allow you to parameterise the ZBClient itself with your business domain objects and process ids. This will make the specialisation automatic. Stay tuned to the CHANGELOG.md!
