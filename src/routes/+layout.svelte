<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import monitorImg from '$lib/assets/monitor.png';

	import CrtOverlay from '$lib/components/CRTOverlay.svelte';
	import Scanlines from '$lib/components/Scanlines.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import TerminalHeader from '$lib/components/TerminalHeader.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="app-container">
	<div class="monitor-wrapper">
		<img src={monitorImg} class="monitor-frame" alt="Frame" />

		<div class="screen-content">
			<Terminal>
				<CrtOverlay />
				<Scanlines />
				<TerminalHeader />
				{@render children()}
			</Terminal>

			
		</div>
	</div>
</div>

<!-- <Terminal>
	<Scanlines />
	<TerminalHeader />
	{@render children()}
</Terminal>

<CrtOverlay /> -->

<style>
	:global(body, html) {
		margin: 0;
		padding: 0;
		height: 100%;
		/* Цвет фона за монитором */
		background-color: #0a0a0a;
		/* Запрещаем прокрутку всего окна */
		overflow: hidden;
	}

	.app-container {
		display: flex;
		/* Центр по горизонтали */
		justify-content: center;
		/* Центр по вертикали */
		align-items: center;
		width: 100vw;
		height: 100vh;
	}

	.monitor-wrapper {
		position: relative;
		width: 120vmin;
		margin: 0 auto;
		aspect-ratio: 4 / 3;
	}

	.monitor-frame {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* Рамка должна быть СВЕРХУ контента */
		z-index: 10;
		/* Чтобы можно было кликать по кнопкам под рамкой */
		pointer-events: none;
	}

	.screen-content {
		position: absolute;
		top: 8%;
		left: 8%;
		width: 84%;
		height: 84%;
		background: black;
		overflow-y: auto;
		/* Контент под рамкой */
		z-index: 5;
	}
</style>
