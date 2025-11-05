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

<div class="container">
	<div class="header">
		<h1>General Equilibrium Solver</h1>
		<p class="subtitle">Numerical solution for custom reactions</p>
	</div>

	<div class="card lab-description">
		<p>
			This tool solves arbitrary chemical equilibrium equations using an iterative numerical
			method. You can define custom species names, stoichiometric coefficients, and initial
			concentrations.
		</p>

		<details>
			<summary><strong>How to Use</strong></summary>
			<ol>
				<li>Choose the number of species in your reaction</li>
				<li>Enter species names (e.g., A, B, H+, OH-, etc.)</li>
				<li>Set stoichiometric coefficients (negative for reactants, positive for products)</li>
				<li>Enter initial concentrations for each species</li>
				<li>Set the equilibrium constant and solver parameters</li>
				<li>Click "Solve Equilibrium" to find the equilibrium concentrations</li>
			</ol>
		</details>
	</div>

	<div class="card">
		<h3>Reaction Definition</h3>

		<div class="form-group">
			<label class="form-label" for="nSpecies">Number of species</label>
			<input
				class="form-input"
				id="nSpecies"
				type="number"
				bind:value={nSpecies}
				min="2"
				max="10"
				step="1"
			/>
		</div>

		<div class="equation-display">
			<strong>Reaction:</strong>
			<span class="equation-large">{@html renderLatex(equationLatex)}</span>
		</div>

		<div class="species-grid">
			{#each Array(nSpecies) as _, idx}
				<div class="species-card">
					<h4>Species {idx + 1}</h4>
					<div class="form-group">
						<label class="form-label">Name</label>
						<input class="form-input" type="text" bind:value={species[idx]} />
					</div>
					<div class="form-group">
						<label class="form-label">Stoichiometry</label>
						<input
							class="form-input"
							type="number"
							bind:value={stoichiometry[idx]}
							min="-5"
							max="5"
							step="1"
						/>
					</div>
					<div class="form-group">
						<label class="form-label">[{species[idx]}]<sub>0</sub> (M)</label>
						<input
							class="form-input"
							type="number"
							bind:value={concentrations[idx]}
							min="0.001"
							max="10"
							step="0.01"
						/>
					</div>
				</div>
			{/each}
		</div>

		<h3>Equilibrium Constant</h3>
		<div class="form-group">
			<label class="form-label" for="Keq">K<sub>eq</sub></label>
			<input
				class="form-input"
				id="Keq"
				type="number"
				bind:value={Keq}
				min="0.001"
				max="1000"
				step="0.1"
			/>
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
				<label class="form-label" for="tolerance">Tolerance</label>
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
				<label class="form-label" for="maxIter">Max iterations</label>
				<input
					class="form-input"
					id="maxIter"
					type="number"
					bind:value={maxIterations}
					min="100"
					max="50000"
					step="100"
				/>
			</div>
		</div>

		<h3>Optimization Options</h3>
		<div class="checkbox-group">
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={decreaseDc} />
				<span>Decrease δc when force changes sign</span>
			</label>
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={increaseDc} />
				<span>Increase δc when force keeps same sign</span>
			</label>
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={ensurePositive} />
				<span>Ensure all concentrations remain positive</span>
			</label>
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
				{#each species as name, idx}
					<p><strong>[{name}]<sub>0</sub>:</strong> {concentrations[idx].toFixed(6)} M</p>
				{/each}
				<p>
					<strong>Q<sub>0</sub>:</strong>
					{computeQ(concentrations, stoichiometry).toFixed(6)}
				</p>

				<h4>Final Conditions</h4>
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

	<p style="text-align: center; margin-top: 2rem;">
		<a href="/eq" class="btn btn-outline">← Back to Equilibrium Lab</a>
	</p>
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

	.equation-display {
		background: var(--color-bg-alt);
		padding: 1.5rem;
		border-radius: var(--radius-md);
		margin: 1.5rem 0;
		text-align: center;
	}

	.equation-large {
		display: inline-block;
		font-size: 1.2rem;
		margin-left: 1rem;
	}

	.species-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.species-card {
		background: var(--color-bg-alt);
		padding: 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.species-card h4 {
		margin: 0 0 0.75rem 0;
		color: var(--color-text);
		font-size: 0.9rem;
	}

	.species-card .form-group {
		margin-bottom: 0.75rem;
	}

	.species-card .form-group:last-child {
		margin-bottom: 0;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		color: var(--color-text);
	}

	.checkbox-label input[type='checkbox'] {
		cursor: pointer;
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

	details ol {
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

		.species-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
