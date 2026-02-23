<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import monitorImg from '$lib/assets/monitor_inner.png';
	import { sfx } from '$lib/sound';

	import { ui } from '$lib/ui.svelte';
    import { fade } from 'svelte/transition';

	import Terminal from '$lib/components/Terminal.svelte';
	import TerminalHeader from '$lib/components/TerminalHeader.svelte';
	import TerminalContent from '$lib/components/TerminalContent.svelte';
	import TerminalFooter from '$lib/components/TerminalFooter.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<svelte:window onclick={() => sfx.init()} onkeydown={() => sfx.init()} />

<div class="app-container">
	<div class="monitor-wrapper">
		<img src={monitorImg} class="monitor-frame" alt="Frame" />

		<div class="screen-content">
			<Terminal>
				{#if ui.isCrtActive}
					<div transition:fade={{ duration: 1000 }}>
						<TerminalHeader />
					</div>
				{/if}

					<TerminalContent>
						{@render children()}
					</TerminalContent>

				{#if ui.isCrtActive}
					<div transition:fade={{ duration: 1000 }}>
						<TerminalFooter />
					</div>
				{/if}

			</Terminal>
		</div>
		
	</div>
</div>

<style>
	:global(body, html) {
		margin: 0;
		padding: 0;
		height: 100%;
		/* Цвет монитора */
		background-image: linear-gradient(
			to bottom right, 
			var(--monitor-gradient-top-left), 
			var(--monitor-gradient-bottom-right));
		/* Запрещаем прокрутку всего окна */
		overflow: hidden;
	}

	.app-container {
		display: block;
		/* display: flex; */
		/* Центр по горизонтали */
		/* justify-content: center; */
		/* Центр по вертикали */
		/* align-items: center; */
		width: 100vw;
		height: 100vh;

		padding: 4rem;
	}

	.monitor-wrapper {
		position: relative;
		width: 90%;
		height: 100%;
		margin: 0 auto;
		overflow: hidden;
		border-radius: 1.3%;
		/* aspect-ratio: 4 / 3; */
	}

	.monitor-frame {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* Рамка должна быть СВЕРХУ контента */
		z-index: 10;
		/* Чтобы можно было кликать по кнопкам под рамкой */
		pointer-events: none;
	}

	.screen-content {
		position: absolute;
		/* top: 8%; */
		/* left: 8%; */
		/* width: 84%; */
		/* height: 84%; */
		top: 8px;
		left: 8px;
		width: 98%;
		height: 97.5%;
		background: black;
		overflow-y: auto;
		/* Контент под рамкой */
		z-index: 5;
	}
</style>
