import { LabBase } from '../utils/labBase.js';
import { columnStack } from '../utils/random.js';

/**
 * Statistics Lab
 */
export class StatisticsLab extends LabBase {
	setupLab() {
		this.addMetadata({
			laboratory: 'Basic Statistics Lab',
			columns: ['X', 'Y']
		});

		this.numberOfValues = 10;

		this.availableSamples = [
			'Averages',
			'Propagation of uncertainty',
			'Comparison of averages',
			'Linear fit',
			'Non linear fit',
			'Detection of outliers'
		];

		this.sampleParameters['Averages'] = {
			gen_values: [
				[1.0, 0.1],
				[12.0, 2.0]
			],
			expected_value: [1.0, 10.0],
			precision: 3
		};

		this.sampleParameters['Propagation of uncertainty'] = {
			gen_values: [
				[15.0, 1.0],
				[133.0, 2.0]
			],
			precision: 3
		};

		this.sampleParameters['Comparison of averages'] = {
			gen_values: [
				[15.0, 1.0],
				[13.2, 2.0]
			],
			precision: 3
		};

		this.sampleParameters['Linear fit'] = {
			func: (x, params) => params.m * x + params.q,
			gen_values: { m: 12.3, q: 1.0 },
			xrange: [0.0, 10.0],
			expected_value: [11.3, 0.9],
			precision: 3
		};

		this.sampleParameters['Non linear fit'] = {
			nval: 10,
			func: (x, params) => {
				const { E0, K0, Kp, V0 } = params;
				return (
					E0 +
					(K0 * x) / Kp * (Math.pow(V0 / x, Kp) / (Kp - 1) + 1) -
					(K0 * V0) / (Kp - 1)
				);
			},
			gen_values: { E0: -634.2, K0: 12.43, Kp: 4.28, V0: 99.11 },
			xrange: [50, 140],
			precision: 3
		};

		this.sampleParameters['Detection of outliers'] = {
			func: (x, params) => params.m * x + params.q,
			gen_values: { m: 2.3, q: 0.1 },
			xrange: [10.0, 20.0],
			shift: 2,
			precision: 3
		};
	}

	createData() {
		if (this.sample === null) {
			throw new Error('Sample not defined');
		}

		const prm = this.sampleParameters[this.sample];

		this.setParameters({
			number_of_values: this.numberOfValues
		});

		if (prm.precision !== undefined) {
			this.setParameters({ precision: prm.precision });
		}

		if (prm.noise !== undefined) {
			this.setParameters({ noise_level: prm.noise });
		}

		this.addMetadata({
			number_of_values: this.numberOfValues,
			sample: this.sample
		});

		if (prm.expected_value !== undefined) {
			this.addMetadata({ expected_value: prm.expected_value });
		}

		let data;

		if (
			['Averages', 'Propagation of uncertainty', 'Comparison of averages'].includes(
				this.sample
			)
		) {
			data = this.generateNormalRandom(this.numberOfValues, prm.gen_values);
		} else if (this.sample === 'Linear fit') {
			this.noiseLevel = 5;
			data = this.generateDataFromFunction({
				func: prm.func,
				params: prm.gen_values,
				nvalues: this.numberOfValues,
				xrange: prm.xrange,
				noiseLevel: this.noiseLevel
			});
		} else if (this.sample === 'Non linear fit') {
			this.noiseLevel = 5;
			data = this.generateDataFromFunction({
				func: prm.func,
				params: prm.gen_values,
				nvalues: this.numberOfValues,
				xrange: prm.xrange,
				noiseLevel: this.noiseLevel
			});
		} else if (this.sample === 'Detection of outliers') {
			data = this.generateDataFromFunction({
				func: prm.func,
				params: prm.gen_values,
				nvalues: this.numberOfValues,
				xrange: prm.xrange,
				noiseLevel: this.noiseLevel
			});
			const i = this.rng.randint(0, this.numberOfValues - 1);
			data[i][1] += prm.shift;
		}

		this.data = data;
		return data;
	}
}
