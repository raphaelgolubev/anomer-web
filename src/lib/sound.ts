import { ui } from "./ui.svelte";

class TerminalSound {
    private ctx: AudioContext | null = null;
    private humNode: { osc: OscillatorNode, gain: GainNode } | null = null;

    init() {
        if (!this.ctx) this.ctx = new AudioContext();
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    // Геттер для получения текущего коэффициента громкости (0.0 - 1.0)
    private get masterVolume() {
        return ui.volume / 100;
    }

    // управление паузой всего звукового движка
    setPaused(paused: boolean) {
        if (!this.ctx) return;

        if (paused && this.ctx.state === 'running') {
            this.ctx.suspend(); // мгновенная пауза всех осцилляторов
        } else if (!paused && this.ctx.state === 'suspended') {
            this.ctx.resume();  // продолжение работы
        }
    }

    updateHumVolume() {
        if (this.humNode && this.ctx) {
            // Плавно меняем громкость за 0.1 сек, чтобы не было щелчков
            this.humNode.gain.gain.setTargetAtTime(
                0.02 * this.masterVolume, 
                this.ctx.currentTime, 
                0.1
            );
        }
    }

    // короткий механический клик
    playTick() {
        this.beep(600, 0.005, 'triangle', 0.02, 1000);
    }

    playChar() {
        // this.beep(600, 0.005, 'triangle', 0.02, 1000);
        this.beep(420, 0.01, 'sawtooth', 0.015, 800);
    }

    // глухой удар при переходе на новую строку (Enter)
    playNewline() {
        this.beep(200, 0.05, 'sine', 0.04, 500);
    }

    // звук ошибки (двойной короткий сигнал)
    playAlert() {
        // this.beep(880, 0.1, 'square', 0.02, 2000);
        // setTimeout(() => this.beep(880, 0.1, 'square', 0.02, 2000), 150);

        const vol = 0.02; // Громкость без учета мастера (он применится в beep)
        this.beep(880, 0.1, 'square', vol, 2000);
        setTimeout(() => this.beep(880, 0.1, 'square', vol, 2000), 150);
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
        gain.gain.linearRampToValueAtTime(0.05 * this.masterVolume, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);

        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1);
    }

    playCrtOff() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // начинаем с высокой частоты и быстро уводим вниз
        osc.frequency.setValueAtTime(4000, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.8);
        
        gain.gain.setValueAtTime(0.05 * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.8);
        
        // останавливаем гул трансформатора, если он был включен
        this.stopHum();
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

        // плавное появление чтобы не было щелчка
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02 * this.masterVolume, this.ctx.currentTime + 2); // очень тихо!

        osc.connect(filter).connect(gain).connect(this.ctx.destination);
        osc.start();

        this.humNode = { osc, gain };
    }

    // выключение гула
    stopHum() {
        if (!this.humNode || !this.ctx) return;
        
        const { osc, gain } = this.humNode;
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        setTimeout(() => {
            osc.stop();
            this.humNode = null;
        }, 500);
    }

    playGlitchSfx() {
        if (!this.ctx) return;

        // создаем буфер с белым шумом (0.1 секунды)
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // заполняем случайными числами (шум)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        source.buffer = buffer;

        // настраиваем фильтр (сделаем звук "песочным")
        filter.type = 'bandpass'; 
        filter.frequency.setValueAtTime(1500, this.ctx.currentTime);
        filter.Q.setValueAtTime(10, this.ctx.currentTime);

        // резкая огибающая громкости (щелчки)
        gain.gain.setValueAtTime(0.04 * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

        source.connect(filter).connect(gain).connect(this.ctx.destination);
        
        source.start();
    }

    playLogonSfx() {
        if (!this.ctx) return;

        // частоты для аккорда (например, G4, C5, E5)
        const notes = [392.00, 523.25, 659.25]; 
        const startTime = this.ctx.currentTime;

        notes.forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            const filter = this.ctx!.createBiquadFilter();

            osc.type = 'sine'; // самая мягкая волна
            osc.frequency.setValueAtTime(freq, startTime + i * 0.15); // задержка между нотами

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, startTime);

            // мягкое появление и долгое затухание
            gain.gain.setValueAtTime(0, startTime + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.04 * this.masterVolume, startTime + i * 0.15 + 0.1); 
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + i * 0.15 + 1.5);

            osc.connect(filter).connect(gain).connect(this.ctx!.destination);

            osc.start(startTime + i * 0.15);
            osc.stop(startTime + i * 0.15 + 1.5);
        });
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
        
        gain.gain.setValueAtTime(volume * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(filter).connect(gain).connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
}


export const sfx = new TerminalSound();
