<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { scale } from "svelte/transition";
	import rotateIconSrc from "@/assets/icons/arrow-rotate-right-solid.svg";
	import { randomRange } from "../utils";

	type T = $$Generic;

	type Sector = {
		color: string;
		value: T;
	};

	export let sectors: Sector[] = [];

	export let size = 300;

	export let spinButton = true;

	export let spinDuration = 500;

	export let velocityScale = 0.5;

	const spinProgress = tweened(1, {
		duration: spinDuration,
	});

	const dispatch = createEventDispatcher<{
		selected: T;
		spinStarted: void;
		stopped: T;
	}>();

	const TAU = 2 * Math.PI;

	$: sectorArc = TAU / sectors.length;
	$: rotationAngle = -sectorArc / 2.0;

	$: spinning = $spinProgress < 1;
	$: angularVelocity = velocityScale * (1 - $spinProgress);

	let spinned = false;

	$: if (spinned && !spinning) {
		dispatchStopped(); // needed to not depend on selectedSector
	}

	function dispatchStopped() {
		dispatch("stopped", selectedSector.value);
	}

	function onAnimationFrame() {
		if (!spinning) return;

		rotationAngle += angularVelocity;
		rotationAngle %= TAU; // normalize angle
	}

	function updateLoop() {
		onAnimationFrame();
		requestAnimationFrame(updateLoop);
	}

	export async function spin() {
		if (spinning) {
			return;
		}

		await spinProgress.set(0, { duration: 0 });
		spinProgress.set(1, { duration: spinDuration });
		spinned = true;

		dispatch("spinStarted");
	}

	onMount(() => {
		updateLoop();
	});

	let selectedSector: Sector;

	$: if (sectors.length > 0) {
		let previousSector = selectedSector;

		selectedSector =
			sectors[
				Math.floor(sectors.length - (rotationAngle / TAU) * sectors.length) %
					sectors.length
			];

		if (previousSector != selectedSector) {
			dispatch("selected", selectedSector.value);
		}
	}
</script>

<div id="container" style:width="{size}px" style:height="{size}px">
	{#if sectors.length > 1}
		<div id="sectors" style:--rotation-angle="{rotationAngle}rad">
			{#each sectors as sector, sectorIndex}
				<div
					class="sector"
					style:--sector-arc="{sectorArc}rad"
					style:--sector-angle="{sectorIndex * sectorArc}rad"
					style:--sector-color={sector.color}
				>
					{#if sectors.length <= 3}
						<div class="sector-bg half-1" />
						<div class="sector-bg half-2" />
					{:else}
						<div class="sector-bg full" />
					{/if}
					<div class="sector-label">
						{sector.value}
					</div>
				</div>
			{/each}
		</div>

		<div id="center-pin" />

		{#if spinButton && !spinning}
			<button
				on:click={spin}
				transition:scale={{ duration: 150 }}
				style:background={selectedSector?.color}
				style:color="white"
			>
				<img src={rotateIconSrc} alt="spin" />
			</button>
		{/if}

		<div id="top-arrow" />
	{:else if sectors.length == 1}
		{@const sector = sectors[0]}
		<div class="single-sector" style:--sector-color={sector.color}>
			<div class="single-sector-label">
				{sector.value}
			</div>
		</div>
	{/if}
</div>

<style>
	#container {
		position: relative;
		width: min-content;
		clip-path: circle();
		overflow: hidden;

		color: white;
	}

	#container * {
		position: absolute;
	}

	button {
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		width: 80px;
		height: 80px;

		border-radius: 100%;
		border: solid 5px white;

		cursor: pointer;
	}

	button > img {
		translate: -50% -50%;
		filter: invert();
	}

	#sectors {
		width: 100%;
		height: 100%;
		top: 50%;
		left: 50%;
		transform-origin: top left;
		rotate: var(--rotation-angle);
	}

	.sector {
		width: 50%;
		height: 50%;
		transform-origin: top left;
		transform: rotate(calc(var(--sector-angle) - 90deg));
	}

	.single-sector {
		width: 100%;
		height: 100%;
		background: var(--sector-color);
	}

	.single-sector-label {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		max-width: 80%;
		word-break: break-word;
	}

	.sector-bg {
		background: var(--sector-color);
		border: solid 3px var(--sector-color);
		width: 100%;
		height: 100%;
		transform-origin: top left;

		--skew-half-arc: skew(calc(90deg - var(--sector-arc) / 2));
	}

	/*
		sector background is made of 2 sector halfs
		because of skew(-90deg) stuff
	*/

	.sector-bg.full {
		transform: skew(calc(90deg - var(--sector-arc)));
	}

	.sector-bg.half-1 {
		transform: var(--skew-half-arc);
	}

	.sector-bg.half-2 {
		transform: rotate(calc(var(--sector-arc) / 2)) var(--skew-half-arc);
	}

	.sector-label {
		width: 100%;
		text-align: right;
		box-sizing: border-box;
		padding-right: 20px;
		padding-left: 50px;

		transform-origin: top left;
		transform: rotate(calc(var(--sector-arc) / 2)) translateY(-50%);

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	#center-pin {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		translate: -50% -50%;
		background: white;
	}

	#top-arrow {
		width: 40px;
		height: 20px;
		top: 0;
		left: 50%;
		translate: -50% -25%;

		clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
		background: white;
	}
</style>
