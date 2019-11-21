import { ZBClient } from '../../src'

const zbc = new ZBClient()

async function main() {
	try {
		// const res = await zbc.deployWorkflow('./sample.bpmn')
		// const res = await zbc.createWorkflowInstanceWithResult(
		// 	'sample-process',
		// 	{
		// 		requestId: 'someRequestId',
		// 	}
		// )
		const res = await zbc.topology()

		// tslint:disable-next-line: no-console
		console.log(JSON.stringify(res, null, 2))
	} catch (e) {
		// tslint:disable-next-line: no-console
		console.error(e)
	}
}

main()
