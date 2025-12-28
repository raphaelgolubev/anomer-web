<script lang="ts">
	import { onMount } from 'svelte';

	// Принимаем children как специальный пропс-сниппет
	let { children } = $props();

	let isGlitching = $state(false);

	// Рандомные глитчи
	onMount(() => {
		const triggerGlitch = () => {
			isGlitching = true;
			setTimeout(
				() => {
					isGlitching = false;
					// Следующий глитч через случайное время (от 2 до 10 сек)
					setTimeout(triggerGlitch, Math.random() * 8000 + 2000);
				},
				Math.random() * 300 + 50
			); // Длительность глитча (50-350мс)
		};

		const initialTimeout = setTimeout(triggerGlitch, 3000);
		return () => clearTimeout(initialTimeout);
	});
</script>

<div class="terminal-container">
	<div class="flicker"></div>
	<div class="vignette"></div>
	<div class="crt-effect">
		<!-- SVG Фильтр для RGB Shift (размытие каналов) -->
		<svg class="svg-filters" xmlns="www.w3.org">
			<filter id="rgb-shift">
				<feOffset in="SourceGraphic" dx="2" dy="0" result="red" />
				<feOffset in="SourceGraphic" dx="-2" dy="0" result="blue" />
				<feBlend in="red" in2="blue" mode="screen" />
			</filter>
		</svg>

		<div class="terminal-screen" class:glitch-active={isGlitching}>
			<!-- Рендерим переданный контент здесь -->
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>

<style>
	.flicker {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(18, 16, 16, 0.02);
		opacity: 0;
		z-index: 11;
		animation: flicker 0.15s infinite;
		pointer-events: none;
	}

	@keyframes flicker {
		0% {
			opacity: 0.1;
		}
		50% {
			opacity: 0.02;
		}
		100% {
			opacity: 0.09;
		}
	}

	.glitch-active {
		animation: shake 0.2s infinite;
		filter: url(#rgb-shift) brightness(1.2) contrast(1.2) blur(0.9px);
		pointer-events: none;
	}

	.svg-filters {
		height: 0;
		width: 0;
		position: absolute;
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

	/* 3. Виньетка (затемнение по углам) */
	.vignette {
		position: absolute;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle, rgba(18, 16, 16, 0) 60%, rgba(0, 0, 0, 0.3) 100%);
		z-index: 12;
		pointer-events: none;
	}

	.terminal-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(ellipse at center, #003317 0%, #000000 100%);
		font-family: 'Courier New', monospace;
		/* Для аутентичности (ЭЛТ мониторы никогда не были четкими) */
		filter: blur(0.5px);
	}

	.terminal-screen {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 2.1rem;
		color: #90fba4;
		text-shadow: 0 0 8px rgba(150, 248, 166, 0.8);
		z-index: 2;
		display: flex;
		flex-direction: column;

		/* Цвет ползунка | Цвет дорожки */
		scrollbar-color: #90fba4 #001401;
		/* Можно сделать полосу тоньше */
		scrollbar-width: thin;
	}

	.crt-effect {
		position: relative;
		width: 96%;
		max-width: 1200px;
		height: 97%;
		background: #001401;
		/* border: 3px solid #2d8c53; */
		border-radius: 8px;
		/* box-shadow:
			0 0 40px rgba(155, 255, 175, 0.62),
			inset 0 0 100px rgba(0, 170, 40, 0.1); */
		overflow: hidden;
	}

	/* 1. Ширина всей полосы прокрутки */
	.terminal-screen::-webkit-scrollbar {
		width: 8px;
	}

	/* 2. Фон дорожки (track) */
	.terminal-screen::-webkit-scrollbar-track {
		background: #001401;
		border-left: 1px solid #caffdf33; /* Тонкая линия границы */
	}

	/* 3. Ползунок (thumb) */
	.terminal-screen::-webkit-scrollbar-thumb {
		background: #90fba4;
		border-radius: 4px;
		/* Эффект свечения */
		box-shadow: 0 0 10px rgba(144, 251, 164, 0.5);
	}

	/* 4. При наведении на ползунок */
	.terminal-screen::-webkit-scrollbar-thumb:hover {
		background: #caffdf;
	}
</style>
