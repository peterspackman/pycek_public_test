import { SeededRandom, roundValues, sort, linspace, columnStack } from './random.js';
import { FilenameGenerator } from './filename.js';
import { generateCSV } from './csv.js';

/**
 * Base class for all lab experiments
 */
export class LabBase {
	constructor(kwargs = {}) {
		this.studentID = 123456789;
		this.noiseLevel = 1;
		this.precision = 1;

		this.availableSamples = [];
		this.sampleParameters = {};
		this.sample = null;

		this.R = 8.314; // Gas constant J/(mol·K)
		this.NA = 6.022e23; // Avogadro's number
		this.temperature = 298; // K

		this.numberOfValues = 10;
		this.outputFile = null;
		this.filenameGen = new FilenameGenerator();

		this.metadata = {
			student_ID: this.studentID,
			number_of_values: this.numberOfValues,
			output_file: this.outputFile
		};

		this.makePlots = false;
		this.data = [];

		// Apply any custom kwargs
		Object.assign(this, kwargs);

		// Initialize random number generator
		this.rng = new SeededRandom(this.studentID);

		// Setup lab-specific parameters
		this.setupLab();
	}

	/**
	 * Set the student ID and reseed the RNG
	 */
	setStudentID(studentID) {
		if (typeof studentID === 'string') {
			studentID = studentID.trim();
			if (/^\d+$/.test(studentID)) {
				this.studentID = parseInt(studentID);
			} else {
				throw new Error('student_ID must be an integer');
			}
		} else if (typeof studentID === 'number') {
			this.studentID = studentID;
		} else {
			throw new Error('student_ID must be an integer');
		}

		this.rng.setSeed(this.studentID);
		this.updateMetadataFromAttr();
	}

	/**
	 * Set parameters for the lab
	 */
	setParameters(params = {}) {
		for (const [key, value] of Object.entries(params)) {
			if (key === 'student_ID' || key === 'studentID') {
				this.setStudentID(value);
			} else {
				this[key] = value;
			}
		}
		this.updateMetadataFromAttr();
	}

	/**
	 * Add metadata
	 */
	addMetadata(newMetadata) {
		Object.assign(this.metadata, newMetadata);
	}

	/**
	 * Update metadata from object attributes
	 */
	updateMetadataFromAttr() {
		for (const key of Object.keys(this.metadata)) {
			if (key in this) {
				this.metadata[key] = this[key];
			}
		}
	}

	/**
	 * Round values to the precision level
	 */
	roundValues(values, precision = null) {
		if (precision === null) {
			precision = this.precision;
		}
		return roundValues(values, precision);
	}

	/**
	 * Generate uniform random numbers
	 */
	generateUniformRandom(lower, upper, n) {
		return this.roundValues(this.rng.uniform(lower, upper, n));
	}

	/**
	 * Generate normal random numbers
	 */
	generateNormalRandom(n, params) {
		const results = [];

		for (const [mean, std] of params) {
			const values = this.rng.normal(mean, std, n);
			results.push(this.roundValues(values));
		}

		if (params.length === 1) {
			return results[0];
		}
		return columnStack(...results);
	}

	/**
	 * Generate noise
	 */
	generateNoise(n, noiseLevel = null) {
		if (noiseLevel === null) {
			noiseLevel = this.noiseLevel;
		}
		if (noiseLevel <= 0) {
			return Array(n).fill(0);
		}
		return this.rng.normal(0, noiseLevel, n);
	}

	/**
	 * Generate data from a function
	 */
	generateDataFromFunction({
		func,
		params,
		nvalues,
		xrange,
		xspacing = 'random',
		noiseLevel = null,
		background = null,
		positive = false
	}) {
		// Validate inputs
		if (!xrange) {
			throw new Error('xrange must be provided as [min, max]');
		}

		if (!Number.isInteger(nvalues) || nvalues <= 0) {
			throw new Error('nvalues must be a positive integer');
		}

		// Generate x values
		let x;
		if (xspacing === 'linear') {
			x = linspace(xrange[0], xrange[1], nvalues);
		} else if (xspacing === 'random') {
			x = sort(this.generateUniformRandom(xrange[0], xrange[1], nvalues));
		} else {
			throw new Error(`xspacing must be 'linear' or 'random', got '${xspacing}'`);
		}

		// Generate base y values from function
		let y = x.map(xi => func(xi, params));

		// Add optional modifications
		if (background !== null) {
			y = y.map(yi => yi + background);
		}

		if (noiseLevel !== null) {
			const noise = this.generateNoise(nvalues, noiseLevel);
			y = y.map((yi, i) => yi + noise[i]);
		}

		if (positive) {
			const eps = Math.pow(10.0, -this.precision);
			y = y.map(yi => Math.max(eps, Math.abs(yi)));
		}

		y = this.roundValues(y);

		return columnStack(x, y);
	}

	/**
	 * Create data for the lab
	 */
	createDataForLab(seedLocal = null) {
		if (seedLocal === null) {
			seedLocal = this.rng.randint(1, 999999);
		}
		this.addMetadata({ sample_ID: seedLocal });
		this.rng.setSeed(seedLocal);
		const data = this.createData();
		return data;
	}

	/**
	 * Write data to string (CSV format)
	 */
	writeDataToString() {
		const columns = this.metadata.columns || [];
		return generateCSV(this.data, columns, this.metadata);
	}

	/**
	 * Get data
	 */
	getData() {
		return this.data;
	}

	/**
	 * Get metadata
	 */
	getMetadata() {
		return this.metadata;
	}

	/**
	 * Setup lab - to be overridden by subclasses
	 */
	setupLab() {
		throw new Error('setupLab() must be implemented by subclass');
	}

	/**
	 * Create data - to be overridden by subclasses
	 */
	createData() {
		throw new Error('createData() must be implemented by subclass');
	}
}
