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
	{displayedText}
</div>
