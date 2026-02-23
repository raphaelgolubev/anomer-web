// Используем расширение .svelte.ts, чтобы работали руны
class UISettings {
    isCrtActive = $state(false);
    
    toggleCrt() {
        this.isCrtActive = !this.isCrtActive;
    }
}

export const ui = new UISettings();
