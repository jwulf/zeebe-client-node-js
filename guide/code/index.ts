import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

async function main() {
	try {
		await zbc.deployWorkflow('./sample.bpmn')
		const res = await zbc.createWorkflowInstanceWithResult(
			'sample-process',
			{
				requestId: 'someRequestId',
			}
		)
		// tslint:disable-next-line: no-console
		console.log(JSON.stringify(res, null, 2))
	} catch (e) {
		// tslint:disable-next-line: no-console
		console.error(e)
	}
}

main()
