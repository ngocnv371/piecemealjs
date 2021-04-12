import { Rng } from '../Rng'

const rng = new Rng()

describe('range', () => {
	test('[0, minOrMax)', () => {
		const items = [];
		const max = 10
		for (let index = 0; index < 1000; index++) {
			items.push(rng.range(10))
		}
		items.sort()
		expect(items[0]).toBeGreaterThanOrEqual(0)
		expect(items[items.length - 1]).toBeLessThan(max)
	})
	test('[minOrMax, max)', () => {
		const items = [];
		const min = 10
		const max = 100
		for (let index = 0; index < 1000; index++) {
			items.push(rng.range(min, max))
		}
		items.sort()
		expect(items[0]).toBeGreaterThanOrEqual(min)
		expect(items[items.length - 1]).toBeLessThan(max)
	})
})