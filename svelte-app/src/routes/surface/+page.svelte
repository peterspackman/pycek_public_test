<script>
	import { SurfaceAdsorption } from '$lib/labs/SurfaceAdsorption.js';
	import { downloadCSV } from '$lib/utils/csv.js';
	import Plot from '$lib/components/Plot.svelte';

	let lab = new SurfaceAdsorption({ makePlots: true });

	let studentID = '';
	let outputFile = 'Automatic';
	let temperature = 25;
	let data = [];
	let message = '';
	let fileContent = '';
	let filename = '';
	let showResults = false;
	let error = '';

	function setID() {
		if (studentID && /^\d+$/.test(studentID)) {
			lab.setStudentID(parseInt(studentID));
			error = '';
		} else if (studentID) {
			error = 'Invalid Student ID: must be a number';
		}
	}

	function setFilename() {
		lab.outputFile = outputFile === 'Automatic' ? null : outputFile;
	}

	function runExperiment() {
		error = '';
		if (!studentID || !/^\d+$/.test(studentID)) {
			error = 'Invalid Student ID: must be a number';
			return;
		}

		lab.setParameters({ temperature: temperature + 273.15 });
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
	<title>Surface Adsorption Lab</title>
</svelte:head>

<div class="container">
	<header class="lab-header">
		<h1>Surface Adsorption Lab</h1>
		<p class="subtitle">Dye adsorption on chitin surface - Langmuir isotherm analysis</p>
	</header>

	<div class="card lab-description">
		<p>
			In this virtual laboratory, we study the adsorption of <strong>Acid Blue 158</strong> dye on
			chitin in water. The experiments simulate different temperature conditions to determine the
			enthalpy of adsorption. The output contains the concentration of dye remaining in solution as
			a function of the amount added.
		</p>

		<details open>
			<summary><strong>Objectives</strong></summary>
			<ol>
				<li>Calculate Langmuir constant (K<sub>L</sub>) and monolayer coverage (Q) at different temperatures</li>
				<li>Compare fitted values from linear and non-linear Langmuir isotherms</li>
				<li>Calculate adsorption enthalpy</li>
				<li>Compare with provided experimental values</li>
			</ol>
		</details>

		<details>
			<summary><strong>Instructions</strong></summary>
			<ol>
				<li>Enter your student ID</li>
				<li>Select experiment temperature</li>
				<li>Click "Run Experiment"</li>
				<li>Repeat at 5 different temperatures for analysis</li>
			</ol>
		</details>
	</div>

	<div class="card">
		<h3 style="margin-top: 0;">Experiment Parameters</h3>

		<div class="form-group">
			<label class="form-label" for="studentID">Student ID</label>
			<input
				class="form-input"
				id="studentID"
				type="text"
				bind:value={studentID}
				on:input={setID}
				placeholder="Enter your student ID"
			/>
		</div>

		<div class="form-group">
			<label class="form-label" for="outputFile">Output Filename</label>
			<input
				class="form-input"
				id="outputFile"
				type="text"
				bind:value={outputFile}
				on:input={setFilename}
				placeholder="Automatic"
			/>
		</div>

		<div class="form-group">
			<label class="form-label" for="temperature">Temperature (°C)</label>
			<input class="form-input" id="temperature" type="number" bind:value={temperature} min="0" max="100" step="1" />
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
		<div class="results-panel">
			<div class="metadata-card">
				<h3>Experiment Results</h3>
				{@html message.replace(/###/g, '').replace(/####/g, '<p>').replace('Running Experiment', '')}
				<button class="btn btn-secondary" on:click={handleDownload} style="margin-top: 1rem;">
					Download {filename}
				</button>
			</div>

			{#if data.length > 0}
				<div class="card">
					<Plot {data} xLabel="Dye added (mg)" yLabel="Dye in solution (mol/L)" />
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.lab-header {
		margin-bottom: 2rem;
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--color-text-secondary);
		margin-top: 0.5rem;
		font-weight: 400;
	}

	.lab-description {
		margin-bottom: 1.5rem;
	}

	details {
		margin-top: 1.5rem;
	}

	summary {
		cursor: pointer;
		padding: 0.5rem 0;
		user-select: none;
	}

	summary:hover {
		color: var(--color-primary);
	}

	details ol {
		margin-top: 0.75rem;
		padding-left: 1.5rem;
	}

	details li {
		margin: 0.5rem 0;
		color: var(--color-text-secondary);
	}
</style>
