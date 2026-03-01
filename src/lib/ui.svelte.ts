import { type OsdTab } from "./types";

const STORAGE_KEY = 'anom_monitor_settings';

// используем расширение .svelte.ts, чтобы работали руны
class UISettings {
    isMonitorActive = $state(false);
    isGateOSActive = $state(false);

    // OSD - On-Screen Display
    isOsdOpen = $state(false);
    osdMode = $state<'TABS' | 'ITEMS' | 'EDIT'>('TABS');
    activeTabIdx = $state(0);
    activeItemIdx = $state(0);

    // Параметры
    brightness = $state(100);
    saturation = $state(100);
    volume = $state(50);
    glitchFreq = $state(30);

    constructor() {
        this.loadSettings();

        // Автоматическое сохранение при изменении реактивных переменных
        $effect.root(() => {
            $effect(() => {
                this.saveSettings();
            });
        });
    }

    private saveSettings() {
        const data = {
            brightness: this.brightness,
            saturation: this.saturation,
            volume: this.volume
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    private loadSettings() {
        if (typeof localStorage === 'undefined') return;
        
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.brightness = parsed.brightness ?? 100;
                this.saturation = parsed.saturation ?? 100;
                this.volume = parsed.volume ?? 50;
            } catch (e) {
                console.error("Ошибка чтения настроек OSD", e);
            }
        }
    }

    // Дерево настроек
    osdTree: OsdTab[] = [
        {
            id: 'PICTURE', icon: '☼', label: 'ИЗОБРАЖЕНИЕ',
            items: [
                { id: 'br', label: 'BRIGHTNESS', value: () => this.brightness, step: 5, max: 150, adjust: (d) => this.brightness = Math.max(0, Math.min(this.brightness + d, 150)) },
                { id: 'sa', label: 'SATURATION', value: () => this.saturation, step: 5, max: 200, adjust: (d) => this.saturation = Math.max(0, Math.min(this.saturation + d, 200)) }
            ]
        },
        {
            id: 'AUDIO', icon: '♪', label: 'ЗВУК',
            items: [
                { id: 'vol', label: 'VOLUME', value: () => this.volume, step: 2, max: 100, adjust: (d) => this.volume = Math.max(0, Math.min(this.volume + d, 100)) }
            ]
        },
        {
            id: 'SYSTEM', icon: '⚙', label: 'СИСТЕМА',
            items: [
                { id: 'gl', label: 'GLITCH FREQ', value: () => this.glitchFreq, step: 10, max: 100, adjust: (d) => this.glitchFreq = Math.max(0, Math.min(this.glitchFreq + d, 100)) }
            ]
        }
    ];

    toogleMonitor() {
        this.isMonitorActive = !this.isMonitorActive;
    }

    toogleGateOS() {
        this.isGateOSActive = !this.isGateOSActive;
    }

    toggleOsdVisible() {
        this.isOsdOpen = !this.isOsdOpen;
    }

    toggleOsd() {
        if (this.isOsdOpen) {
            // Циклическое переключение режимов внутри открытого меню
            if (this.osdMode === 'TABS') this.osdMode = 'ITEMS';
            else if (this.osdMode === 'ITEMS') this.osdMode = 'EDIT';
            else if (this.osdMode === 'EDIT') this.osdMode = 'TABS';
            else this.osdMode = 'ITEMS'
        }
    }

    // Метод перемещения (кнопки UP / DOWN)
    navigate(delta: number) {
        if (this.osdMode === 'TABS') {
            // Листаем иконки вкладок
            const len = this.osdTree.length;
            this.activeTabIdx = (this.activeTabIdx + delta + len) % len;
            this.activeItemIdx = 0; // Сбрасываем выбор пункта при смене вкладки
        } 
        else if (this.osdMode === 'ITEMS') {
            // Листаем список параметров в текущей вкладке
            const items = this.osdTree[this.activeTabIdx].items;
            this.activeItemIdx = (this.activeItemIdx + delta + items.length) % items.length;
        } 
        else if (this.osdMode === 'EDIT') {
            // Меняем числовое значение (delta * -1 чтобы Вверх прибавляло, а Вниз убавляло)
            const item = this.osdTree[this.activeTabIdx].items[this.activeItemIdx];
            item.adjust(delta * -1 * item.step);
        }
    }

}

export const ui = new UISettings();
