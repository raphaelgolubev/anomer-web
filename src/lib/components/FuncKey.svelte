<script>
	import { resolve } from "$app/paths";
	let { children, link } = $props();
</script>

<a href={resolve(link)} class="function-key">
	{#if children}
		{@render children()}
	{/if}
</a>

<style>
	.function-key {
		flex: 1;
		background: #00441e;
		padding: 5px 8px;
		text-align: center;
		border: 1px solid #61f16d;
		font-size: 12px;
		min-width: 80px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.function-key:hover {
		background: #007708;
		box-shadow: 0 0 10px rgba(0, 255, 68, 0.5);
	}

	.function-key:active {
		background: #00991f;
	}
</style>
