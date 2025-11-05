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

<div class="container">
	<div class="header">
		<h1>Basic Equilibrium Solver</h1>
		<p class="subtitle">Numerical solution for 2A ⇌ B</p>
	</div>

	<div class="card lab-description">
		<p>
			This tool solves the chemical equilibrium equation using an iterative numerical method. The
			reaction is <span class="equation">{@html renderLatex(equationLatex)}</span>, with equilibrium
			constant <span class="equation">{@html renderLatex(equilibriumExpression)}</span>.
		</p>

		<details open>
			<summary><strong>Algorithm</strong></summary>
			<ol>
				<li>
					Compute the reaction quotient: <span class="equation"
						>{@html renderLatex('Q = \\frac{[\\mathrm{B}]}{[\\mathrm{A}]^2}')}</span
					>
				</li>
				<li>
					Compute the "force" (distance from equilibrium): <span class="equation"
						>{@html renderLatex('F = -\\log_{10}(Q) - p K_{eq}')}</span
					>
				</li>
				<li>
					Update concentrations: <span class="equation"
						>{@html renderLatex('[\\mathrm{A}] \\leftarrow [\\mathrm{A}] - 2 \\delta c \\cdot F')}</span
					>,
					<span class="equation"
						>{@html renderLatex('[\\mathrm{B}] \\leftarrow [\\mathrm{B}] + \\delta c \\cdot F')}</span
					>
				</li>
				<li>Repeat until |F| &lt; tolerance</li>
			</ol>
		</details>

		<details>
			<summary><strong>Analytic Solution</strong></summary>
			<p>
				This specific reaction has an analytic solution. Solving the quadratic equation <span
					class="equation"
					>{@html renderLatex('\\frac{[\\mathrm{B}]_0 + x}{([\\mathrm{A}]_0 - 2x)^2} = K_{eq}')}</span
				>
				gives two roots, one of which is the physical solution.
			</p>
		</details>
	</div>

	<div class="card">
		<h3>Initial Conditions</h3>

		<div class="form-grid">
			<div class="form-group">
				<label class="form-label" for="concA"
					>[A]<sub>0</sub> (Initial concentration of A)</label
				>
				<input
					class="form-input"
					id="concA"
					type="number"
					bind:value={concA}
					min="0.001"
					max="1"
					step="0.01"
				/>
			</div>

			<div class="form-group">
				<label class="form-label" for="concB"
					>[B]<sub>0</sub> (Initial concentration of B)</label
				>
				<input
					class="form-input"
					id="concB"
					type="number"
					bind:value={concB}
					min="0.001"
					max="1"
					step="0.01"
				/>
			</div>

			<div class="form-group">
				<label class="form-label" for="Keq"
					>K<sub>eq</sub> (Equilibrium constant)</label
				>
				<input
					class="form-input"
					id="Keq"
					type="number"
					bind:value={Keq}
					min="0.1"
					max="100"
					step="0.1"
				/>
			</div>
		</div>

		<h3>Solver Parameters</h3>

		<div class="form-grid">
			<div class="form-group">
				<label class="form-label" for="dc">δc (Step size)</label>
				<input
					class="form-input"
					id="dc"
					type="number"
					bind:value={dc}
					min="0.0001"
					max="0.1"
					step="0.001"
				/>
			</div>

			<div class="form-group">
				<label class="form-label" for="tolerance">Convergence tolerance</label>
				<input
					class="form-input"
					id="tolerance"
					type="number"
					bind:value={tolerance}
					min="0.000001"
					max="0.001"
					step="0.000001"
				/>
			</div>

			<div class="form-group">
				<label class="form-label" for="maxIter">Maximum iterations</label>
				<input
					class="form-input"
					id="maxIter"
					type="number"
					bind:value={maxIterations}
					min="100"
					max="10000"
					step="100"
				/>
			</div>
		</div>

		{#if error}
			<div class="alert alert-error">{error}</div>
		{/if}

		<div class="btn-group">
			<button class="btn btn-primary" on:click={solve}>Solve Equilibrium</button>
		</div>
	</div>

	{#if showResults && result}
		<div class="results-section">
			<div class="metadata-card">
				<h3>Solution Summary</h3>

				{#if result.converged}
					<p class="success-message">✓ Converged in {result.iterations} iterations</p>
				{:else}
					<p class="error-message">✗ Did not converge (max iterations reached)</p>
				{/if}

				<h4>Initial Conditions</h4>
				<p><strong>[A]<sub>0</sub>:</strong> {concA.toFixed(6)} M</p>
				<p><strong>[B]<sub>0</sub>:</strong> {concB.toFixed(6)} M</p>
				<p>
					<strong>Q<sub>0</sub>:</strong>
					{computeQ([concA, concB], [-2, 1]).toFixed(6)}
				</p>

				<h4>Final Conditions</h4>
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
					{(Math.abs(result.finalQ - Keq) / Keq * 100).toFixed(4)}%
				</p>

				{#if analytic}
					<h4>Analytic Solution</h4>
					<p>Root 1: x = {analytic.x0.toFixed(6)}</p>
					<p>Root 2: x = {analytic.x1.toFixed(6)}</p>
					<p>
						<strong>[A]<sub>analytic</sub>:</strong>
						{(concA - 2 * analytic.x1).toFixed(6)} M
					</p>
					<p>
						<strong>[B]<sub>analytic</sub>:</strong>
						{(concB + analytic.x1).toFixed(6)} M
					</p>
				{/if}
			</div>

			<div class="plots-container">
				<div class="card">
					<h3>Concentration vs Iteration</h3>
					<Plot data={concentrationData} xLabel="Iteration" yLabel="Concentration (M)" />
				</div>

				<div class="card">
					<h3>Force vs Iteration (log scale)</h3>
					<Plot data={forceData} xLabel="Iteration" yLabel="|Force|" yAxisType="logarithmic" />
				</div>
			</div>
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

	.lab-description p {
		margin-bottom: 1.5rem;
		color: var(--color-text-secondary);
		line-height: 1.7;
	}

	.equation {
		display: inline-block;
		margin: 0 0.25rem;
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

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	h4 {
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.95rem;
	}

	.results-section {
		margin-top: 2rem;
	}

	.metadata-card h4:first-of-type {
		margin-top: 0.5rem;
	}

	.metadata-card p {
		margin: 0.35rem 0;
		font-size: 0.9rem;
	}

	.success-message {
		color: #86efac;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.error-message {
		color: #fca5a5;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.plots-container {
		margin-top: 1.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1.5rem;
	}

	@media (max-width: 768px) {
		.plots-container {
			grid-template-columns: 1fr;
		}
	}
</style>
