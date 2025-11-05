import { LabBase } from '../utils/labBase.js';

/**
 * Crystal Violet Lab
 */
export class CrystalViolet extends LabBase {
	setupLab() {
		this.addMetadata({
			laboratory: 'Crystal Violet Lab',
			columns: ['Time (s)', 'Absorbance']
		});

		this.exptTime = 1000;
		this.numberOfValues = 501;
		this.noiseLevel = 0.05;
		this.precision = 6;
		this.background = 0.01;

		this.activationEnergy = 63e3; // J/mol
		this.prefactor = 5.9e9; // 1/M/s

		// Order wrt CV and OH
		this.alpha = 1.0;
		this.beta = 0.75;
		this.concToAbs = 160e3; // Absorbivity of CV at 590 nm (L/mol/cm)
		this.stockSolutions = { cv: 2.5e-5, oh: 0.5 }; // mol/L

		this.volumes = { cv: 10, oh: 10, h2o: 10.0 }; // mL
	}

	createData() {
		this.setParameters({
			sample: this.sample,
			number_of_values: this.numberOfValues
		});

		this.addMetadata({
			'Temperature (C)': this.temperature - 273.15,
			'Volume of CV (mL)': this.volumes.cv,
			'Volume of OH (mL)': this.volumes.oh,
			'Volume of H2O (mL)': this.volumes.h2o
		});

		// Calculate total volume with noise
		const vtot =
			Object.values(this.volumes).reduce((sum, v) => sum + v, 0) +
			this.rng.normal(0, this.noiseLevel, 1);

		const initialConcentrationCV = (this.stockSolutions.cv * this.volumes.cv) / vtot;
		const concentrationOH = (this.stockSolutions.oh * this.volumes.oh) / vtot;

		const rateConstant =
			this.prefactor * Math.exp(-this.activationEnergy / (this.R * this.temperature));
		const pseudoRateConstant = rateConstant * Math.pow(concentrationOH, this.beta);

		const params = {
			A: initialConcentrationCV * this.concToAbs,
			k: pseudoRateConstant
		};

		// Exponential decay function
		const expDecay = (x, params) => {
			return params.A * Math.exp(-params.k * x);
		};

		this.data = this.generateDataFromFunction({
			func: expDecay,
			params,
			nvalues: this.numberOfValues,
			xrange: [0, this.exptTime],
			xspacing: 'linear',
			noiseLevel: this.noiseLevel,
			positive: true,
			background: this.background
		});

		return this.data;
	}
}
