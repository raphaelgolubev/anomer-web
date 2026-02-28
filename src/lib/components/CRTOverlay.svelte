<div class="crt-overlay"></div>

<style>
	.crt-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
		pointer-events: none;

		background: 
			/* блик слева вверху */
			radial-gradient(
				circle at 20% 20%, 
				rgba(255, 255, 255, 0.24) 0%, 
				transparent 50%
			),
			/* виньетка */
			radial-gradient(
				circle at center, 
				transparent 50%, 
				rgba(0, 0, 0, 0.3) 100%
			);

		/* эффект стеклянного блеска через наложение */
		mix-blend-mode: screen; 
}
</style>
