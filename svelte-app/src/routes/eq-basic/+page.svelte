<script>
	import { solveEquilibrium, solveBasicAnalytic, computeQ } from '$lib/utils/equilibriumSolver.js';
	import Plot from '$lib/components/Plot.svelte';
	import katex from 'katex';

	let concA = 0.2;
	let concB = 0.1;
	let Keq = 12;
	let dc = 0.001;
	let tolerance = 0.00001;
	let maxIterations = 1000;

	let result = null;
	let analytic = null;
	let error = '';
	let showResults = false;

	// Equation in LaTeX
	const equationLatex = '2\\mathrm{A} \\rightleftharpoons \\mathrm{B}';
	const equilibriumExpression = 'K_{eq} = \\frac{[\\mathrm{B}]}{[\\mathrm{A}]^2}';

	function solve() {
		error = '';
		showResults = false;

		if (concA <= 0 || concB <= 0) {
			error = 'Concentrations must be positive';
			return;
		}
		if (Keq <= 0) {
			error = 'Equilibrium constant must be positive';
			return;
		}
		if (dc <= 0 || dc > 0.1) {
			error = 'Step size must be between 0 and 0.1';
			return;
		}

		// Solve numerically
		result = solveEquilibrium(
			[concA, concB],
			[-2, 1],
			Keq,
			dc,
			tolerance,
			maxIterations,
			{}
		);

		// Solve analytically for comparison
		analytic = solveBasicAnalytic(concA, concB, Keq);

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
	$: concentrationData = result
		? [
				{
					label: '[A]',
					data: result.concentrations.map((c, i) => ({ x: i, y: c[0] })),
					borderColor: '#3b82f6',
					backgroundColor: 'rgba(59, 130, 246, 0.1)'
				},
				{
					label: '[B]',
					data: result.concentrations.map((c, i) => ({ x: i, y: c[1] })),
					borderColor: '#10b981',
					backgroundColor: 'rgba(16, 185, 129, 0.1)'
				}
			]
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
	<title>Basic Equilibrium Lab</title>
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
			<h1 class="text-3xl font-bold text-gray-900">Basic Equilibrium Solver</h1>
			<p class="mt-2 text-gray-600">Numerical solution for 2A ⇌ B</p>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-6 py-8">
		<!-- Description and Setup -->
		<div class="grid lg:grid-cols-2 gap-8 mb-8">
			<!-- Description -->
			<div class="space-y-6">
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-gray-900">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">About This Solver</h2>
					<p class="text-gray-700 leading-relaxed mb-4">
						This tool solves the chemical equilibrium equation using an iterative numerical method.
						The reaction is <span class="inline-block mx-1">{@html renderLatex(equationLatex)}</span
						>, with equilibrium constant
						<span class="inline-block mx-1">{@html renderLatex(equilibriumExpression)}</span>.
					</p>

					<details open class="mt-4">
						<summary class="font-semibold text-gray-900 cursor-pointer select-none py-2">
							Algorithm
						</summary>
						<ol class="list-decimal list-inside space-y-2 text-gray-700 mt-2 ml-2 text-sm">
							<li>
								Compute the reaction quotient: <span class="inline-block mx-1"
									>{@html renderLatex('Q = \\frac{[\\mathrm{B}]}{[\\mathrm{A}]^2}')}</span
								>
							</li>
							<li>
								Compute the "force" (distance from equilibrium): <span class="inline-block mx-1"
									>{@html renderLatex('F = -\\log_{10}(Q) - p K_{eq}')}</span
								>
							</li>
							<li>
								Update concentrations: <span class="inline-block mx-1"
									>{@html renderLatex('[\\mathrm{A}] \\leftarrow [\\mathrm{A}] - 2 \\delta c \\cdot F')}</span
								>,
								<span class="inline-block mx-1"
									>{@html renderLatex('[\\mathrm{B}] \\leftarrow [\\mathrm{B}] + \\delta c \\cdot F')}</span
								>
							</li>
							<li>Repeat until |F| &lt; tolerance</li>
						</ol>
					</details>

					<details class="mt-4">
						<summary class="font-semibold text-gray-900 cursor-pointer select-none py-2">
							Analytic Solution
						</summary>
						<p class="text-gray-700 mt-2 ml-4 leading-relaxed text-sm">
							This specific reaction has an analytic solution. Solving the quadratic equation <span
								class="inline-block mx-1"
								>{@html renderLatex('\\frac{[\\mathrm{B}]_0 + x}{([\\mathrm{A}]_0 - 2x)^2} = K_{eq}')}</span
							>
							gives two roots, one of which is the physical solution.
						</p>
					</details>
				</div>
			</div>

			<!-- Setup -->
			<div>
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-gray-900">
					<h2 class="text-xl font-semibold text-gray-900 mb-6">Solver Setup</h2>

					<h3 class="text-base font-semibold text-gray-900 mb-3">Initial Conditions</h3>
					<div class="grid md:grid-cols-2 gap-4 mb-6">
						<div>
							<label for="concA" class="block text-sm font-medium text-gray-700 mb-1.5">
								[A]<sub>0</sub> (M)
							</label>
							<input
								id="concA"
								type="number"
								bind:value={concA}
								min="0.001"
								max="1"
								step="0.01"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>

						<div>
							<label for="concB" class="block text-sm font-medium text-gray-700 mb-1.5">
								[B]<sub>0</sub> (M)
							</label>
							<input
								id="concB"
								type="number"
								bind:value={concB}
								min="0.001"
								max="1"
								step="0.01"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>

						<div class="md:col-span-2">
							<label for="Keq" class="block text-sm font-medium text-gray-700 mb-1.5">
								K<sub>eq</sub> (Equilibrium constant)
							</label>
							<input
								id="Keq"
								type="number"
								bind:value={Keq}
								min="0.1"
								max="100"
								step="0.1"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>
					</div>

					<h3 class="text-base font-semibold text-gray-900 mb-3">Solver Parameters</h3>
					<div class="grid md:grid-cols-2 gap-4 mb-6">
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
								Convergence tolerance
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

						<div class="md:col-span-2">
							<label for="maxIter" class="block text-sm font-medium text-gray-700 mb-1.5">
								Maximum iterations
							</label>
							<input
								id="maxIter"
								type="number"
								bind:value={maxIterations}
								min="100"
								max="10000"
								step="100"
								class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
							/>
						</div>
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
			</div>
		</div>

		<!-- Results -->
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
								<p><strong>[A]<sub>0</sub>:</strong> {concA.toFixed(6)} M</p>
								<p><strong>[B]<sub>0</sub>:</strong> {concB.toFixed(6)} M</p>
								<p>
									<strong>Q<sub>0</sub>:</strong>
									{computeQ([concA, concB], [-2, 1]).toFixed(6)}
								</p>
							</div>

							<h4 class="text-sm font-semibold opacity-90 mt-4 mb-2">Final Conditions</h4>
							<div class="space-y-1 text-sm">
								<p>
									<strong>[A]<sub>f</sub>:</strong>
									{result.finalConcentrations[0].toFixed(6)} M
								</p>
								<p>
									<strong>[B]<sub>f</sub>:</strong>
									{result.finalConcentrations[1].toFixed(6)} M
								</p>
								<p><strong>Q<sub>f</sub>:</strong> {result.finalQ.toFixed(6)}</p>
								<p><strong>K<sub>eq</sub>:</strong> {Keq.toFixed(6)}</p>
								<p>
									<strong>Error:</strong>
									{((Math.abs(result.finalQ - Keq) / Keq) * 100).toFixed(4)}%
								</p>
							</div>

							{#if analytic}
								<h4 class="text-sm font-semibold opacity-90 mt-4 mb-2">Analytic Solution</h4>
								<div class="space-y-1 text-sm">
									<p>Root 1 (physical): x = {analytic.x0.toFixed(6)}</p>
									<p>Root 2 (unphysical): x = {analytic.x1.toFixed(6)}</p>
									<p>
										<strong>[A]<sub>analytic</sub>:</strong>
										{(concA - 2 * analytic.x0).toFixed(6)} M
									</p>
									<p>
										<strong>[B]<sub>analytic</sub>:</strong>
										{(concB + analytic.x0).toFixed(6)} M
									</p>
								</div>
							{/if}
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
