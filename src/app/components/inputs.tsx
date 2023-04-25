import { For, createSignal } from "solid-js";
import { Layer } from "../network/layer";

export function Inputs(props: { layer: Layer }) {
	// component logic
	const updateWeights = (i: number, j: number) => {
		return (val: number) => {
			props.layer.Weights[i][j] = val;
			props.layer.nottify();
		};
	};

	const updateBiases = (i: number) => {
		return (val: number) => {
			props.layer.Biases[i] = val;
			props.layer.nottify();
		};
	};

	// component layout
	return (
		<div class="flex flex-col gap-1">
			<p>Weights</p>
			<For each={props.layer.Weights}>
				{(vals, i) => {
					return (
						<For each={vals}>
							{(val, j) => (
								<InputSingle
									val={val}
									update={updateWeights(i(), j())}
									label={`W ${i()}.${j()}`}
								/>
							)}
						</For>
					);
				}}
			</For>
			<p>Biases</p>
			<For each={props.layer.Biases}>
				{(val, i) => (
					<InputSingle val={val} update={updateBiases(i())} label={`W ${i()}`} />
				)}
			</For>
		</div>
	);
}

function InputSingle(props: { label: string; update(val: number): void; val: number }) {
	const [val, setVal] = createSignal(props.val * 100);

	return (
		<label class="flex">
			<input
				type="range"
				value={val()}
				min={-1000}
				max={1000}
				onInput={(e) => {
					props.update(+e.target.value / 1000);
					setVal(+e.target.value);
				}}
			/>
			<code class={`inline-block ml-1 ${val() > 0 ? "text-blue-500" : "text-red-500"}`}>
				{Math.abs(val() / 1000).toFixed(2)}
			</code>
			<small class={`inline-block ml-1 ${val() > 0 ? "text-blue-500" : "text-red-500"}`}>
				{props.label}
			</small>
		</label>
	);
}
