class TerminalSound {
	private ctx: AudioContext | null = null;

	init() {
		if (!this.ctx) this.ctx = new AudioContext();
	}

	// Мягкий щелчок символа
	playChar() {
		// Частота пониже (400-600 Гц), длительность совсем крошечная
		this.beep(300, 0.008, 'sine', 0.03); 
	}

	// Глухой звук ошибки
	playError() {
		this.beep(120, 0.2, 'triangle', 0.08);
	}

	private beep(freq: number, duration: number, type: OscillatorType, volume: number) {
		if (!this.ctx || this.ctx.state === 'suspended') return;
		
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		const filter = this.ctx.createBiquadFilter();

		// Настройка фильтра (срезаем всё, что выше 2000 Гц, чтобы звук был "теплым")
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(2000, this.ctx.currentTime);

		osc.type = type;
		osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
		
		// Плавное затухание, чтобы не было щелчка в конце
		gain.gain.setValueAtTime(volume, this.ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(this.ctx.destination);

		osc.start();
		osc.stop(this.ctx.currentTime + duration);
	}
}

export const sfx = new TerminalSound();
