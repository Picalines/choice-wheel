<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { delay, randomRange } from "./utils";
	import Wheel from "./lib/Wheel.svelte";

	export let items: string[];

	const randomColor = () => {
		const h = randomRange(0, 360);
		const s = randomRange(25, 100);
		const l = randomRange(25, 75);
		return `hsl(${h} ${s}% ${l}%)`;
	};

	let currentSectors = items.map((value) => ({ color: randomColor(), value }));
	let removeHistory: string[] = [];

	let startedSpinning = false;

	let wheel: Wheel<string>;

	let velocityScale: number;
	let spinDuration: number;

	const SPIN_DURATION_MAP: [count: number, duration: number][] = [
		[items.length, 500],
		[5, 3000],
		[3, 5000],
		[1, 10_000],
	];

	function randomizeSpin() {
		velocityScale = randomRange(0.5, 1);
		spinDuration = SPIN_DURATION_MAP.findLast(
			([count, _]) => currentSectors.length <= count
		)![1];
	}

	randomizeSpin();

	async function onWheelStopped(event: CustomEvent<string>) {
		await delay(500);

		if (currentSectors.length > 1) {
			const itemToRemove = event.detail;
			currentSectors = currentSectors.filter(
				(sector) => sector.value != itemToRemove
			);
			removeHistory = [itemToRemove, ...removeHistory];

			await delay(500);
			randomizeSpin();
			wheel.spin();
		}
	}
</script>

<div>
	<section>
		<Wheel
			bind:this={wheel}
			on:spinStarted={() => (startedSpinning = true)}
			on:stopped={onWheelStopped}
			spinButton={!startedSpinning}
			size={400}
			sectors={currentSectors}
			{spinDuration}
			{velocityScale}
		/>
	</section>

	<section>
		{#if removeHistory.length > 0}
			<ul in:fade={{ duration: 200 }}>
				{#each removeHistory as item (item)}
					<li in:fly={{ duration: 300, y: -10 }}>{item}</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>

<style>
	div {
		height: 100%;

		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		justify-items: center;

		box-sizing: border-box;
		padding: 0 100px;
	}

	ul {
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 200px;

		max-height: 350px;
		overflow-y: auto;
		padding: 20px;
		margin: 0;
		background-color: rgb(0, 0, 0, 30%);
	}
</style>
