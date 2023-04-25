import { Chart } from "chart.js/auto";
import { onMount } from "solid-js";
import { Network } from "../network/network";

function classify(network: Network, x1: number, x2: number): number {
	const outputs = network.feedForward([x1, x2]);

	let maxIndex = 0;
	let maxValue = 0;

	for (let i = 0; i < outputs.length; i++) {
		if (outputs[i] > maxValue) {
			maxValue = outputs[i];
			maxIndex = i;
		}
	}

	return maxIndex;
}

export function Canvas(props: { network: Network }) {
	// component logic
	onMount(function () {
		const chart = new Chart(document.querySelector<HTMLCanvasElement>("#chart")!, {
			type: "bubble",
			data: {
				datasets: [
					{
						data: [],
					},
					{
						data: [],
					},
				],
			},
			options: {
				aspectRatio: 1,
				plugins: {
					legend: {
						display: false,
					},
				},
				scales: {
					x: {
						display: false,
						min: 0,
						max: 0,
					},
					y: {
						display: false,
						min: 0,
						max: 0,
					},
				},
			},
			plugins: [
				{
					id: "boundry",
					beforeDraw(chart) {
						const lenght = chart.width;
						const offset = 5;

						for (let x = 0; x < lenght; x += offset) {
							for (let y = 0; y < lenght; y += offset) {
								const _x = x / lenght;
								const _y = y / lenght;

								if (classify(props.network, _x, 1 - _y) === 1) {
						            chart.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
									chart.ctx.fillRect(x, y, offset, offset);
								} else {
                                    chart.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
									chart.ctx.fillRect(x, y, offset, offset);
                                }
							}
						}
					},
				},
			],
		});

		window.addEventListener("updateLayer", () => chart.update());
	});

	// component layout
	return <canvas id="chart" class="w-min h-min" />;
}
