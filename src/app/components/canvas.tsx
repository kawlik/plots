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
						const offset = 1;

						const imageData = chart.ctx.createImageData(lenght, lenght);

						for (let x = 0; x < lenght; x += offset) {
							for (let y = 0; y < lenght; y += offset) {
								const _x = x / lenght;
								const _y = y / lenght;

								const index = 4 * (lenght * x + y);
								const color = classify(props.network, _x, 1 - _y);

								imageData.data[index + 0] = color === 1 ? 255 : 0;
								imageData.data[index + 1] = 0;
								imageData.data[index + 2] = color === 0 ? 255 : 0;
								imageData.data[index + 3] = 99;
							}
						}

						const texture = new ImageData(imageData.data, lenght, lenght);

						chart.ctx.putImageData(texture, 0, 0);
					},
				},
			],
		});

		chart.canvas.parentElement!.style.height = "256";
		chart.canvas.parentElement!.style.width = "256";

		window.addEventListener("updateLayer", () => chart.update());
	});

	// component layout
	return (
		<div>
			<canvas id="chart" />
		</div>
	);
}
