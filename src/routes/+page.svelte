<script lang="ts">
	import { onMount } from 'svelte';

	import TerminalContent from '$lib/components/TerminalContent.svelte';
	import FuncKey from '$lib/components/FuncKey.svelte';
	import FuncKeyContainer from '$lib/components/FuncKeysContainer.svelte';
	import TerminalInput from '$lib/components/TerminalInput.svelte';
	import TypewriterLine from '$lib/components/TypeWriter.svelte';

	import { initSystemInfo, systemInfo } from '$lib/fingerprint.svelte';

	let visibleLines = $state<string[]>([]);
	let currentLineIndex = $state(0);

	function startNextLine() {
		const lines = systemInfo.asLines;
		if (currentLineIndex < lines.length) {
			visibleLines = [...visibleLines, lines[currentLineIndex]];
			currentLineIndex++;
		}
	}

	onMount(async () => {
		await initSystemInfo();
		startNextLine();
	});
</script>

<TerminalContent>
	<div class="terminal-output">
		{#each visibleLines as line, i}
			<TypewriterLine text={line} onComplete={startNextLine} speed={20} />
		{/each}
	</div>
</TerminalContent>

<TerminalInput prefix="guest@system:~$" />

<FuncKeyContainer>
	<FuncKey link="/help">F1 [/help]</FuncKey>
	<FuncKey link="/auth">F2 [/auth]</FuncKey>
	<FuncKey link="/register">F3 [/register]</FuncKey>
	<FuncKey link="/hack">F4 [hack pentagon]</FuncKey>
	<FuncKey link="/info">F5 [info]</FuncKey>
	<FuncKey link="/about">F6 [about]</FuncKey>
</FuncKeyContainer>

<style>
	.terminal-output {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
		display: flex;
		flex-direction: column;
		white-space: pre-line;
		font-family: 'Courier New', monospace;
		line-height: 1.4;
	}
</style>
