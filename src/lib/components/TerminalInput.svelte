<script lang="ts">
	import { onMount } from 'svelte';

	// по умолчанию префикс перед инпутом будет '>'
	let { prefix = '>' } = $props();

	let inputValue = $state('');
	let selectionStart = $state(0);
	let selectionEnd = $state(0);
	let isFocused = $state(false);
	let inputElement: HTMLInputElement;

	// Находим границы выделения
	let start = $derived(Math.min(selectionStart, selectionEnd));
	let end = $derived(Math.max(selectionStart, selectionEnd));

	// Вычисляем части текста на основе выделения
	let textBefore = $derived(
		inputValue.slice(0, Math.min(selectionStart, selectionEnd))
	);
	let textSelected = $derived(
		inputValue.slice(
			Math.min(selectionStart, selectionEnd), 
			Math.max(selectionStart, selectionEnd)
		)
	);
	// Если выделения нет, textAfter должен начинаться с позиции курсора + 1,
	// так как один символ (cursorChar) мы уже отрисовали.
	let textAfter = $derived(
		textSelected.length > 0 ? inputValue.slice(end) : inputValue.slice(start + 1)
	);
	// Символ ПОД курсором
	let cursorChar = $derived(inputValue[selectionEnd] || ' '); 

	// Синхронизируем позицию курсора при вводе или кликах
	function syncCursor(e: Event) {
		// получаем скрытый инпут
		const el = e.target as HTMLInputElement;

		// получаем начало и конец выделения инпута
		selectionStart = el.selectionStart || 0;
		selectionEnd = el.selectionEnd || 0;
	}

	onMount(() => {
		document.addEventListener('selectionchange', syncCursor);
		return () => document.removeEventListener('selectionchange', syncCursor);
	});

	// Позволяем кликнуть в любое место строки, чтобы сфокусировать инпут
	function focusInput() {
		inputElement.focus();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="terminal-wrapper" onclick={focusInput} role="textbox" tabindex="-1">
	<span class="prefix">{prefix}</span>

	<div class="display-area">
		<!-- Визуальный слой -->
		<div class="visual-layer">
			<!-- Здесь небольшой костыль в том, что НЕОБХОДИМО писать разметку в одну строку -->
			<span>{textBefore}</span>{#if textSelected.length > 0}<span class="selection-block">{textSelected}</span>{:else}<span class="block-cursor" class:blink={!isFocused}>{cursorChar}</span>{/if}<span>{textAfter}</span>
		</div>
		
		<!-- Инпут должен быть сверху, чтобы ловить мышь -->
		<input
			bind:this={inputElement}
			bind:value={inputValue}
			oninput={syncCursor}
			onfocus={() => isFocused = true}
			onblur={() => isFocused = false}
			spellcheck="false"
			autocomplete="off"
		/>
	</div>
</div>

<style>
	.terminal-wrapper {
		display: flex;
		font-family: 'Courier New', monospace;
		color: #90fba4;
		cursor: text;
		font-size: 1.2rem;
	}

	.display-area {
		position: relative;
		display: inline-block;
		flex: 1;
		min-height: 1.2em;
	}

	.visual-layer {
		white-space: pre-wrap;
		word-break: break-all;
		pointer-events: none; /* Пропускаем клики сквозь визуальный слой на инпут */
	}

	.prefix {
		margin-right: 10px;
		user-select: none;
	}

	/* Тот самый блочный курсор */
	.block-cursor {
		background-color: #90fba4;
		color: #001401; /* Цвет текста под курсором инвертируется */
		box-shadow: 0 0 8px #90fba4;
		min-width: 1ch; /* Ширина в один символ */
		display: inline-block;
		line-height: 1;
	}

	.block-cursor.blink {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		0%,
		100% {
			background-color: #90fba4;
			color: #001401;
			box-shadow: 0 0 8px #90fba4;
		}
		50% {
			background-color: transparent;
			color: inherit;
			box-shadow: 0 0 8px #90fba400;
		}
	}

	input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0; /* Делаем полностью прозрачным */
		background: transparent;
		color: transparent;
		caret-color: transparent; /* Скрываем стандартную палочку-курсор */
		border: none;
		outline: none;
		z-index: 2; /* Инпут выше текста */
		font-family: inherit;
		font-size: inherit;
	}

	/* Стиль для выделенного текста */
	.selection-block {
		background-color: #90fba4;
		color: #001401;
		box-shadow: 0 0 5px #90fba4;
	}

	/* Блочный курсор (только когда нет выделения) */
	.block-cursor {
		background-color: #90fba4;
		color: #001401;
		min-width: 1ch;
		display: inline-block;
		line-height: 1;
	}
</style>
