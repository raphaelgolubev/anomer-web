<div class="scanlines"></div>

<style>
	.scanlines {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 3;

		background-image: linear-gradient(
			to bottom,
			var(--scanline-gradient-color-1) 0px,
			var(--scanline-gradient-color-2) 1px,
			transparent 1px,
			transparent 3px
		);
		background-size: 100% 3px;
		background-repeat: repeat;
		/* Это критично для устранения "грязи" при масштабе */
		image-rendering: pixelated;
	}
</style>
