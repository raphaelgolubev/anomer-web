// используем расширение .svelte.ts, чтобы работали руны
class UISettings {
    isMonitorActive = $state(false);
    isGateOSActive = $state(false);

    toogleMonitor() {
        this.isMonitorActive = !this.isMonitorActive;
    }
    
    toogleGateOS() {
        this.isGateOSActive = !this.isGateOSActive;
    }
}

export const ui = new UISettings();
