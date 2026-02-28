<script lang="ts">
	import { ui } from '$lib/ui.svelte';
	import { sfx } from '$lib/sound';
	import { type LineTypeValue } from '$lib/types';

	let { 
		lines = [], 
		bindClear = $bindable(), 
		onComplete = () => {} 
	} = $props();

    let displayedLines = $state<{text: string, type: LineTypeValue}[]>([]);
	let isTyping = $state(false);

	// экспортируем метод наружу
	bindClear = () => {
		displayedLines = [];
		isTyping = false;
	};

	$effect(() => {
		if (lines.length > displayedLines.length && !isTyping) {
			startTyping();
		}
	});

	async function startTyping() {
        isTyping = true;
        for (let i = displayedLines.length; i < lines.length; i++) {
            const item = lines[i];
            const isObj = typeof item === 'object';
            
            const text = isObj ? item.text : item;
            const type = (isObj && item.type) ? item.type : 'default';
            const speed = isObj && item.speed !== undefined ? item.speed : 10;

			// если это ошибка, можно издать звук перед началом строки
			if (type === 'error' && ui.isMonitorActive) sfx.playAlert();

            displayedLines.push({ text: "", type }); 
            
            for (let j = 0; j < text.length; j++) {
                displayedLines[i].text += text[j];

				// звук для каждого символа (кроме пробелов)
				if (text[j] !== " " && ui.isMonitorActive) {
					sfx.playChar();
				}

                await new Promise(r => setTimeout(r, speed));
            }

			if (ui.isMonitorActive) {
				sfx.playNewline();
			}
            await new Promise(r => setTimeout(r, isObj ? (item.delay ?? 300) : 300));
        }
        isTyping = false;
        onComplete();
    }
</script>

<div class="terminal-output">
    {#each displayedLines as line, i}
        <div class="system-line {line.type}">
            <span>{line.text}</span>
        </div>
    {/each}
</div>

<style>
	.terminal-output {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.system-line {
		min-height: 1.2em;
		word-break: break-all;
		text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
	}
	.system-line.error { color: #ff3e00; text-shadow: 0 0 8px rgba(255, 62, 0, 0.6); }
    .system-line.success { color: #00ff41; }
    .system-line.warning { color: #ffcc00; }
</style>
