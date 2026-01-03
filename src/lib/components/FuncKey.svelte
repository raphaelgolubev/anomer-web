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
		color: #001401;
		background: #90fba4;
		box-shadow: 0 0 8px #90fba4;
	}

	.function-key:active {
		background: #00991f;
	}
</style>
