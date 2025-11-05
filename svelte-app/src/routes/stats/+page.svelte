<script>
	import { StatisticsLab } from '$lib/labs/StatisticsLab.js';
	import { downloadCSV } from '$lib/utils/csv.js';
	import Plot from '$lib/components/Plot.svelte';

	let lab = new StatisticsLab({ makePlots: true });

	let studentID = '';
	let outputFile = 'Automatic';
	let sample = null;
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
		if (!sample) {
			error = 'No sample selected!';
			return;
		}

		lab.setStudentID(parseInt(studentID));
		lab.outputFile = outputFile === 'Automatic' ? null : outputFile;
		lab.setParameters({ sample });

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
		showResults = false;
		message = '';
	}

	function handleDownload() {
		downloadCSV(fileContent, filename);
	}
</script>

<svelte:head>
	<title>Statistics Lab</title>
</svelte:head>

<div class="container">
	<div class="header">
		<h1>Statistics Lab</h1>
		<p class="subtitle">Basic statistical concepts and data analysis</p>
	</div>

	<div class="card lab-description">
		<p>
			This numerical lab consists a few small tasks, which cover the key statistics topics that
			were introduced in the previous chapter. They are also preparatory for the following labs,
			where you would have to use the same concepts in more complicated situations. In particular,
			if you are using python, it would be beneficial to solve some of this exercises by creating
			specific functions that can the be reused (maybe with small modifications) in the following
			labs.
		</p>

		<details open>
			<summary><strong>Tasks</strong></summary>
			<ol>
				<li>Average and standard error</li>
				<li>Propagation of uncertainty</li>
				<li>Comparison of averages</li>
				<li>Linear Fit</li>
				<li>Non linear fit</li>
				<li>Outlier detection</li>
			</ol>
		</details>

		<details open>
			<summary><strong>Instructions</strong></summary>
			<ol>
				<li>Type your student ID</li>
				<li>Select a task</li>
				<li>Click "Run Experiment"</li>
				<li>Analyse the data</li>
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
			<label class="form-label" for="sample">Select task</label>
			<select class="form-select" id="sample" bind:value={sample}>
				<option value={null}>--Select--</option>
				{#each lab.availableSamples as sampleOption}
					<option value={sampleOption}>{sampleOption}</option>
				{/each}
			</select>
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
					<Plot {data} xLabel="X" yLabel="Y" />
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
