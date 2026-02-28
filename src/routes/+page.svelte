<script lang="ts">
	import { onMount } from 'svelte';
	import TerminalInput from '$lib/components/TerminalInput.svelte';
	import LineWriter from '$lib/components/LineWriter.svelte';
	import { initSystemInfo } from '$lib/fingerprint.svelte';
	import { terminal } from '$lib/terminal.svelte';

	onMount(async () => {
		await initSystemInfo();
	});
</script>

<svelte:window 
	onclick={() => terminal.initialize()} 
	onkeydown={() => terminal.start()} 
/>

{#if !terminal.isStarted}
	<button type="button" class="boot-screen" onclick={() => terminal.start()}>
		<span class="blink">НАЖМИТЕ ЛЮБУЮ КНОПКУ ДЛЯ ВЫХОДА ИЗ РЕЖИМА ОЖИДАНИЯ</span>
	</button>
{:else}
	<LineWriter 
        lines={terminal.printable} 
        bind:bindClear={terminal.clearTerminal} 
        onComplete={() => terminal.handleWriterComplete()} 
    />
{/if}

{#if terminal.isInputActive}
	<TerminalInput prefix="" onEnter={(val: string) => terminal.handleUserInput(val)} />
{/if}

<style>
	.boot-screen {
		/* сбрасываем стандартные стили кнопки */
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
		
		/* делаем на весь экран */
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none; /* убираем рамку фокуса */
	}

	.blink {
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		50% { opacity: 0.3; }
	}
</style>
