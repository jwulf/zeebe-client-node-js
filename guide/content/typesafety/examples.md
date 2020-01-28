# Building Type-safe applications

<!-- prettier-ignore -->
{{< tabs >}}
  {{< tab TypeScript >}}
    {{< highlight typescript >}}
/**
* This TypeScript example makes use of Generic typing to provide intellisense and type-safety
* for the variables. If you don't supply any Generic types (in angle brackets <>),
* the type of variables will be `any`. That also works fine, just with less safety.
*/
import { ZBClient } from 'zeebe-node'
import type { CreateWorkflowInstanceWithResultResponse } from 'zeebe-node' // TS 3.8+

const zbc = new ZBClient()

interface UserRecord {
    userid: number
    name: string
}

interface FinalState extends UserRecord {
    approved: boolean
}

async function processUser(user: UserRecord): Promise<CreateWorkflowInstanceWithResultResponse<FinalState>> {
  try {
    const res = await zbc.createWorkflowInstanceWithResult<UserRecord, FinalState>('user-something-process', user)
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
