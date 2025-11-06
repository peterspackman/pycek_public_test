<script>
	import { solveEquilibrium, computeQ, formatEquationLatex } from '$lib/utils/equilibriumSolver.js';
	import Plot from '$lib/components/Plot.svelte';
	import katex from 'katex';

	let nSpecies = 2;
	let species = ['A', 'B'];
	let stoichiometry = [-1, 1];
	let concentrations = [0.1, 0.1];
	let Keq = 12;
	let dc = 0.001;
	let tolerance = 0.00001;
	let maxIterations = 1000;

	// Optimization options
	let decreaseDc = false;
	let increaseDc = false;
	let ensurePositive = false;

	let result = null;
	let error = '';
	let showResults = false;

	$: {
		// When number of species changes, update arrays
		if (species.length !== nSpecies) {
			species = Array.from({ length: nSpecies }, (_, i) =>
				i < species.length ? species[i] : String.fromCharCode(65 + i)
			);
			stoichiometry = Array.from({ length: nSpecies }, (_, i) =>
				i < stoichiometry.length ? stoichiometry[i] : i === 0 ? -1 : 1
			);
			concentrations = Array.from({ length: nSpecies }, (_, i) =>
				i < concentrations.length ? concentrations[i] : 0.1
			);
		}
	}

	$: equationLatex = formatEquationLatex(species, stoichiometry);

	function solve() {
		error = '';
		showResults = false;

		// Validation
		if (concentrations.some((c) => c <= 0)) {
			error = 'All concentrations must be positive';
			return;
		}
		if (Keq <= 0) {
			error = 'Equilibrium constant must be positive';
			return;
		}
		if (!stoichiometry.some((s) => s < 0) || !stoichiometry.some((s) => s > 0)) {
			error = 'Must have at least one reactant (negative) and one product (positive)';
			return;
		}

		// Solve numerically
		result = solveEquilibrium(
			concentrations,
			stoichiometry,
			Keq,
			dc,
			tolerance,
			maxIterations,
			{ decreaseDc, increaseDc, ensurePositive }
		);

		showResults = true;
	}

	function renderLatex(latex) {
		try {
			return katex.renderToString(latex, { throwOnError: false });
		} catch (e) {
			return latex;
		}
	}

	// Prepare plot data
	$: concentrationData =
		result && result.concentrations
			? species.map((name, idx) => ({
					label: `[${name}]`,
					data: result.concentrations.map((c, i) => ({ x: i, y: c[idx] })),
					borderColor: `hsl(${(idx * 360) / species.length}, 70%, 50%)`,
					backgroundColor: `hsla(${(idx * 360) / species.length}, 70%, 50%, 0.1)`
				}))
			: [];

	$: forceData = result
		? [
				{
					label: 'Force',
					data: result.forces.map((f, i) => ({ x: i, y: Math.abs(f) })),
					borderColor: '#ef4444',
					backgroundColor: 'rgba(239, 68, 68, 0.1)'
				}
			]
		: [];
</script>

