<script lang="ts">
	type LineType = 'default' | 'error' | 'success' | 'warning';

	type TerminalLine = string | { 
		text: string; 
		speed?: number; 
		delay?: number; 
		type?: LineType; // Новое поле
	};
	type ScenarioState = 'BOOT' | 'SCANNING' | 'HARDWARE_CHECK' | 'AWAIT_LOGIN' | 'AWAIT_PASSWORD' | 'MAKE_AUTH';

	import { onMount } from 'svelte';

	import TerminalInput from '$lib/components/TerminalInput.svelte';
	import LineWriter from '$lib/components/LineWriter.svelte';
	import { initSystemInfo, systemInfo } from '$lib/fingerprint.svelte';
	import { ui } from '$lib/ui.svelte';
	import { sfx } from '$lib/sound';

	let currentState = $state<ScenarioState>('BOOT');
	let isInputActive = $state(false);
	let printable = $state<TerminalLine[]>([]);
	let clearTerminal = $state<(() => void) | undefined>(undefined);

	onMount(async () => {
		await initSystemInfo();
		transitionTo('BOOT');
	});

	let isStarted = $state(false);
	function startSystem() {
		if (isStarted) return; // Чтобы не запускать повторно
		sfx.init();
		isStarted = true;
		transitionTo('BOOT');
	}

	const states: Record<ScenarioState, () => Promise<void> | void> = {
		BOOT: () => {
			printable = ["ЗАГРУЗКА G.A.T.E. ..."];
		},

		SCANNING: () => {
			printable = [
				...printable,
				{ text: "[░░░░░░░░░░░░░░░░░░░░░░░]", speed: 25, delay: 500 },
				"Загрузка модулей...",
				{ text: "[░░░░░░░░░░░░░░░░░░░░░░░]", speed: 50, delay: 1000 },
				"Готово.",
			];
		},

		HARDWARE_CHECK: async () => {
			ui.isCrtActive = true; 
			clearTerminal?.();
			printable = [];
            // Ждем долю секунды для эффекта "прогрузки" монитора
            await new Promise(r => setTimeout(r, 2500));

			printable = [
				'--- SYSTEM CHECK START ---',
				'SOFTWARE/HARDWARE CHECK:',
				...systemInfo.asLines,
				{ text: "Проверка доступа...", speed: 10, delay: 500 },
				{ text: "ОБНАРУЖЕНА НЕАВТОРИЗОВАННАЯ ПОПЫТКА ДОСТУПА", speed: 10, delay: 2000, type: 'error' },
			];
		},

		AWAIT_LOGIN: () => {
			printable = [...printable, '', 'Пожалуйста, введите Ваш логин:', ' '];
			isInputActive = true;
		},

        AWAIT_PASSWORD: () => {
            printable = [...printable, '', 'Пожалуйста, введите Ваш пароль:', ' '];
			isInputActive = true;
        },

		MAKE_AUTH: () => {
            printable = [...printable, '', 'Выполняется авторизация...', ' '];
			// isInputActive = true;
        }
	};

	// Функция смены состояния (как .set_state() в aiogram)
	async function transitionTo(newState: ScenarioState) {
		currentState = newState;
		await states[newState]();
	}

	function handleWriterComplete() {
		switch (currentState) {
			case 'BOOT': 
                transitionTo('SCANNING'); 
                break;
			case 'SCANNING': 
                transitionTo('HARDWARE_CHECK'); 
                break;
			case 'HARDWARE_CHECK': 
                transitionTo('AWAIT_LOGIN'); 
                break;
		}
	}

	function userInput(value: string) {
		isInputActive = false; // Блокируем инпут на время обработки

		if (currentState === 'AWAIT_PASSWORD') {
			// маскируем ввод если это пароль
			let masked = '*'.repeat(value.length)
			printable = [...printable, `> ${masked}`];

			transitionTo('MAKE_AUTH');

		} else {
			// во всех остальных случаях не маскируем ввод
			printable = [...printable, `> ${value}`];
		}
        
        if (currentState === 'AWAIT_LOGIN') {
            // Переходим к следующему логическому этапу
            transitionTo('AWAIT_PASSWORD');
        }
	}
</script>

<!-- Слушаем клики и нажатия клавиш во всем окне -->
<svelte:window 
	onclick={startSystem} 
	onkeydown={startSystem} 
/>

{#if !isStarted}
	<button 
		type="button"
		class="boot-screen" 
		onclick={startSystem}
	>
		<span class="blink">PRESS ANY KEY OR CLICK TO BOOT G.A.T.E. OS</span>
	</button>
{:else}
	<LineWriter lines={printable} bind:bindClear={clearTerminal} onComplete={handleWriterComplete} />
{/if}


{#if isInputActive}
	<TerminalInput prefix="" onEnter={userInput} />
{/if}

<style>
	.boot-screen {
		/* Сбрасываем стандартные стили кнопки */
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
		
		/* Делаем на весь экран */
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none; /* Убираем рамку фокуса, если она портит дизайн */
	}

	.blink {
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		50% { opacity: 0.3; }
	}
</style>
