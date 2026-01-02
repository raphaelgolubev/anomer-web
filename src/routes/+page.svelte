<script lang="ts">
	import { onMount } from 'svelte';

	import TerminalInput from '$lib/components/TerminalInput.svelte';
	import TypewriterLine from '$lib/components/TypeWriter.svelte';

	import { initSystemInfo, systemInfo } from '$lib/fingerprint.svelte';

	let printable = $state<string[]>([]);
	let visibleLines = $state<string[]>([]);
	let currentLineIndex = $state(0);
	let userEntries = $state<string[]>([]);
	// let userInputContainer: HTMLDivElement;

	function startNextLine() {
		if (currentLineIndex < printable.length) {
			visibleLines = [...visibleLines, printable[currentLineIndex]];

			currentLineIndex++;
		}
	}

	function userInput(value: string) {
		userEntries.push(value);
	}

	onMount(async () => {
		await initSystemInfo();

		printable = [...systemInfo.asLines, '====='];

		const welcome: string[] = ['Добро пожаловать в систему.', 'Введите свое имя:'];

		printable.push(...welcome);

		startNextLine();
	});
</script>

<div class="page-container">
	<div class="terminal-output">
		{#each visibleLines as line (line)}
			<TypewriterLine text={line} onComplete={startNextLine} speed={5} />
		{/each}
		<div class="user-input">
			{#each userEntries as entry (entry)}
				<p>{entry}</p>
			{/each}
		</div>
	</div>

	<TerminalInput prefix="guest@system:~$" onEnter={userInput} />
</div>

<style>
	.page-container {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
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
