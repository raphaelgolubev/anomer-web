<script>
	// Принимаем children как специальный пропс-сниппет
	let { children } = $props();
</script>

<div class="function-keys">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.function-keys {
		display: flex;
		gap: 5px;
		border-top: 1px solid #90fbab;
		padding-top: 10px;
		flex-wrap: wrap;
	}
</style>
