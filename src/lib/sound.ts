class TerminalSound {
	private ctx: AudioContext | null = null;

	init() {
		if (!this.ctx) this.ctx = new AudioContext();
	}

	// Короткий "щелчок" или "бип"
	playChar() {
		this.beep(800, 0.005, 'square', 0.05);
	}

	// Звук ошибки
	playError() {
		this.beep(150, 0.3, 'sawtooth', 0.1);
	}

	private beep(freq: number, duration: number, type: OscillatorType, volume: number) {
		if (!this.ctx) return;
		
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();

		osc.type = type;
		osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
		
		gain.gain.setValueAtTime(volume, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

		osc.connect(gain);
		gain.connect(this.ctx.destination);

		osc.start();
		osc.stop(this.ctx.currentTime + duration);
	}
}

export const sfx = new TerminalSound();
