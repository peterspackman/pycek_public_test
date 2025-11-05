import { LabBase } from '../utils/labBase.js';

/**
 * Surface Adsorption Lab
 */
export class SurfaceAdsorption extends LabBase {
	setupLab() {
		this.addMetadata({
			laboratory: 'Surface Adsorption Lab',
			columns: ['Dye added (mg)', 'Dye in solution (mol/L)']
		});

		this.volume = 1; // L
		this.minDye = 500; // mg
		this.maxDye = 10000; // mg

		this.sampleParameters = {
			dH: -19.51e3, // J/mol
			dS: -10, // J/mol/K
			Q: 0.0001, // monolayer coverage (mol/m^2)
			molarMass: 584.910641 // g/mol
		};

		this.numberOfValues = 100;
		this.noiseLevel = 0.5e-5;
		this.precision = 10;
	}

	createData() {
		this.setParameters({
			sample: this.sample,
			number_of_values: this.numberOfValues
		});

		this.addMetadata({
			'Temperature (C)': this.temperature - 273.15,
			'Volume (L)': this.volume,
			'Molar mass (g/mol)': this.sampleParameters.molarMass,
			'MinDye (mg)': this.minDye,
			'MaxDye (mg)': this.maxDye,
			'Number of values': this.numberOfValues
		});

		// Langmuir isotherm equilibrium constant
		const lnK =
			(-this.sampleParameters.dH / this.temperature + this.sampleParameters.dS) / this.R;
		const K = Math.exp(lnK); // in L/mol

		const conversionFactor = 1000 * this.sampleParameters.molarMass * this.volume;
		const concRange = [this.minDye / conversionFactor, this.maxDye / conversionFactor];

		// Langmuir isotherm function
		const langmuirFunc = (x, params) => {
			const { K, Q } = params;
			const term1 = x * K - K * Q - 1;
			const term2 = Math.sqrt(term1 * term1 + 4 * x * K);
			return (term1 + term2) / (2 * K);
		};

		this.data = this.generateDataFromFunction({
			func: langmuirFunc,
			params: { K, Q: this.sampleParameters.Q },
			nvalues: this.numberOfValues,
			xrange: concRange,
			xspacing: 'linear',
			noiseLevel: this.noiseLevel,
			positive: true
		});

		// Convert x values back to mg
		this.data = this.data.map(row => [row[0] * conversionFactor, row[1]]);

		return this.data;
	}
}
