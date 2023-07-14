<script lang="ts">
	import { fly } from "svelte/transition";
	import { delay, randomRange } from "./utils";
	import Wheel from "./lib/Wheel.svelte";

	const randomColor = () => {
		const h = randomRange(0, 360);
		const s = randomRange(25, 100);
		const l = randomRange(25, 75);
		return `hsl(${h} ${s}% ${l}%)`;
	};

	let sectors = [
		"Essie Phillipsw",
		"Glen Lynchw",
		"Lula Ruizx",
		"Lou Briggs",
		"Randy Garrett",
		"Lewis Wise",
		"Agnes Alvarez",
		"Lewis Phillips",
		"Timothy Gutierrez",
		"Harry Waters",
		"Mable Pierce",
		"Jorge Mullins",
		"Alan Allen",
		"Estella Daniels",
		"Rosetta Newton",
		"Albert Palmer",
		"Isaac Larson",
		"Iva Hardy",
		"Olga Carlson",
	].map((value) => ({ color: randomColor(), value }));

	let removedStack: string[] = [];

	let startedSpinning = false;

	let wheel: Wheel<string>;

	const SPIN_DURATION_MAP: [count: number, duration: number][] = [
		[sectors.length, 500],
		[5, 3000],
		[3, 5000],
		[1, 10_000],
	];

	SPIN_DURATION_MAP.reverse();

	let velocityScale: number;
	let spinDuration: number;

	function randomizeSpin() {
		velocityScale = randomRange(0.5, 1);
		spinDuration = SPIN_DURATION_MAP.filter(
			([count, _]) => sectors.length <= count
		)[0][1];
	}

	randomizeSpin();

	async function onWheelStopped(event: CustomEvent<string>) {
		await delay(500);
		const valueToRemove = event.detail;

		if (sectors.length > 1) {
			sectors = sectors.filter((sector) => sector.value != valueToRemove);
			removedStack = [valueToRemove, ...removedStack];

			await delay(500);
			randomizeSpin();
			wheel.spin();
		}
	}
</script>

<main>
	<section>
		<Wheel
			bind:this={wheel}
			on:spinStarted={() => (startedSpinning = true)}
			on:stopped={onWheelStopped}
			spinButton={!startedSpinning}
			size={400}
			{sectors}
			{spinDuration}
			{velocityScale}
		/>
	</section>

	<section>
		<ul>
			{#each removedStack as item (item)}
				<li in:fly={{ y: -10 }}>{item}</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		width: 100dvw;
		height: 100dvh;

		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		justify-items: center;

		box-sizing: border-box;
		padding: 0 100px;
	}

	ul {
		text-align: center;
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 200px;

		max-height: 400px;
		overflow-y: auto;
		padding: 20px;
		margin: 0;
	}

	li {
		padding: 10px;
		border-radius: 8px;
		background-color: rgb(0, 0, 0, 30%);
	}
</style>
