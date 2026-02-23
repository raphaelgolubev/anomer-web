class TerminalSound {
    private ctx: AudioContext | null = null;
    private humNode: { osc: OscillatorNode, gain: GainNode } | null = null;

    init() {
        if (!this.ctx) this.ctx = new AudioContext();
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    // короткий механический клик
    playTick() {
        this.beep(600, 0.005, 'triangle', 0.02, 1000);
    }

    // глухой удар при переходе на новую строку (Enter)
    playNewline() {
        this.beep(200, 0.05, 'sine', 0.04, 500);
    }

    // звук ошибки (двойной короткий сигнал)
    playAlert() {
        this.beep(880, 0.1, 'square', 0.02, 2000);
        setTimeout(() => this.beep(880, 0.1, 'square', 0.02, 2000), 150);
    }

    // эффект включения монитора (высокочастотный свист затухающий)
    playCrtOn() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(12000, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(15000, this.ctx.currentTime + 1);
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);

        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1);
    }

    // включение фонового гула
    startHum() {
        if (!this.ctx || this.humNode) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // низкая частота сети (50 Гц в Европе, 60 Гц в США)
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(50, this.ctx.currentTime);

        // фильтр чтобы гул был глухим и не мешал печати
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, this.ctx.currentTime);

        // плавное появление (fade-in), чтобы не было щелчка
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 2); // очень тихо!

        osc.connect(filter).connect(gain).connect(this.ctx.destination);
        osc.start();

        this.humNode = { osc, gain };
    }

    // выключение гула (если нужно, например, при выключении терминала)
    stopHum() {
        if (!this.humNode || !this.ctx) return;
        
        const { osc, gain } = this.humNode;
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        setTimeout(() => {
            osc.stop();
            this.humNode = null;
        }, 500);
    }

    // универсальный метод с фильтром
    private beep(freq: number, duration: number, type: OscillatorType, volume: number, filterFreq: number) {
        if (!this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(filter).connect(gain).connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}


export const sfx = new TerminalSound();
