/**
 * Simple seeded random number generator using mulberry32 algorithm
 */
class Mulberry32 {
	constructor(seed) {
		this.seed = seed >>> 0;
	}

	next() {
		let t = (this.seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	}
}

/**
 * Seeded random number generator compatible with Python's numpy.random
 */
export class SeededRandom {
	constructor(seed = null) {
		this.originalSeed = seed !== null ? seed : 123456789;
		this.seed = this.originalSeed;
		this.rng = new Mulberry32(this.seed);
		this.state = { seed: this.seed };
	}

	/**
	 * Set a new seed
	 */
	setSeed(seed) {
		this.originalSeed = seed;
		this.seed = seed;
		this.rng = new Mulberry32(this.seed);
		this.state = { seed: this.seed };
	}

	/**
	 * Get the current seed
	 */
	getSeed() {
		return this.originalSeed;
	}

	/**
	 * Generate uniform random number between 0 and 1
	 */
	random() {
		return this.rng.next();
	}

	/**
	 * Generate uniform random numbers in a range
	 * @param {number} lower - Lower bound
	 * @param {number} upper - Upper bound
	 * @param {number} n - Number of values to generate
	 * @returns {Array<number>}
	 */
	uniform(lower, upper, n = 1) {
		const result = [];
		for (let i = 0; i < n; i++) {
			result.push(lower + this.rng.next() * (upper - lower));
		}
		return n === 1 ? result[0] : result;
	}

	/**
	 * Generate normally distributed random numbers using Box-Muller transform
	 * @param {number} mean - Mean of the distribution
	 * @param {number} std - Standard deviation
	 * @param {number} n - Number of values to generate
	 * @returns {Array<number>|number}
	 */
	normal(mean = 0, std = 1, n = 1) {
		const result = [];

		for (let i = 0; i < n; i += 2) {
			// Box-Muller transform
			const u1 = this.rng.next();
			const u2 = this.rng.next();

			const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
			const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

			result.push(mean + z0 * std);
			if (i + 1 < n) {
				result.push(mean + z1 * std);
			}
		}

		return n === 1 ? result[0] : result.slice(0, n);
	}

	/**
	 * Generate random integer between min and max (inclusive)
	 */
	randint(min, max) {
		return Math.floor(this.rng.next() * (max - min + 1)) + min;
	}

	/**
	 * Get the state of the RNG (for debugging)
	 */
	getState() {
		return this.state;
	}
}

/**
 * Round values to a specified precision
 * @param {number|Array<number>} values - Value(s) to round
 * @param {number} precision - Number of decimal places
 * @returns {number|Array<number>}
 */
export function roundValues(values, precision = 1) {
	const round = (val) => {
		if (precision < 0) {
			const p = Math.pow(10, -precision);
			return Math.round(val / p) * p;
		}
		return Number(val.toFixed(precision));
	};

	if (Array.isArray(values)) {
		return values.map(round);
	}
	return round(values);
}

/**
 * Sort an array
 */
export function sort(arr) {
	return [...arr].sort((a, b) => a - b);
}

/**
 * Create linearly spaced array
 */
export function linspace(start, stop, num) {
	const step = (stop - start) / (num - 1);
	return Array.from({ length: num }, (_, i) => start + step * i);
}

/**
 * Column stack arrays (similar to numpy.column_stack)
 */
export function columnStack(...arrays) {
	const length = arrays[0].length;
	const result = [];

	for (let i = 0; i < length; i++) {
		const row = arrays.map(arr => arr[i]);
		result.push(row);
	}

	return result;
}
