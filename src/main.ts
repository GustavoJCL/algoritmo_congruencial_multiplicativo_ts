import { invoke } from "@tauri-apps/api/tauri";
import { Chart } from "chart.js/auto";

let ctx: CanvasRenderingContext2D | null;
let getSeed: HTMLInputElement | null;
let getK: HTMLInputElement | null;
let getG: HTMLInputElement | null;

let responseArray: number[] = [];
let responseLabel: number[] = [];
let chartCanva: Chart | null = null;

async function algorithm_congruential_multiplicative() {
	const seed = parseInt(getSeed?.value || "0", 10);
	const k = parseInt(getK?.value || "0", 10);
	const g = parseInt(getG?.value || "0", 10);

	if (!seed || !k || !g) {
		console.error(
			"Invalid input. Please enter a valid number for seed, k and g",
		);
		return;
	}

	if (seed % 2 === 0) {
		console.error("The seed must be an odd number");
		return;
	}

	responseArray = (await invoke("run_rgn", {
		seed: seed,
		k: k,
		g: g,
	}).catch((err) => {
		console.error(err);
	})) as number[];
	console.log(responseArray);
}

window.addEventListener("DOMContentLoaded", () => {
	getSeed = document.querySelector("#seed");
	getK = document.querySelector("#k");
	getG = document.querySelector("#g");

	const canva = document.querySelector("#chart-canva");
	if (canva) {
		ctx = (canva as HTMLCanvasElement).getContext("2d");
	}

	document.getElementById("btn-submit")?.addEventListener("click", (e) => {
		e.preventDefault();
		algorithm_congruential_multiplicative().then(() => {
			responseLabel = responseArray.map((_, i) => i);
			if (ctx) {
				if (chartCanva) {
					chartCanva.destroy();
				}
				chartCanva = new Chart(ctx, {
					type: "scatter",
					data: {
						labels: responseLabel,
						datasets: [
							{
								data: responseArray,
							},
						],
					},
				});
			}
		});
	});
});
