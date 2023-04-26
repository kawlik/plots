import { Chart } from "chart.js/auto";
import { onMount } from "solid-js";
import { Network } from "../network/network";

export function Canvas(props: { network: Network }) {
	// component logic
	function classify(x: number, y: number): number {
		const outputs = props.network.feedForward([x, y]);

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

	function rand(min: number, max: number): number {
		if (min > max) [min, max] = [max, min];

		return Math.random() * (max - min + 1) + min;
	}

	function draw(
		ctx: CanvasRenderingContext2D,
		crd: {
			x0: number;
			x1: number;
			y0: number;
			y1: number;
		},
		sizeX: number,
		sizeY: number,
		debug = false
	): void {
		const _x = crd.x0 / sizeX;
		const _y = crd.y0 / sizeY;

		const x = Math.floor(crd.x0);
		const y = Math.floor(crd.y0);
		const r = Math.ceil(crd.x1 - crd.x0);

		ctx.fillStyle = classify(_x, _y) === 1 ? "red" : "blue";
		ctx.fillRect(x, y, r, r);

		if (debug) ctx.strokeRect(x, y, r, r);
	}

	function drawRecurse(
		ctx: CanvasRenderingContext2D,
		crd: {
			x0: number;
			x1: number;
			y0: number;
			y1: number;
		},
		sizeX: number,
		sizeY: number,
		deep: number,
		debug = false
	): void {
		if (deep === 0) return draw(ctx, crd, sizeX, sizeY, debug);

		if (crd.x1 - crd.x0 < 1) return draw(ctx, crd, sizeX, sizeY, debug);
		if (crd.y1 - crd.y0 < 1) return draw(ctx, crd, sizeX, sizeY, debug);

		let x = crd.x0 / sizeX;
		let y = crd.y0 / sizeY;

		let init = classify(x, y);
		let pass = true;

		for (let i = 0; i < deep ** 3; i++) {
			x = rand(crd.x0, crd.x1) / sizeX;
			y = rand(crd.y0, crd.y1) / sizeY;

			let test = classify(x, y);

			if (test === init) continue;

			pass = false;
			break;
		}

		if (pass) return draw(ctx, crd, sizeX, sizeY, debug);

		const half_x = (crd.x1 - crd.x0) / 2;
		const half_y = (crd.y1 - crd.y0) / 2;

		drawRecurse(
			ctx,
			{
				x0: crd.x0,
				x1: crd.x0 + half_x,
				y0: crd.y0,
				y1: crd.y0 + half_y,
			},
			sizeX,
			sizeY,
			deep - 1,
			debug
		);

		drawRecurse(
			ctx,
			{
				x0: crd.x0,
				x1: crd.x0 + half_x,
				y0: crd.y0 + half_y,
				y1: crd.y1,
			},
			sizeX,
			sizeY,
			deep - 1,
			debug
		);

		drawRecurse(
			ctx,
			{
				x0: crd.x0 + half_x,
				x1: crd.x1,
				y0: crd.y0,
				y1: crd.y0 + half_y,
			},
			sizeX,
			sizeY,
			deep - 1,
			debug
		);

		drawRecurse(
			ctx,
			{
				x0: crd.x0 + half_x,
				x1: crd.x1,
				y0: crd.y0 + half_y,
				y1: crd.y1,
			},
			sizeX,
			sizeY,
			deep - 1,
			debug
		);
	}

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
						drawRecurse(
							chart.ctx,
							{
								x0: 0,
								x1: chart.width,
								y0: 0,
								y1: chart.height,
							},
							chart.width,
							chart.height,
							Math.log2(Math.max(chart.width, chart.height))
						);
					},
				},
			],
		});

		window.addEventListener("updateLayer", () => chart.update());
	});

	// component layout
	return <canvas id="chart" />;
}
