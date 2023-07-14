<script lang="ts">
	export let importedItems: string[] = [];

	let enteredText = importedItems.join('\n');

	$: importedItems = enteredText.split("\n").filter(Boolean);
</script>

<textarea bind:value={enteredText} placeholder="paste your items here..." />

<style>
	textarea {
		box-sizing: border-box;
		resize: none;

		width: 100%;
		height: 100%;

		padding: 1em;

		background-color: transparent;
		color: white;
		border-radius: 10px;
	}
</style>
