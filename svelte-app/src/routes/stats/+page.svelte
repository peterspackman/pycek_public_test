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

		showResults = true;
	}

	function resetCounter() {
		lab.filenameGen.reset();
		showResults = false;
	}

	function handleDownload() {
		downloadCSV(fileContent, filename);
	}
</script>

<svelte:head>
	<title>Statistics Lab</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-6 py-6">
			<h1 class="text-3xl font-bold text-gray-900">Statistics Lab</h1>
			<p class="mt-2 text-gray-600">Basic statistical concepts and data analysis</p>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-6 py-8">
		<div class="grid lg:grid-cols-2 gap-8 mb-8">
			<div class="space-y-6">
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">About This Lab</h2>
					<p class="text-gray-700 leading-relaxed mb-4">
						This numerical lab covers key statistics topics that are essential for data analysis
						in chemistry. Complete these exercises to prepare for more complex experimental analysis.
					</p>

					<details open class="mt-4">
						<summary class="font-semibold text-gray-900 cursor-pointer select-none py-2">
							Tasks
						</summary>
						<ol class="list-decimal list-inside space-y-2 text-gray-700 mt-2 ml-2">
							<li>Average and standard error</li>
							<li>Propagation of uncertainty</li>
							<li>Comparison of averages</li>
							<li>Linear Fit</li>
							<li>Non linear fit</li>
							<li>Outlier detection</li>
						</ol>
					</details>

					<details class="mt-4">
						<summary class="font-semibold text-gray-900 cursor-pointer select-none py-2">
							Instructions
						</summary>
						<ol class="list-decimal list-inside space-y-2 text-gray-700 mt-2 ml-2">
							<li>Enter your student ID</li>
							<li>Select a task from the list</li>
							<li>Click "Run Experiment" to generate data</li>
							<li>Analyze the data using Python or Excel</li>
						</ol>
					</details>
				</div>
			</div>

			<div>
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
							<label for="sample" class="block text-sm font-medium text-gray-700 mb-1.5">
								Select Task <span class="text-red-500">*</span>
							</label>
							<select
								id="sample"
								bind:value={sample}
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
							>
								<option value={null}>--Select--</option>
								{#each lab.availableSamples as sampleOption}
									<option value={sampleOption}>{sampleOption}</option>
								{/each}
							</select>
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

		{#if showResults}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Results</h2>

				<div class="grid lg:grid-cols-3 gap-6">
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

					<div class="lg:col-span-2">
						<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
							{#if data.length > 0}
								<Plot {data} xLabel="X" yLabel="Y" />
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
