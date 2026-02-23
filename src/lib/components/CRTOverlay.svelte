<div class="crt-overlay"></div>

<style>
    .crt-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		width: 100%;
		height: 100%;
		/* Поверх всех элементов, но не мешает кликам */
		z-index: 9999;
		pointer-events: none;

		/* Виньетка */
		/* background: radial-gradient(
			circle,
			var(--vinguette-1) 40%,
			var(--vinguette-2) 70%,
			var(--vinguette-3) 100%
		); */
	}
</style>