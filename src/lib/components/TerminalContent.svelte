<script>
	let { children } = $props();
</script>

<div class="terminal-content">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.terminal-content {
		display: flex;
		flex-direction: row;
		position: relative;
		width: 100%;
		height: 100%;
		margin-bottom: 1rem;
		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
