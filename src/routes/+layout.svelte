<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import monitorImg from '$lib/assets/monitor_inner.png';

	import { sfx } from '$lib/sound';
	import { ui } from '$lib/ui.svelte';
	import { fade } from 'svelte/transition';

	import OSDMenu from '$lib/components/OSDMenu.svelte';
	import CRTOverlay from '$lib/components/CRTOverlay.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import TerminalHeader from '$lib/components/TerminalHeader.svelte';
	import TerminalContent from '$lib/components/TerminalContent.svelte';
	import TerminalFooter from '$lib/components/TerminalFooter.svelte';
	import { terminal } from '$lib/terminal.svelte';

	let { children } = $props();

	function menuButton() {
		sfx.playTick();
		ui.toggleOsdVisible();
	}

	function selectButton() {
		sfx.playTick();
		ui.toggleOsd();
	}

	function upButton() {
		sfx.playTick();
		if (ui.isOsdOpen) {
			// Навигация "Вверх" или "Увеличение значения"
			ui.navigate(-1);
		}
	}

	function downButton() {
		sfx.playTick();
		if (ui.isOsdOpen) {
			// Навигация "Вниз" или "Уменьшение значения"
			ui.navigate(1);
		}
	}

	$effect(() => {
        // подписываемся на изменение громкости
        const vol = ui.volume;
        sfx.updateHumVolume();
    });

	onMount(() => {
		const handleVisibilityChange = () => {
			// document.hidden возвращает true, если вкладка неактивна
			const isHidden = document.hidden;
			sfx.setPaused(isHidden);
		};

		// подписываемся на событие изменения видимости
		document.addEventListener('visibilitychange', handleVisibilityChange);

		// убираем слушатель при уничтожении приложения
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<svelte:window onclick={() => sfx.init()} onkeydown={() => sfx.init()} />

<div class="app-container">
	<div class="monitor-wrapper">
		<img src={monitorImg} class="monitor-frame" alt="Frame" />

		<div class="screen-content">
			<CRTOverlay />

			<div class="crt-physical-layer" class:monitor-off={!ui.isMonitorActive}>
				<Terminal>
					{#if ui.isGateOSActive}
						<div transition:fade={{ duration: 1000 }}>
							<TerminalHeader deviceId={terminal.deviceId} />
						</div>
					{/if}

					<TerminalContent>
						{@render children()}
						<OSDMenu />
					</TerminalContent>

					{#if ui.isGateOSActive}
						<div transition:fade={{ duration: 1000 }}>
							<TerminalFooter />
						</div>
					{/if}
				</Terminal>
			</div>
		</div>

		<div class="controls-group">
			<div class="power-section">
				<button
					class="bezel-btn power"
					class:pressed={ui.isMonitorActive}
					onclick={terminal.handlePowerToggle}
					aria-label="Питание"
					title="Питание"
				>
					<span class="icon" aria-hidden="true">⏻</span>
				</button>
				<div class="power-led" class:active={ui.isMonitorActive}></div>
			</div>

			<button class="bezel-btn" title="Вверх" aria-label="Вверх" onclick={upButton}>
				<span class="icon">▲</span>
			</button>
			<button class="bezel-btn" title="Вниз" aria-label="Вниз" onclick={downButton}>
				<span class="icon">▼</span>
			</button>
			<button class="bezel-btn" title="Выбрать" aria-label="Выбрать" onclick={selectButton}>
				<span class="icon">↵</span>
			</button>
			<button class="bezel-btn" title="Меню" aria-label="Меню" onclick={menuButton}>
				<span class="icon">≡</span>
			</button>
		</div>
	</div>
</div>

<style>
	:global(body, html) {
		margin: 0;
		padding: 0;
		height: 100%;
		/* цвет монитора */
		background-image: linear-gradient(
			to bottom right,
			var(--monitor-gradient-top-left),
			var(--monitor-gradient-bottom-right)
		);
		/* запрещаем прокрутку всего окна */
		overflow: hidden;
	}

	.crt-physical-layer {
		width: 100%;
		height: 100%;
		transition:
			transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
			opacity 0.6s linear,
			filter 0.6s linear;
		transform-origin: center;
		background: #000;
	}

	/* состояние выключенного монитора */
	.monitor-off {
		transform: scale(1, 0.002); /* схлопывание в линию */
		opacity: 0;
		filter: brightness(5); /* вспышка при выключении */
		pointer-events: none; /* чтобы нельзя было кликать в темноте */
	}

	.app-container {
		display: flex;
		justify-content: center; /* центрирование по горизонтали */
		align-items: center; /* центрирование по вертикали */
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.monitor-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		max-width: 84vw;
		max-height: 84vh;
		overflow: visible;
	}

	.monitor-frame {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* рамка должна быть СВЕРХУ контента */
		z-index: 10;
		/* чтобы можно было кликать по кнопкам под рамкой */
		pointer-events: none;
		border-radius: 1.3%;
	}

	.screen-content {
		position: absolute;
		top: 8px;
		left: 8px;
		width: 98%;
		height: 97.5%;
		background: black;
		overflow-y: auto;
		/* контент под рамкой */
		z-index: 5;
	}

	.controls-group {
		display: flex;
		flex-direction: row-reverse;
		gap: 30px;
		margin: 1rem auto 0 auto;
		position: relative;
		width: 90%;
		align-items: anchor-center;
	}

	.bezel-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		width: 46px;
		height: 46px;
		border-radius: 50%;
		cursor: pointer;

		background-color: var(--case-color);
		border: 1px solid var(--case-shadow);
		box-shadow:
			inset 1px 1px 1px var(--case-light),
			/* острая фаска сверху */ inset -1px -1px 1px rgba(0, 0, 0, 0.2),
			/* тень снизу внутри */ 1px 1px 0px rgba(0, 0, 0, 0.15),
			/* твердая тень на корпусе */ 2px 2px 3px rgba(0, 0, 0, 0.1); /* мягкое рассеивание */

		transition: none;
	}
	.bezel-btn:active,
	.bezel-btn.pressed {
		transform: translate(1px, 1px);
		/* инвертируем фаску: теперь свет снизу, тьма сверху */
		box-shadow:
			inset -1px -1px 1px var(--case-light),
			inset 2px 2px 2px rgba(0, 0, 0, 0.2);
		background-color: #cfc8aa; /* чуть темнее при нажатии */
	}

	.bezel-btn.power {
		border-radius: 0;
		background: radial-gradient(circle at 35% 35%, #e0e0e0, #999);
		border-color: #777;
		width: 60px;
		height: 60px;
	}

	.icon {
		font-family: monospace;
		font-size: 20px;
		font-weight: 900;

		/* цвет глубины пластика */
		color: #8b8469;

		/* острая светлая линия снизу создает эффект вырезанного желоба */
		text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.5);

		user-select: none;
		opacity: 0.8;
	}

	.bezel-btn:active .icon {
		text-shadow: none;
		opacity: 1;
	}

	.power-section {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		gap: 10px;
	}

	.power-led {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #331a00; /* темно-оранжевый в выключенном состоянии */
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.power-led.active {
		background: #ffaa00; /* янтарный светодиод */
		box-shadow:
			0 0 10px #ffaa00,
			0 0 2px white;
	}
</style>
