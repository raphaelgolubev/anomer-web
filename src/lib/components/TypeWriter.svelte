<script lang="ts">
	import { onMount } from 'svelte';

	let { text = "", speed = 30, onComplete = () => {} } = $props();
	let displayedText = $state("");
	let currentIndex = 0;

	onMount(() => {
		const interval = setInterval(() => {
			if (currentIndex < text.length) {
				displayedText += text[currentIndex];
				currentIndex++;
			} else {
				clearInterval(interval);
				onComplete(); // Уведомляем, что строка готова
			}
		}, speed);

		return () => clearInterval(interval);
	});
</script>

<div class="system-line">
	{displayedText}<span class="char-cursor"></span>
</div>

<style>
	.char-cursor {
		background-color: #90fba4;
		color: #001401; /* Цвет текста под курсором инвертируется */
		box-shadow: 0 0 8px #90fba4;
		min-width: 1ch; /* Ширина в один символ */
		display: inline-block;
		line-height: 1;
	}
</style>