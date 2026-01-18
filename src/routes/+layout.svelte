<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import monitorImg from '$lib/assets/monitor_inner.png';

	import Terminal from '$lib/components/Terminal.svelte';
	import TerminalHeader from '$lib/components/TerminalHeader.svelte';
	import TerminalContent from '$lib/components/TerminalContent.svelte';
	import FuncKey from '$lib/components/FuncKey.svelte';
	import TerminalFooter from '$lib/components/TerminalFooter.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="app-container">
	<div class="monitor-wrapper">
		<img src={monitorImg} class="monitor-frame" alt="Frame" />

		<div class="screen-content">
			<Terminal>
					<TerminalHeader />

					<TerminalContent>
						{@render children()}
					</TerminalContent>

					<TerminalFooter>
						<FuncKey link="/">F1 [/root]</FuncKey>
						<FuncKey link="/auth">F2 [/auth]</FuncKey>
						<FuncKey link="/register">F3 [/register]</FuncKey>
						<FuncKey link="/hack">F4 [hack pentagon]</FuncKey>
						<FuncKey link="/info">F5 [info]</FuncKey>
						<FuncKey link="/about">F6 [about]</FuncKey>
					</TerminalFooter>

			</Terminal>
		</div>
		
	</div>
</div>

<style>
	:global(body, html) {
		margin: 0;
		padding: 0;
		height: 100%;
		/* Цвет фона за монитором */
		background-color: #e2e1d3;
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
		width: 100%;
		height: 100%;
		/* margin: 0 auto; */
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