<svelte:head>
	<title>General Equilibrium Lab</title>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
		integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-6 py-6">
			<h1 class="text-3xl font-bold text-gray-900">General Equilibrium Solver</h1>
			<p class="mt-2 text-gray-600">Numerical solution for custom reactions</p>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-6 py-8">
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 text-gray-900">
			<p class="text-gray-700 leading-relaxed mb-4">
				This tool solves arbitrary chemical equilibrium equations using an iterative numerical
				method. You can define custom species names, stoichiometric coefficients, and initial
				concentrations.
			</p>

			<details class="mt-4">
				<summary class="font-semibold text-gray-900 cursor-pointer select-none py-2">
					How to Use
				</summary>
				<ol class="list-decimal list-inside space-y-2 text-gray-700 mt-2 ml-2 text-sm">
					<li>Choose the number of species in your reaction</li>
					<li>Enter species names (e.g., A, B, H+, OH-, etc.)</li>
					<li>Set stoichiometric coefficients (negative for reactants, positive for products)</li>
					<li>Enter initial concentrations for each species</li>
					<li>Set the equilibrium constant and solver parameters</li>
					<li>Click "Solve Equilibrium" to find the equilibrium concentrations</li>
				</ol>
			</details>
		</div>

		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 text-gray-900">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">Reaction Setup</h2>

			<div class="mb-6">
				<label for="nSpecies" class="block text-sm font-medium text-gray-700 mb-1.5">
					Number of species
				</label>
				<input
					id="nSpecies"
					type="number"
					bind:value={nSpecies}
					min="2"
					max="10"
					step="1"
					class="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
				/>
			</div>

			<div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
				<span class="font-medium text-gray-900">Reaction:</span>
				<span class="inline-block ml-2 text-lg">{@html renderLatex(equationLatex)}</span>
			</div>

			<h3 class="text-base font-semibold text-gray-900 mb-4">Species Configuration</h3>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
				{#each Array(nSpecies) as _, idx}
					<div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
						<h4 class="text-sm font-semibold text-gray-900 mb-3">Species {idx + 1}</h4>
						<div class="space-y-3">
							<div>
								<label for="species-{idx}" class="block text-xs font-medium text-gray-700 mb-1">
									Name
								</label>
								<input
									id="species-{idx}"
									type="text"
									bind:value={species[idx]}
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
								/>
							</div>
							<div>
								<label for="stoich-{idx}" class="block text-xs font-medium text-gray-700 mb-1">
									Stoichiometry
								</label>
								<input
									id="stoich-{idx}"
									type="number"
									bind:value={stoichiometry[idx]}
									min="-5"
									max="5"
									step="1"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
								/>
							</div>
							<div>
								<label for="conc-{idx}" class="block text-xs font-medium text-gray-700 mb-1">
									[{species[idx]}]<sub>0</sub> (M)
								</label>
								<input
									id="conc-{idx}"
									type="number"
									bind:value={concentrations[idx]}
									min="0.001"
									max="10"
									step="0.01"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
								/>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<h3 class="text-base font-semibold text-gray-900 mb-3">Equilibrium Constant</h3>
			<div class="mb-6">
				<label for="Keq" class="block text-sm font-medium text-gray-700 mb-1.5">
					K<sub>eq</sub>
				</label>
				<input
					id="Keq"
					type="number"
					bind:value={Keq}
					min="0.001"
					max="1000"
					step="0.1"
					class="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
				/>
			</div>

			<h3 class="text-base font-semibold text-gray-900 mb-3">Solver Parameters</h3>
			<div class="grid md:grid-cols-3 gap-4 mb-6">
				<div>
					<label for="dc" class="block text-sm font-medium text-gray-700 mb-1.5">
						δc (Step size)
					</label>
					<input
						id="dc"
						type="number"
						bind:value={dc}
						min="0.0001"
						max="0.1"
						step="0.001"
						class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
					/>
				</div>

				<div>
					<label for="tolerance" class="block text-sm font-medium text-gray-700 mb-1.5">
						Tolerance
					</label>
					<input
						id="tolerance"
						type="number"
						bind:value={tolerance}
						min="0.000001"
						max="0.001"
						step="0.000001"
						class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
					/>
				</div>

				<div>
					<label for="maxIter" class="block text-sm font-medium text-gray-700 mb-1.5">
						Max iterations
					</label>
					<input
						id="maxIter"
						type="number"
						bind:value={maxIterations}
						min="100"
						max="50000"
						step="100"
						class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
					/>
				</div>
			</div>

			<h3 class="text-base font-semibold text-gray-900 mb-3">Optimization Options</h3>
			<div class="space-y-2 mb-6">
				<label class="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
					<input type="checkbox" bind:checked={decreaseDc} class="cursor-pointer" />
					<span>Decrease δc when force changes sign</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
					<input type="checkbox" bind:checked={increaseDc} class="cursor-pointer" />
					<span>Increase δc when force keeps same sign</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
					<input type="checkbox" bind:checked={ensurePositive} class="cursor-pointer" />
					<span>Ensure all concentrations remain positive</span>
				</label>
			</div>

			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
					{error}
				</div>
			{/if}

			<button
				on:click={solve}
				class="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors"
			>
				Solve Equilibrium
			</button>
		</div>

		{#if showResults && result}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-gray-900">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Results</h2>

				<div class="grid lg:grid-cols-3 gap-6">
					<!-- Summary -->
					<div class="lg:col-span-1">
						<div class="bg-amber-600 text-white rounded-lg p-6">
							<h3 class="font-semibold text-lg mb-4">Solution Summary</h3>

							{#if result.converged}
								<p class="text-green-200 font-medium mb-4">
									✓ Converged in {result.iterations} iterations
								</p>
							{:else}
								<p class="text-red-200 font-medium mb-4">
									✗ Did not converge (max iterations reached)
								</p>
							{/if}

							<h4 class="text-sm font-semibold opacity-90 mt-4 mb-2">Initial Conditions</h4>
							<div class="space-y-1 text-sm">
								{#each species as name, idx}
									<p><strong>[{name}]<sub>0</sub>:</strong> {concentrations[idx].toFixed(6)} M</p>
								{/each}
								<p>
									<strong>Q<sub>0</sub>:</strong>
									{computeQ(concentrations, stoichiometry).toFixed(6)}
								</p>
							</div>

							<h4 class="text-sm font-semibold opacity-90 mt-4 mb-2">Final Conditions</h4>
							<div class="space-y-1 text-sm">
								{#each species as name, idx}
									<p>
										<strong>[{name}]<sub>f</sub>:</strong>
										{result.finalConcentrations[idx].toFixed(6)} M
									</p>
								{/each}
								<p><strong>Q<sub>f</sub>:</strong> {result.finalQ.toFixed(6)}</p>
								<p><strong>K<sub>eq</sub>:</strong> {Keq.toFixed(6)}</p>
								<p>
									<strong>Error:</strong>
									{((Math.abs(result.finalQ - Keq) / Keq) * 100).toFixed(4)}%
								</p>
							</div>
						</div>
					</div>

					<!-- Plots -->
					<div class="lg:col-span-2 space-y-6">
						<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
							<h3 class="text-base font-semibold text-gray-900 mb-3">Concentration vs Iteration</h3>
							{#if concentrationData.length > 0}
								<Plot data={concentrationData} xLabel="Iteration" yLabel="Concentration (M)" />
							{/if}
						</div>

						<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
							<h3 class="text-base font-semibold text-gray-900 mb-3">
								Force vs Iteration (log scale)
							</h3>
							{#if forceData.length > 0}
								<Plot
									data={forceData}
									xLabel="Iteration"
									yLabel="|Force|"
									yAxisType="logarithmic"
								/>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
