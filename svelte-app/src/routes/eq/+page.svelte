<svelte:head>
	<title>Chemical Equilibrium Lab</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-6 py-6">
			<h1 class="text-3xl font-bold text-gray-900">Chemical Equilibrium Lab</h1>
			<p class="mt-2 text-gray-600">Numerical solution of equilibrium problems</p>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-6 py-8">
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 text-gray-900">
			<p class="text-gray-700 leading-relaxed mb-4">
				This lab implements numerical methods to solve chemical equilibrium equations. Choose
				between a basic fixed-reaction solver or a general solver that supports custom reactions.
			</p>

			<details open class="mt-4">
				<summary class="font-semibold text-gray-900 cursor-pointer select-none py-2">
					About the Method
				</summary>
				<p class="text-gray-700 mt-2 ml-4 leading-relaxed">
					The iterative force-based method works by computing the reaction quotient Q and comparing
					it to the equilibrium constant K<sub>eq</sub>. The "force" measures how far the system is
					from equilibrium, and concentrations are adjusted iteratively until Q ≈ K<sub>eq</sub>.
				</p>
			</details>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<a
				href="/eq-basic"
				class="group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all no-underline"
			>
				<h3 class="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors mb-3 text-center">
					Basic Equilibrium Solver
				</h3>
				<p class="text-sm text-gray-600 text-center">
					Fixed reaction: 2A ⇌ B<br />Includes analytic solution for comparison
				</p>
			</a>

			<a
				href="/eq-general"
				class="group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all no-underline"
			>
				<h3 class="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors mb-3 text-center">
					General Equilibrium Solver
				</h3>
				<p class="text-sm text-gray-600 text-center">
					Custom species and stoichiometry<br />Advanced optimization options
				</p>
			</a>
		</div>
	</div>
</div>
