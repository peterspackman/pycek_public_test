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

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-6 py-6">
			<h1 class="text-3xl font-bold text-gray-900">Crystal Violet Lab</h1>
			<p class="mt-2 text-gray-600">Chemical kinetics and reaction rates using UV-Vis spectrophotometry</p>
		</div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-6 py-8">
		<!-- Two Column Layout -->
		<div class="grid lg:grid-cols-2 gap-8 mb-8">
			<!-- Left: Information -->
			<div class="space-y-6">
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-gray-900">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">About This Experiment</h2>
					<p class="text-gray-700 leading-relaxed mb-4">
						This experiment measures the kinetics of the reaction between crystal violet and hydroxide ions.
						By monitoring absorbance versus time, you can determine reaction orders and rate constants.
					</p>

					<details open class="mt-4">
						<summary class="font-semibold text-gray-900 cursor-pointer select-none py-2">
							Objectives
						</summary>
						<ol class="list-decimal list-inside space-y-2 text-gray-700 mt-2 ml-2">
							<li>Determine the reaction order with respect to CV</li>
							<li>Determine the reaction order with respect to hydroxide</li>
							<li>Determine the rate constant for the overall reaction</li>
							<li>Determine the activation energy</li>
						</ol>
					</details>

					<details class="mt-4">
						<summary class="font-semibold text-gray-900 cursor-pointer select-none py-2">
							Instructions
						</summary>
						<ol class="list-decimal list-inside space-y-2 text-gray-700 mt-2 ml-2">
							<li>Enter your student ID</li>
							<li>Set the volumes of CV solution, OH solution, and DI water</li>
							<li>Set the temperature of the experiment</li>
							<li>Click "Run Experiment"</li>
							<li>Perform two sets of at least three experiments each (constant [CV] and constant [OH⁻])</li>
							<li>Obtain data at different temperatures for activation energy</li>
						</ol>
					</details>
				</div>
			</div>

			<!-- Right: Experiment Controls -->
			<div>
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-gray-900">
					<h2 class="text-xl font-semibold text-gray-900 mb-6">Experiment Setup</h2>

					<div class="space-y-4">
						<div>
							<label for="studentID" class="block text-sm font-medium text-gray-700 mb-1.5">
								Student ID <span class="text-red-500">*</span>
							</label>
							<input
								id="studentID"
								type="text"
								bind:value={studentID}
								placeholder="Enter student ID"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>

						<div>
							<label for="cvVolume" class="block text-sm font-medium text-gray-700 mb-1.5">
								Volume of CV solution (mL)
							</label>
							<input
								id="cvVolume"
								type="number"
								bind:value={cvVolume}
								min="0"
								max="100"
								step="1"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>

						<div>
							<label for="ohVolume" class="block text-sm font-medium text-gray-700 mb-1.5">
								Volume of OH solution (mL)
							</label>
							<input
								id="ohVolume"
								type="number"
								bind:value={ohVolume}
								min="0"
								max="100"
								step="1"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>

						<div>
							<label for="h2oVolume" class="block text-sm font-medium text-gray-700 mb-1.5">
								Volume of DI water (mL)
							</label>
							<input
								id="h2oVolume"
								type="number"
								bind:value={h2oVolume}
								min="0"
								max="100"
								step="1"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>

						<div>
							<label for="temperature" class="block text-sm font-medium text-gray-700 mb-1.5">
								Temperature (°C)
							</label>
							<input
								id="temperature"
								type="number"
								bind:value={temperature}
								min="0"
								max="100"
								step="1"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>

						<div>
							<label for="outputFile" class="block text-sm font-medium text-gray-700 mb-1.5">
								Output Filename (optional)
							</label>
							<input
								id="outputFile"
								type="text"
								bind:value={outputFile}
								placeholder="Automatic"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>

						{#if error}
							<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
								{error}
							</div>
						{/if}

						<div class="flex gap-3 pt-4">
							<button
								on:click={runExperiment}
								class="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors"
							>
								Run Experiment
							</button>
							<button
								on:click={resetCounter}
								class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
							>
								Reset
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Results Section (Full Width) -->
		{#if showResults}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-gray-900">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Results</h2>

				<div class="grid lg:grid-cols-3 gap-6">
					<!-- Metadata -->
					<div class="lg:col-span-1">
						<div class="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg p-6">
							<h3 class="font-semibold text-lg mb-4">Experiment Summary</h3>
							<div class="space-y-2 text-sm">
								{#each Object.entries(lab.metadata) as [key, value]}
									<div class="flex justify-between">
										<span class="opacity-90">{key}:</span>
										<span class="font-medium">{value}</span>
									</div>
								{/each}
								<div class="flex justify-between border-t border-white/20 pt-2 mt-2">
									<span class="opacity-90">File:</span>
									<span class="font-medium text-xs">{filename}</span>
								</div>
							</div>
							<button
								on:click={handleDownload}
								class="w-full mt-4 bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors"
							>
								Download Data
							</button>
						</div>
					</div>

					<!-- Plot -->
					<div class="lg:col-span-2">
						<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
							{#if data.length > 0}
								<Plot {data} xLabel="Time (s)" yLabel="Absorbance" />
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
