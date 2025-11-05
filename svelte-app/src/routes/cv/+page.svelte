<script>
	import { CrystalViolet } from '$lib/labs/CrystalViolet.js';
	import { downloadCSV } from '$lib/utils/csv.js';
	import Plot from '$lib/components/Plot.svelte';

	let lab = new CrystalViolet({ makePlots: true });

	let studentID = '';
	let outputFile = 'Automatic';
	let cvVolume = null;
	let ohVolume = null;
	let h2oVolume = null;
	let temperature = 25;
	let data = [];
	let message = '';
	let fileContent = '';
	let filename = '';
	let showResults = false;
	let error = '';

	function runExperiment() {
		error = '';
		if (!studentID || !/^\d+$/.test(studentID)) {
			error = 'Invalid Student ID: must be a number';
			return;
		}

		lab.setStudentID(parseInt(studentID));
		lab.outputFile = outputFile === 'Automatic' ? null : outputFile;
		lab.setParameters({
			volumes: { cv: cvVolume, oh: ohVolume, h2o: h2oVolume },
			temperature: temperature + 273.15
		});

		data = lab.createDataForLab();
		fileContent = lab.writeDataToString();
		filename = lab.outputFile || lab.filenameGen.random;

		message = `### Running Experiment\n`;
		for (const [k, v] of Object.entries(lab.metadata)) {
			message += `#### ${k} = ${v}\n`;
		}
		message += `#### File created = ${filename}\n`;

		showResults = true;
	}

	function resetCounter() {
		lab.filenameGen.reset();
		lab.outputFile = null;
		showResults = false;
		message = '';
	}

	function handleDownload() {
		downloadCSV(fileContent, filename);
	}
</script>

<svelte:head>
	<title>Crystal Violet Lab</title>
</svelte:head>

<div class="container">
	<div class="header">
		<h1>Crystal Violet Lab</h1>
		<p class="subtitle">
			Chemical kinetics and reaction rates using UV-Vis spectrophotometry
		</p>
	</div>

	<div class="card lab-description">
		<p>
			This notebook mimics a kinetics laboratory experiment, where a UV-Vis spectrophotometer is
			used to measure the absorbance as the reaction between crystal violet and hydroxide proceeds.
			The absorbance versus time data can then be used to determine the rate of the reaction with
			respect to both crystal violet and hydroxide ions.
		</p>

		<details open>
			<summary><strong>Objectives</strong></summary>
			<ol>
				<li>Determine the reaction order with respect to CV</li>
				<li>Determine the reaction order with respect to hydroxide</li>
				<li>Determine the rate constant for the overall reaction</li>
				<li>Determine the activation energy</li>
			</ol>
		</details>

		<details open>
			<summary><strong>Instructions</strong></summary>
			<ol>
				<li>Type your student ID</li>
				<li>Select the volumes of the CV solution, the hydroxide solution and DI water to use</li>
				<li>Select the temperature of the experiment</li>
				<li>Click "Run Experiment"</li>
				<li>
					Perform two sets of at least three experiments each:
					<ul>
						<li>constant [CV] while the [OH<sup>-</sup>] is varied</li>
						<li>constant [OH<sup>-</sup>] while the [CV] is varied</li>
					</ul>
				</li>
				<li>
					Obtain another set of data where the temperature is changed and compute the activation
					energy and pre-exponential factor
				</li>
			</ol>
		</details>
	</div>

	<div class="card">
		<h3>Experiment Parameters</h3>

		<div class="form-group">
			<label class="form-label" for="studentID">Student ID</label>
			<input
				class="form-input"
				id="studentID"
				type="text"
				bind:value={studentID}
				placeholder="Enter student ID"
			/>
		</div>

		<div class="form-group">
			<label class="form-label" for="outputFile">Output filename (optional)</label>
			<input
				class="form-input"
				id="outputFile"
				type="text"
				bind:value={outputFile}
				placeholder="Automatic"
			/>
		</div>

		<div class="form-group">
			<label class="form-label" for="cvVolume">Volume of CV solution (mL)</label>
			<input
				class="form-input"
				id="cvVolume"
				type="number"
				bind:value={cvVolume}
				min="0"
				max="100"
				step="1"
			/>
		</div>

		<div class="form-group">
			<label class="form-label" for="ohVolume">Volume of OH solution (mL)</label>
			<input
				class="form-input"
				id="ohVolume"
				type="number"
				bind:value={ohVolume}
				min="0"
				max="100"
				step="1"
			/>
		</div>

		<div class="form-group">
			<label class="form-label" for="h2oVolume">Volume of DI water (mL)</label>
			<input
				class="form-input"
				id="h2oVolume"
				type="number"
				bind:value={h2oVolume}
				min="0"
				max="100"
				step="1"
			/>
		</div>

		<div class="form-group">
			<label class="form-label" for="temperature">Temperature (°C)</label>
			<input
				class="form-input"
				id="temperature"
				type="number"
				bind:value={temperature}
				min="0"
				max="100"
				step="1"
			/>
		</div>

		{#if error}
			<div class="alert alert-error">{error}</div>
		{/if}

		<div class="btn-group">
			<button class="btn btn-primary" on:click={runExperiment}>Run Experiment</button>
			<button class="btn btn-outline" on:click={resetCounter}>Reset Counter</button>
		</div>
	</div>

	{#if showResults}
		<div class="results-grid">
			<div class="metadata-card">
				<h3>Experiment Summary</h3>
				{#each Object.entries(lab.metadata) as [key, value]}
					<p><strong>{key}:</strong> {value}</p>
				{/each}
				<p><strong>File:</strong> {filename}</p>
				<div style="margin-top: 1.5rem;">
					<button class="btn btn-secondary" on:click={handleDownload}>
						Download Data
					</button>
				</div>
			</div>

			{#if data.length > 0}
				<div class="card">
					<h3>Results Plot</h3>
					<Plot {data} xLabel="Time (s)" yLabel="Absorbance" />
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.header {
		margin-bottom: 2rem;
	}

	.subtitle {
		color: var(--color-text-secondary);
		font-size: 1.1rem;
		margin-top: 0.5rem;
	}

	.lab-description {
		margin-bottom: 2rem;
	}

	.lab-description p:first-child {
		margin-bottom: 1.5rem;
		color: var(--color-text-secondary);
		line-height: 1.7;
	}

	details {
		margin: 1rem 0;
	}

	summary {
		cursor: pointer;
		padding: 0.75rem 0;
		color: var(--color-text);
		user-select: none;
		list-style-position: outside;
	}

	summary:hover {
		color: var(--color-primary);
	}

	details[open] summary {
		margin-bottom: 0.5rem;
	}

	details ol,
	details ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	details li {
		margin: 0.5rem 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	h3 {
		margin-top: 0;
	}
</style>
