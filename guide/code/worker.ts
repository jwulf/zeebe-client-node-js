import { ZBClient } from 'zeebe-node'

const zbc = new ZBClient()

zbc.createWorker(null, 'sample-task', (job, complete) => {
	// tslint:disable-next-line: no-console
	console.log(JSON.stringify(job, null, 2))
	// Business logic
	complete.success({
		updateId: 'some-uuid',
	})
})
