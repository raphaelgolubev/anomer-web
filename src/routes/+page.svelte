<script lang="ts">
	import { onMount } from 'svelte';

	import TerminalContent from '$lib/components/TerminalContent.svelte';
	import FuncKey from '$lib/components/FuncKey.svelte';
	import TerminalFooter from '$lib/components/TerminalFooter.svelte';
	import TerminalInput from '$lib/components/TerminalInput.svelte';
	import TypewriterLine from '$lib/components/TypeWriter.svelte';

	import { initSystemInfo, systemInfo } from '$lib/fingerprint.svelte';

	let printable = $state<string[]>([]);
	let visibleLines = $state<string[]>([]);
	let currentLineIndex = $state(0);

	let userInputContainer: HTMLDivElement;

	function startNextLine() {
		if (currentLineIndex < printable.length) {
			visibleLines = [...visibleLines, printable[currentLineIndex]];
			
			currentLineIndex++;
		}
	}

	function userInput(value: string) {
		console.log(`userInput is ${value}`);

		let text = document.createElement('p');
		text.textContent = value;

		userInputContainer.appendChild(text);
	}

	onMount(async () => {
		await initSystemInfo();

		printable = [...systemInfo.asLines, "====="];
		
		const welcome: string[] = [
			"Добро пожаловать в систему.",
			"Введите свое имя:"
		];

		printable.push(...welcome);

		startNextLine();
	});
</script>

<TerminalContent>
	<div class="terminal-output">
		{#each visibleLines as line, i}
			<TypewriterLine text={line} onComplete={startNextLine} speed={5} />
		{/each}
		<div class="user-input" bind:this={userInputContainer}>
			<!-- ... -->
		</div>
	</div>
</TerminalContent>

<TerminalInput prefix="guest@system:~$" onEnter={userInput}/>

<TerminalFooter>
	<FuncKey link="/help">F1 [/help]</FuncKey>
	<FuncKey link="/auth">F2 [/auth]</FuncKey>
	<FuncKey link="/register">F3 [/register]</FuncKey>
	<FuncKey link="/hack">F4 [hack pentagon]</FuncKey>
	<FuncKey link="/info">F5 [info]</FuncKey>
	<FuncKey link="/about">F6 [about]</FuncKey>
</TerminalFooter>

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
