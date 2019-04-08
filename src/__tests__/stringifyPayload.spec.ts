import { parsePayload, stringifyPayload } from '../lib/stringifyPayload'

// tslint:disable:object-literal-sort-keys
const jobObject = {
	key: '37274',
	jobHeaders: {
		bpmnProcessId: 'parallel-subtasks',
		elementId: 'ServiceTask_0i7cog1',
		elementInstanceKey: '37270',
		workflowDefinitionVersion: 1,
		workflowInstanceKey: '34027',
		workflowKey: '1',
	},
	customHeaders: {},
	worker: '26fe8907-f518-4f8d-bd75-06acaec3c154',
	retries: 3,
	deadline: '1547595187455',
	payload: {
		jobId: '7ead71d8-30c9-4eda-81e7-f2ada6d7d0da',
		subtaskCount: 200,
		tasksCompleted: null,
	},
	type: 'sub-task',
}

const expectedStringifiedPayload =
	'{"jobId":"7ead71d8-30c9-4eda-81e7-f2ada6d7d0da","subtaskCount":200,"tasksCompleted":null}'

const jobDictionary = {
	key: '37274',
	customHeaders: {},
	worker: '26fe8907-f518-4f8d-bd75-06acaec3c154',
	retries: 3,
	deadline: '1547595187455',
	payload:
		'{"jobId":"7ead71d8-30c9-4eda-81e7-f2ada6d7d0da","subtaskCount":200,"tasksCompleted":null}',
	type: 'sub-task',
}

describe('stringifyPayload', () => {
	it('returns a new object', () => {
		expect(stringifyPayload(jobObject)).not.toEqual(jobObject)
	})

	it('stringifies the payload key of a job object', () => {
		const stringified = stringifyPayload(jobObject)
		expect(typeof stringified.payload).toBe('string')
		expect(stringified.payload).toBe(expectedStringifiedPayload)
	})
})

describe('parsePayload', () => {
	it('returns a new object', () => {
		expect(parsePayload(jobDictionary)).not.toEqual(jobDictionary)
	})

	it('parses the payload key of a job object to JSON', () => {
		expect(typeof parsePayload(jobDictionary).payload).toBe('object')
	})

	it('correctly parses the payload string', () => {
		const parsed = parsePayload(jobDictionary)
		expect(parsed.payload.jobId).toEqual(
			'7ead71d8-30c9-4eda-81e7-f2ada6d7d0da'
		)
		expect(parsed.payload.subtaskCount).toEqual(200)
		expect(parsed.payload.tasksCompleted).toBeNull()
		expect(Object.keys(parsed.payload).length).toBe(3)
	})

	it('returns an object with all the keys of the original', () => {
		const parsed = parsePayload(jobDictionary)
		expect(Object.keys(parsed).length).toBe(7)
		expect(parsed.key).toBe('37274')
		expect(parsed.worker).toBe('26fe8907-f518-4f8d-bd75-06acaec3c154')
	})
})
