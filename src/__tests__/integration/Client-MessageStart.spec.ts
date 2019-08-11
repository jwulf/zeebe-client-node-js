import { v4 as uuid } from 'uuid'
import { ZBClient } from '../..'

process.env.ZB_NODE_LOG_LEVEL = process.env.ZB_NODE_LOG_LEVEL || 'NONE'

describe('ZBClient', () => {
	let zbc: ZBClient

	beforeEach(async () => {
		zbc = new ZBClient('0.0.0.0:26500')
	})

	afterEach(async () => {
		await zbc.close() // Makes sure we don't forget to close connection
	})

	it('Can start a workflow with a message', async done => {
		const deploy = await zbc.deployWorkflow(
			'./src/__tests__/testdata/Client-MessageStart.bpmn'
		)
		expect(deploy.key).toBeTruthy()

		const randomId = uuid()

		await zbc.publishStartMessage({
			name: 'MSG-START_JOB',
			timeToLive: 1000,
			variables: {
				testKey: randomId,
			},
		})

		await zbc.createWorker(
			'test2',
			'console-log-msg',
			async (job, complete) => {
				complete(job.variables)
				expect(
					job.customHeaders.message.indexOf('Workflow') !== -1
				).toBe(true)
				expect(job.variables.testKey).toBe(randomId) // Makes sure the worker isn't responding to another message
				done()
			}
		)
	})
})