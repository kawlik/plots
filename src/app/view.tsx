import { For } from "solid-js";
import { Inputs } from "./components/inputs";
import { Network } from "./network/network";
import { Canvas } from "./components/canvas";

export function View() {
	// component logic
	const network = new Network([2, 3, 2]);

	// component layout
	return (
		<main class="flex gap-2 justify-start items-start h-screen w-screen overflow-hidden">
			<Canvas network={network} />
			<For each={network.Layers}>{(layer) => <Inputs layer={layer} />}</For>
		</main>
	);
}
