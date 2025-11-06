<svelte:head>
	<title>Chemical Energetics and Kinetics Virtual Notebook</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-6 py-8">
			<h1 class="text-4xl font-bold text-gray-900">Chemical Energetics and Kinetics</h1>
			<p class="mt-2 text-gray-600">Virtual laboratory notebooks for CHEM2000</p>
		</div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-6 py-8">
		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Labs Section (2/3 width) -->
			<div class="lg:col-span-2 space-y-6">
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 class="text-2xl font-semibold text-gray-900 mb-6">Laboratory Experiments</h2>

					<div class="grid md:grid-cols-2 gap-4">
						<a
							href="/stats"
							class="group bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all no-underline"
						>
							<h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
								Statistics Lab
							</h3>
							<p class="text-sm text-gray-600 mb-1">
								Basic statistical concepts and data analysis
							</p>
							<p class="text-xs text-gray-500">Week 2</p>
						</a>

						<a
							href="/bc"
							class="group bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all no-underline"
						>
							<h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
								Bomb Calorimetry Lab
							</h3>
							<p class="text-sm text-gray-600 mb-1">
								Thermodynamics and heat measurements
							</p>
							<p class="text-xs text-gray-500">Week 4</p>
						</a>

						<a
							href="/cv"
							class="group bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all no-underline"
						>
							<h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
								Crystal Violet Lab
							</h3>
							<p class="text-sm text-gray-600 mb-1">
								Chemical kinetics and reaction rates
							</p>
							<p class="text-xs text-gray-500">Week 8</p>
						</a>

						<a
							href="/eq"
							class="group bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all no-underline"
						>
							<h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
								Chemical Equilibrium Lab
							</h3>
							<p class="text-sm text-gray-600 mb-1">
								Numerical solution of equilibrium problems
							</p>
							<p class="text-xs text-gray-500">Week 10</p>
						</a>

						<a
							href="/surface"
							class="group bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all no-underline"
						>
							<h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
								Surface Adsorption Lab
							</h3>
							<p class="text-sm text-gray-600 mb-1">
								Langmuir isotherm and surface chemistry
							</p>
							<p class="text-xs text-gray-500">Week 12</p>
						</a>
					</div>

					<div class="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
						<p class="text-sm text-amber-900 font-medium text-center">
							⚠️ Check the calendar for report due dates
						</p>
					</div>
				</div>

				<!-- About Section -->
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">About These Labs</h2>
					<div class="space-y-3 text-gray-700 text-sm leading-relaxed">
						<p>
							These virtual laboratories use simulated experimental data to develop skills in data
							analysis and computational chemistry. Each lab mimics real experiments with realistic
							noise and uncertainty.
						</p>
						<p>
							You can analyze data using Python, Excel, or manual calculations. Assessment focuses on
							data analysis and presentation, not programming skills. All data is available as CSV
							files for easy import.
						</p>
						<p>
							The labs cover physical chemistry concepts including thermodynamics, kinetics, and
							chemical equilibrium. Lab demonstrators will guide you through the analysis methods.
						</p>
					</div>
				</div>
			</div>

			<!-- Resources Section (1/3 width) -->
			<div class="space-y-6">
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-6">Resources</h2>

					<div class="space-y-3">
						<a
							href="/calendar"
							class="block bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg p-4 hover:from-amber-600 hover:to-orange-700 transition-all no-underline shadow-sm"
						>
							<h3 class="font-semibold mb-1">📅 Calendar</h3>
							<p class="text-sm opacity-90">Lab schedule and deadlines (2025)</p>
						</a>

						<a
							href="/download-file/LabManualCHEM2000-1.pdf"
							class="block border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-gray-50 transition-all no-underline"
						>
							<h3 class="font-semibold text-gray-900 mb-1">📚 Lab Manual</h3>
							<p class="text-xs text-gray-600">PDF · Version 1 · 20/02/2025</p>
						</a>

						<a
							href="/download-file/LabReportTemplate.docx"
							class="block border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-gray-50 transition-all no-underline"
						>
							<h3 class="font-semibold text-gray-900 mb-1">📝 Report Template</h3>
							<p class="text-xs text-gray-600">DOCX · Version 1 · 28/02/2025</p>
						</a>

						<a
							href="/download-file/NotesOfStatistics-1.pdf"
							class="block border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-gray-50 transition-all no-underline"
						>
							<h3 class="font-semibold text-gray-900 mb-1">📊 Statistics Notes</h3>
							<p class="text-xs text-gray-600">PDF · Version 1 · 20/02/2025</p>
						</a>

						<a
							href="/download-file/python_primer.pdf"
							class="block border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-gray-50 transition-all no-underline"
						>
							<h3 class="font-semibold text-gray-900 mb-1">🐍 Python Primer</h3>
							<p class="text-xs text-gray-600">PDF · Version 1 · 20/02/2025</p>
						</a>
					</div>
				</div>

				<!-- Quick Tips -->
				<div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
					<h3 class="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
					<ul class="space-y-2 text-sm text-gray-700">
						<li>• Labs can be completed at home</li>
						<li>• Data includes realistic noise</li>
						<li>• Use Python, Excel, or calculator</li>
						<li>• Export data as CSV files</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
