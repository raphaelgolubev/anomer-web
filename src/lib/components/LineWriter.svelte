<script lang="ts">
    import { onMount } from 'svelte';

    let { 
        lines = [], 
        speed = 5, 
        onComplete = () => {} 
    } = $props();

    let currentLineIndex = $state(0);
    let currentCharIndex = $state(0);
    let displayedLines = $state<string[]>([]);

    // Инициализируем массив пустых строк для каждой входящей строки
    onMount(() => {
        displayedLines = lines.map(() => "");
        typeNextChar();
    });

    function typeNextChar() {
        // Проверяем, не закончились ли все строки
        if (currentLineIndex >= lines.length) {
            onComplete();
            return;
        }

        const currentFullText = lines[currentLineIndex];

        // Если в текущей строке еще есть символы
        if (currentCharIndex < currentFullText.length) {
            displayedLines[currentLineIndex] += currentFullText[currentCharIndex];
            currentCharIndex++;
            setTimeout(typeNextChar, speed);
        } else {
            // Переходим к следующей строке
            currentLineIndex++;
            currentCharIndex = 0;
            // Небольшая пауза между строками для естественности
            setTimeout(typeNextChar, speed * 2);
        }
    }
</script>

{#each displayedLines as line, i}
    {#if line.length > 0 || i === currentLineIndex}
        <div class="system-line">
            {line}{#if i === currentLineIndex && currentLineIndex < lines.length}<span class="cursor">_</span>{/if}
        </div>
    {/if}
{/each}

<style>
    .system-line {
        min-height: 1.2em;
    }
    .cursor {
        animation: blink 1s step-end infinite;
    }
    @keyframes blink {
        50% { opacity: 0; }
    }
</style>
