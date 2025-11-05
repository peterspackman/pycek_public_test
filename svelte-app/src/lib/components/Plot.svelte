<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let data = [];
	export let xLabel = 'X';
	export let yLabel = 'Y';
	export let title = '';

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

		// Prepare data for Chart.js
		const chartData = {
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
						display: false
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								return `(${context.parsed.x.toFixed(4)}, ${context.parsed.y.toFixed(4)})`;
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
