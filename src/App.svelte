<script lang="ts">
	import ItemsImport from "./ItemsImport.svelte";
	import WheelScreen from "./WheelScreen.svelte";
	import checkIconSrc from "@/assets/icons/check-solid.svg";
	import arrowLeftIconSrc from "@/assets/icons/arrow-left-solid.svg";

	let inWheelScreen = false;
	let importedItems: string[] = [];

	$: canGoToWheel = importedItems.length >= 2;
</script>

<main>
	{#if !inWheelScreen}
		<ItemsImport bind:importedItems />
		<button
			id="import"
			title="import items"
			disabled={!canGoToWheel}
			on:click={() => (inWheelScreen = true)}
		>
			<img src={checkIconSrc} alt="import items" />
		</button>
	{:else}
		<button
			id="back"
			title="back to import"
			on:click={() => (inWheelScreen = false)}
		>
			<img src={arrowLeftIconSrc} alt="back to import" />
		</button>
		<WheelScreen items={importedItems} />
	{/if}
</main>

<style>
	main {
		box-sizing: border-box;
		width: 100dvw;
		height: 100dvh;
		padding: 2em;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;
	}

	button {
		font-size: 1.2em;
		padding: 0.5em;

		background-color: #4f4f4f;
		color: white;
		border: none;
		border-radius: 10px;

		width: 50px;
		height: 50px;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:disabled > img {
		filter: invert(0.5);
	}

	button:enabled > img {
		filter: invert();
	}
</style>
