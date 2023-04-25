import { Layer } from "./layer";

export class Network {
	private layers: Layer[];

	constructor(private readonly sizes: number[]) {
		this.layers = this.initLayers();
	}

	public feedForward(inputs: number[]): number[] {
		for (let i = 0; i < this.layers.length; i++) {
			inputs = this.layers[i].feedForward(inputs);
		}

		return inputs;
	}

	private initLayers(): Layer[] {
		this.layers = new Array(this.sizes.length - 1);

		for (let i = 0; i < this.sizes.length - 1; i++) {
			this.layers[i] = new Layer(this.sizes[i], this.sizes[i + 1]);
		}

		return this.layers;
	}

	/*  Debug
    /*   *   *   *   *   *   *   *   */

	public get Arrays() {
		return this.layers.map((layer) => {
			return [layer.Weights, layer.Biases] as const;
		});
	}

	public get Layers() {
		return this.layers;
	}
}
