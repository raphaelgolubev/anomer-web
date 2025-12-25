<script>
	// Принимаем children как специальный пропс-сниппет
	let { children } = $props();
</script>

<div class="terminal-container">
	<div class="crt-effect">
		<div class="terminal-screen">
			<!-- Рендерим переданный контент здесь -->
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>

<style>
	.terminal-container {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(ellipse at center, #003317 0%, #000000 100%);
		font-family: 'Courier New', monospace;
	}

	.terminal-screen {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 20px;
		color: #90fba4;
		text-shadow: 0 0 8px rgba(150, 248, 166, 0.8);
		z-index: 2;
		display: flex;
		flex-direction: column;

		/* Цвет ползунка | Цвет дорожки */
		scrollbar-color: #90fba4 #001401;
		/* Можно сделать полосу тоньше */
		scrollbar-width: thin;
	}

	.crt-effect {
		position: relative;
		width: 90%;
		max-width: 1200px;
		height: 85vh;
		background: #001401;
		border: 3px solid #2d8c53;
		border-radius: 8px;
		box-shadow:
			0 0 40px rgba(155, 255, 175, 0.62),
			inset 0 0 100px rgba(0, 170, 40, 0.1);
		overflow: hidden;
	}

	/* 1. Ширина всей полосы прокрутки */
	.terminal-screen::-webkit-scrollbar {
		width: 8px;
	}

	/* 2. Фон дорожки (track) */
	.terminal-screen::-webkit-scrollbar-track {
		background: #001401;
		border-left: 1px solid #caffdf33; /* Тонкая линия границы */
	}

	/* 3. Ползунок (thumb) */
	.terminal-screen::-webkit-scrollbar-thumb {
		background: #90fba4;
		border-radius: 4px;
		/* Эффект свечения */
		box-shadow: 0 0 10px rgba(144, 251, 164, 0.5);
	}

	/* 4. При наведении на ползунок */
	.terminal-screen::-webkit-scrollbar-thumb:hover {
		background: #caffdf;
	}
</style>
