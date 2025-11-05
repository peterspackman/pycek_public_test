<svelte:head>
	<title>Chemical Energetics and Kinetics Virtual Notebook</title>
</svelte:head>

<div class="container-page">
	<h1 class="text-4xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mt-8 mb-6">
		Chemical Energetics and Kinetics Virtual Notebook
	</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
		<a href="/calendar" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">Calendar</h3>
			<p class="text-gray-600 text-sm text-center m-0">
				Lab schedule and deadlines<br />(2025)
			</p>
		</a>
		<a href="/download-file/LabManualCHEM2000-1.pdf" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">
				Lab Manual<br />(Download PDF)
			</h3>
			<p class="text-gray-600 text-sm text-center m-0">Version 1 - 20/02/2025</p>
		</a>
		<a href="/download-file/LabReportTemplate.docx" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">
				Lab Report Template<br />(Download DOCX)
			</h3>
			<p class="text-gray-600 text-sm text-center m-0">Version 1 - 28/02/2025</p>
		</a>
		<a href="/download-file/NotesOfStatistics-1.pdf" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">
				Notes of Statistics<br />(Download PDF)
			</h3>
			<p class="text-gray-600 text-sm text-center m-0">Version 1 - 20/02/2025</p>
		</a>
		<a href="/download-file/python_primer.pdf" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">
				A Python Primer<br />(Download PDF)
			</h3>
			<p class="text-gray-600 text-sm text-center m-0">Version 1 - 20/02/2025</p>
		</a>
	</div>

	<hr class="w-4/5 h-0.5 bg-gray-700 border-none my-10 mx-auto" />

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
		<a href="/stats" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">Statistics Lab</h3>
			<p class="text-gray-600 text-sm text-center m-0">
				Basic statistical concepts and Python introduction<br />(Week 2)
			</p>
		</a>
		<a href="/bc" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">Bomb Calorimetry Lab</h3>
			<p class="text-gray-600 text-sm text-center m-0">
				Thermodynamics and heat measurements<br />(Week 4)
			</p>
		</a>
		<a href="/cv" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">Crystal Violet Lab</h3>
			<p class="text-gray-600 text-sm text-center m-0">
				Chemical kinetics and reaction rates<br />(Week 8)
			</p>
		</a>
		<a href="/eq" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">Chemical Equilibrium Lab</h3>
			<p class="text-gray-600 text-sm text-center m-0">
				Numerical solution of equilibrium problems<br />(Week 10)
			</p>
		</a>
		<a href="/surface" class="card-hover no-underline">
			<h3 class="text-lg font-semibold text-gray-800 text-center mb-2">Surface Adsorption Lab</h3>
			<p class="text-gray-600 text-sm text-center m-0">
				Equilibrium and surface chemistry<br />(Week 12)
			</p>
		</a>
	</div>

	<h2 class="text-2xl font-bold text-gray-700 text-center mt-8">
		<strong class="text-red-600">Check the calendar for when the reports are due</strong>
	</h2>

	<hr class="w-4/5 h-0.5 bg-gray-700 border-none my-10 mx-auto" />

	<h2 class="text-2xl font-bold text-gray-700 text-center mt-8 mb-4">Introduction</h2>

	<div class="prose prose-gray max-w-none">
		<p class="my-4 leading-relaxed">
			This web page and those linked below have been created with Python using Jupyter Notebooks and
			will be used to develop important skills in data analysis, data processing, and computing
			using simulated experimental results and computational chemistry software.
		</p>

		<p class="my-4 leading-relaxed">
			Although we would encourage you to use Python notebooks for processing the laboratory data, as
			this is a sought-after skill by many employers, all the numerical labs can also be solved
			using simple Excel spreadsheets or even by hand with some algebra and a pocket calculator.
		</p>

		<p class="my-4 leading-relaxed">
			The assessment of the reports does not focus on the programming skills, but rather on the data
			analysis and data presentation, so you can choose your preferred method to analyse the data.
		</p>

		<p class="my-4 leading-relaxed">
			All the data will be available in CSV files, which can be readily imported into Excel or read
			by Python.
		</p>

		<p class="my-4 leading-relaxed">
			During the numerical labs, your lab demonstrator will show you how Python notebooks can be
			used to solve these problems, which you may have already used in the first year, or help you
			with the excel functions.
		</p>

		<p class="my-4 leading-relaxed">
			The links below will take you to a series of experiences that will be done in the
			corresponding week.
		</p>

		<p class="my-4 leading-relaxed">
			All the labs focus on physical chemistry concepts that you have already seen in the first year
			(<em>e.g.</em>, calorimetry, equilibrium, kinetics) or will be covered during the semester.
		</p>

		<p class="my-4 leading-relaxed">
			We will start with one labs to refresh some basic statistics concepts and familiarize
			ourselves with Python, if you choose to do the laboratories activities in that way.
		</p>

		<p class="my-4 leading-relaxed">
			We will then have one thermodynamics lab, one kinetics lab and one lab about chemical
			equilibrium.
		</p>

		<p class="my-4 leading-relaxed">
			In the chemical equilibrium lab, no data need to be generated, but you would have to implement
			a minimisation algorithm either in Python or in Excel.
		</p>

		<p class="my-4 leading-relaxed">
			Although these numerical labs cover a variety of different topics in Thermodynamics and
			Kinetics, the problems proposed here share some common features:
		</p>

		<ol class="pl-8 my-4 list-decimal space-y-2">
			<li>
				They have been designed to mimic real experiments, to a certain extent. This means that you
				often have the choice of setting the conditions of the experiment (<em>i.e.</em>, the
				temperature) and then perform the measurement by clicking a button.
			</li>
			<li>
				The results of all measurements come with some random noise, designed to mimic the
				experimental uncertainty of the instruments and user errors. This means that if you perform
				the same measurement 10 times under the same conditions, you will obtain 10 different
				values.
			</li>
			<li>
				Often the initial conditions can be set using sliding bars, designed to be difficult to set
				to nice round numbers, and the measurements will give results with lots of decimal places.
				It will be left to you to decide how many digits are significant and worth reporting.
			</li>
			<li>
				At the end of the virtual experiments, all the data collected can be exported as a Comma
				Separated Values (CSV) file that can be directly imported into Excel or read by Python and
				R.
			</li>
			<li>
				In most cases, the data obtained during the virtual experiment should be comparable to real
				experimental data.
			</li>
		</ol>

		<p class="my-4 leading-relaxed">
			You don't need to solve the entire lab during the lab time, this web page will remain active
			for the entire semester, and you can easily access it from home.
		</p>
	</div>
</div>
