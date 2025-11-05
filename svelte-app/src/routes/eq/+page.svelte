<svelte:head>
	<title>Chemical Equilibrium Lab</title>
</svelte:head>

<div class="container">
	<div class="header">
		<h1>Chemical Equilibrium Lab</h1>
		<p class="subtitle">Numerical solution of equilibrium problems</p>
	</div>

	<div class="card lab-description">
		<p>
			This lab implements numerical methods to solve chemical equilibrium equations. Choose between
			a basic fixed-reaction solver or a general solver that supports custom reactions.
		</p>

		<details open>
			<summary><strong>About the Method</strong></summary>
			<p>
				The iterative force-based method works by computing the reaction quotient Q and comparing
				it to the equilibrium constant K<sub>eq</sub>. The "force" measures how far the system is
				from equilibrium, and concentrations are adjusted iteratively until Q ≈ K<sub>eq</sub>.
			</p>
		</details>
	</div>

	<div class="lab-grid">
		<a href="/eq-basic" class="lab-card">
			<h3>Basic Equilibrium Solver</h3>
			<p>Fixed reaction: 2A ⇌ B<br />Includes analytic solution for comparison</p>
		</a>
		<a href="/eq-general" class="lab-card">
			<h3>General Equilibrium Solver</h3>
			<p>Custom species and stoichiometry<br />Advanced optimization options</p>
		</a>
	</div>

	<p style="text-align: center; margin-top: 2rem;">
		<a href="/" class="btn btn-outline">← Back to Home</a>
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

	details p {
		margin: 0.5rem 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.lab-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.lab-card {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		text-decoration: none;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-sm);
		display: block;
	}

	.lab-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
		text-decoration: none;
		border-color: var(--color-primary);
	}

	.lab-card h3 {
		color: #2c3e50;
		margin: 0 0 10px 0;
		text-align: center;
	}

	.lab-card p {
		color: #666;
		margin: 0;
		font-size: 0.9em;
		text-align: center;
	}
</style>
