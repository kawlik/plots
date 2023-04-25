export class Layer {
	private weights: number[][];
	private biases: number[];

	constructor(private readonly numInputs: number, private readonly numOutputs: number) {
		this.weights = this.initWeights();
		this.biases = this.initBiases();
	}

	public feedForward(inputs: number[]): number[] {
		const outputs = new Array(this.numOutputs);

		for (let i = 0; i < this.numOutputs; i++) {
			let weightedOutput = this.biases[i];

			for (let j = 0; j < this.numInputs; j++) {
				weightedOutput += this.weights[i][j] * inputs[j];
			}

			outputs[i] = 1 / (1 + Math.exp(-weightedOutput));
		}

		return outputs;
	}

	private initBiases(): number[] {
		this.biases = new Array(this.numOutputs);

		for (let i = 0; i < this.numOutputs; i++) {
			this.biases[i] = Math.random() * 2 - 1;
		}

		return this.biases;
	}

	private initWeights(): number[][] {
		this.weights = new Array(this.numOutputs);

		for (let i = 0; i < this.numOutputs; i++) {
			this.weights[i] = new Array(this.numInputs);

			for (let j = 0; j < this.numInputs; j++) {
				this.weights[i][j] = Math.random() * 2 - 1;
			}
		}

		return this.weights;
	}

	/*  Debug
    /*   *   *   *   *   *   *   *   */

	public get Biases() {
		return this.biases;
	}

	public set Biases(biases: number[]) {
		this.biases = biases;
	}

	public get Weights() {
		return this.weights;
	}

	public set Weights(weights: number[][]) {
		this.weights = weights;
	}

	public nottify(): void {
		window.dispatchEvent(new Event("updateLayer"));
	}
}
