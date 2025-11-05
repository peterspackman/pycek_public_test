/**
 * Generate random filename similar to Python's TempFilenameGenerator
 */
export class FilenameGenerator {
	constructor() {
		this.counter = 0;
	}

	/**
	 * Generate a random filename
	 */
	get random() {
		const timestamp = Date.now();
		const randomPart = Math.random().toString(36).substring(2, 10);
		this.counter++;
		return `data_${timestamp}_${randomPart}_${this.counter}.csv`;
	}

	/**
	 * Reset the counter
	 */
	reset() {
		this.counter = 0;
	}
}
