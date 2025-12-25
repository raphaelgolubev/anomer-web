<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	// SvelteDate специально создан для работы с реактивностью
	let now = new SvelteDate(); 
	
	let timeString = $derived(
		new Intl.DateTimeFormat('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}).format(now)
	);

	$effect(() => {
		const interval = setInterval(() => {
			// Метод setTime спровоцирует обновление реактивности
			now.setTime(Date.now());
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<div class="terminal-header">
	<div class="header-left">zovOS v0.1a</div>
	<div class="header-center">Anomer</div>
	<div class="header-right">{timeString}</div>
</div>

<style>
	.terminal-header {
		display: flex;
		justify-content: space-between;
		padding-bottom: 10px;
		border-bottom: 1px solid #90fbab;
		margin-bottom: 15px;
		font-size: 14px;
	}

	.header-left,
	.header-center,
	.header-right {
		flex: 1;
	}

	.header-center {
		text-align: center;
		font-weight: bold;
	}

	.header-right {
		text-align: right;
	}
</style>
