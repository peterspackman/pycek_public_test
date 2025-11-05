import { LabBase } from '../utils/labBase.js';

/**
 * Bomb Calorimetry Lab
 */
export class BombCalorimetry extends LabBase {
	setupLab() {
		this.addMetadata({
			laboratory: 'Bomb Calorimetry',
			columns: ['Time (s)', 'Temperature (K)']
		});

		this.availableSamples = ['benzoic', 'sucrose', 'naphthalene'];

		this.ignitionTime = 20;
		this.relaxationTime = 3;
		this.numberOfValues = 100;
		this.noiseLevel = 0.1;
		this.precision = 2;

		this.slopeBefore = this.rng.uniform(0, this.noiseLevel, 1) / 3;
		this.slopeAfter = this.rng.uniform(0, this.noiseLevel, 1) / 3;

		this.RT = this.R * this.temperature;

		// Calorimeter constant (J/K)
		this.calorimeterConstant = { value: 10135, std_error: 0.0 };

		this.sampleParameters['co2'] = {
			mM: 44.01,
			dH: -393.51e3 // co2 enthalpy of formation (J/mol/K)
		};

		this.sampleParameters['h2o'] = {
			mM: 18.015,
			dH: -285.83e3 // h2o enthalpy of formation (J/mol/K)
		};

		this.sampleParameters['benzoic'] = {
			mM: 122.123,
			n1: 7,
			n2: 3,
			dn: 7 - 15 / 2,
			dHf: { value: -384.8e3, std_error: 0.5e3 },
			dHc: { value: -3227.26e3, std_error: 0.2e3 }
		};

		this.sampleParameters['sucrose'] = {
			mM: 342.3,
			n1: 12,
			n2: 11,
			dn: 0,
			dHf: { value: -2221.2e3, std_error: 0.2e3 },
			dHc: { value: -5643.4e3, std_error: 1.8e3 }
		};

		this.sampleParameters['naphthalene'] = {
			mM: 128.17,
			n1: 10,
			n2: 4,
			dn: 10 - 12,
			dHf: { value: 77e3, std_error: 10.0e3 },
			dHc: { value: -5160e3, std_error: 20.0e3 }
		};
	}

	createData() {
		if (this.sample === null) {
			throw new Error('Sample not defined');
		}

		const prm = this.sampleParameters[this.sample];

		this.setParameters({
			sample: this.sample,
			number_of_values: this.numberOfValues
		});

		this.mass = this.rng.normal(1000, 100, 1);

		this.addMetadata({
			'Tablet mass (mg)': this.mass,
			'Ignition time (s)': this.ignitionTime,
			Sample: this.sample
		});

		const moles = this.mass / 1000 / prm.mM;

		// Combustion enthalpy
		const DcH =
			prm.n1 * this.sampleParameters['co2'].dH +
			prm.n2 * this.sampleParameters['h2o'].dH -
			prm.dHf.value;

		const dH = DcH * moles;
		const dnrt = moles * this.RT * prm.dn;
		const dU = dH - dnrt;

		const deltaT = -dU / this.calorimeterConstant.value;

		const x = [];
		const y = [];

		let T = this.temperature;
		let dd = 0;

		for (let i = 0; i < this.numberOfValues; i++) {
			if (i < this.ignitionTime) {
				T += this.slopeBefore;
			} else {
				T += this.slopeAfter;
				dd =
					deltaT *
					(1 - Math.exp(-(i - this.ignitionTime) / this.relaxationTime));
			}

			x.push(i);
			y.push(T + dd + this.rng.normal(0, this.noiseLevel, 1));
		}

		this.data = x.map((xi, i) => [this.roundValues([xi], 0)[0], this.roundValues([y[i]])[0]]);

		return this.data;
	}
}
