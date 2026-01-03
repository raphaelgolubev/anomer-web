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
		background: radial-gradient(
			circle,
			rgba(18, 16, 16, 0) 40%,
			rgba(0, 0, 0, 0.25) 70%,
			rgba(0, 0, 0, 0.6) 100%
		);
	}
</style>