<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let data = [];
	export let xLabel = 'X';
	export let yLabel = 'Y';
	export let title = '';
	export let yAxisType = 'linear'; // 'linear' or 'logarithmic'

	let canvas;
	let chart;

	onMount(() => {
		if (canvas && data.length > 0) {
			renderChart();
		}

		return () => {
			if (chart) {
				chart.destroy();
			}
		};
	});

	$: if (canvas && data.length > 0) {
		renderChart();
	}

	function renderChart() {
		if (chart) {
			chart.destroy();
		}

		const ctx = canvas.getContext('2d');

		// Check if data is in Chart.js format (array of datasets) or simple format
		let chartData;
		if (Array.isArray(data) && data.length > 0 && data[0].data) {
			// Chart.js format: data is an array of dataset objects
			chartData = {
				datasets: data.map((dataset) => ({
					...dataset,
					showLine: true,
					pointRadius: 2,
					borderWidth: 2,
					tension: 0 // No curve smoothing
				}))
			};
		} else {
			// Simple format: data is [[x, y], [x, y], ...]
			chartData = {
				datasets: [
					{
						label: 'Data',
						data: data.map((row) => ({ x: row[0], y: row[1] })),
						backgroundColor: 'rgba(54, 162, 235, 0.5)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1,
						pointRadius: 3,
						showLine: false
					}
				]
			};
		}

		const config = {
			type: 'scatter',
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					title: {
						display: title !== '',
						text: title
					},
					legend: {
						display: chartData.datasets.length > 1
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								const label = context.dataset.label || '';
								return `${label}: (${context.parsed.x.toFixed(4)}, ${context.parsed.y.toFixed(4)})`;
							}
						}
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: xLabel
						},
						type: 'linear',
						position: 'bottom'
					},
					y: {
						type: yAxisType,
						title: {
							display: true,
							text: yLabel
						}
					}
				}
			}
		};

		chart = new Chart(ctx, config);
	}
</script>

<div class="plot-container">
	<canvas bind:this={canvas}></canvas>
	<div class="watermark">TEMPLATE</div>
</div>

<style>
	.plot-container {
		position: relative;
		width: 100%;
		max-width: 600px;
		margin: 20px auto;
	}

	.watermark {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(30deg);
		font-size: 40px;
		color: rgba(128, 128, 128, 0.5);
		pointer-events: none;
		user-select: none;
		font-weight: bold;
	}

	canvas {
		width: 100% !important;
		height: auto !important;
	}
</style>
