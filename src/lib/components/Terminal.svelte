<script lang="ts">
	import { onMount } from 'svelte';
	
	import { sfx } from '$lib/sound';
	import { ui } from '$lib/ui.svelte';

	let { children } = $props();

	let isGlitching = $state(false);

	let container: HTMLElement;
	let cursorX = $state(0);
	let cursorY = $state(0);
	let isInside = $state(false);

	function handleMouseMove(e: MouseEvent) {
		if (!container) return;

		const rect = container.getBoundingClientRect();

		// рассчитываем координаты относительно контейнера
		// clamp ограничивает значения, чтобы курсор не выходил за края
		const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
		const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

		cursorX = x;
		cursorY = y;
	}

	// рандомные глитчи
	onMount(() => {
		const triggerGlitch = () => {
			isGlitching = true;

			if (ui.isMonitorActive) {
				sfx.playGlitchSfx(); 
			}

			setTimeout(
				() => {
					isGlitching = false;
					// следующий глитч через случайное время (от 2 до 10 сек)
					setTimeout(triggerGlitch, Math.random() * 8000 + 2000);
				},
				Math.random() * 300 + 50
			); // длительность глитча (50-350мс)
		};

		const initialTimeout = setTimeout(triggerGlitch, 3000);
		return () => clearTimeout(initialTimeout);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={container}
	class="terminal-container"
	onmousemove={handleMouseMove}
	onmouseenter={() => (isInside = true)}
	onmouseleave={() => (isInside = false)}
	style="filter: brightness({ui.brightness}%) saturate({ui.saturation}%);"
>
	<!-- CURSOR -->
	<div
		class="custom-mouse"
		style:left="{cursorX}px"
		style:top="{cursorY}px"
		style:display={isInside ? 'block' : 'block'}
	></div>

	<!-- SVG Фильтр для RGB Shift (размытие каналов) -->
	<svg class="svg-filters" xmlns="www.w3.org">
		<filter id="rgb-shift">
			<feOffset in="SourceGraphic" dx="2" dy="0" result="red" />
			<feOffset in="SourceGraphic" dx="-2" dy="0" result="blue" />
			<feBlend in="red" in2="blue" mode="screen" />
		</filter>
	</svg>

	<!-- <Scanlines /> -->

	<div class="terminal-screen" class:glitch-active={isGlitching}>
		<!-- Рендерим переданный контент здесь -->
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.terminal-container {
		padding: 2rem 4rem 3rem 4rem;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Courier New', monospace;
		/* для аутентичности (ЭЛТ мониторы никогда не были четкими) */
		filter: blur(0.5px);
		/* скрываем реальный системный курсор внутри контейнера */
		cursor: none !important;
	}
	.terminal-container :global(*) {
		cursor: none !important;
	}

	.custom-mouse {
		position: absolute;
		width: 20px;
		height: 20px;
		background-color: transparent;
		/* пропускает клики сквозь себя */
		pointer-events: none;
		z-index: 9999;

		/* устанавливаем иконку как маску */
		-webkit-mask-image: url('/static/cursor.svg');
		mask-image: url('/static/cursor.svg');
		-webkit-mask-size: contain;
		mask-size: contain;
		mask-repeat: no-repeat;

		/* цвет курсора можно менять этой строчкой: */
		background-color: var(--second-color);
	}

	.terminal-screen {
		position: relative;
		width: 100%;
		height: 100%;
		color: var(--accent-color);
		text-shadow: 0 0 12px rgba(0, 255, 42, 0.8);
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.svg-filters {
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
	}

	/* отвечает за анимацию рандомных глюков экрана */
	.glitch-active {
		animation: shake 0.2s infinite;
		filter: url(#rgb-shift) brightness(1.2) contrast(1.2) blur(0.9px);
		pointer-events: none;
	}
	@keyframes shake {
		0% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(2px, -1px);
		}
		50% {
			transform: translate(-1px, 2px);
		}
		75% {
			transform: translate(1px, -2px);
		}
		100% {
			transform: translate(0, 0);
		}
	}
</style>
