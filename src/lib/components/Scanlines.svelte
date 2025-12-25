<div class="scanlines"></div>

<style>
	.scanlines {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			0deg,
			transparent 0px,
			transparent 2px,
			rgba(86, 252, 150, 0.3) 2px,
			rgba(66, 241, 86, 0.3) 3px
		);
		pointer-events: none;
		z-index: 3;
		animation: scanline-move 25s linear infinite;
	}

	@keyframes scanline-move {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-3px);
		}
	}
</style>
