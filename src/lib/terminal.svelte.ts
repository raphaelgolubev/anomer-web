import { ScenarioState, LineType, type TerminalLine, type ScenarioStateValue } from './types';
import { ui } from './ui.svelte';
import { sfx } from './sound';
import { systemInfo } from './fingerprint.svelte';
import { generateHexId } from './utils';

class TerminalManager {
    // состояния
    readonly deviceId = $state(generateHexId(4)); 

    currentState = $state<ScenarioStateValue>(ScenarioState.PREBOOT);
    printable = $state<TerminalLine[]>([]);
    isInputActive = $state(false);
    isStarted = $state(false);

    // ссылка на функцию очистки
    clearTerminal: (() => void) | undefined = undefined;

    async initialize() {
        sfx.init();
    }

    async start() {
        if (ui.isMonitorActive && !ui.isGateOSActive) {
            if (this.isStarted) return;
            this.isStarted = true;

            await this.transitionTo(ScenarioState.PREBOOT);
        }
    }

    async transitionTo(newState: ScenarioStateValue) {
        // устанавливаем новое состояние
        this.currentState = newState;
        // по умолчанию скрываем ввод при смене стейта
        this.isInputActive = false;

        switch (newState) {
            case ScenarioState.PREBOOT:
                this.printable = ["ЗАГРУЗКА G.A.T.E. ..."];
                break;

            case ScenarioState.SCANNING:
                this.printable = [
                    ...this.printable,
                    { text: "[░░░░░░░░░░░░░░░░░░░░░░░]", speed: 25, delay: 500 },
                    "Загрузка модулей...",
                    { text: "[░░░░░░░░░░░░░░░░░░░░░░░]", speed: 50, delay: 1000 },
                    "Готово.",
                ];
                break;

            case ScenarioState.BOOT_GATE_OS:
                ui.isGateOSActive = true;
                this.clearTerminal?.();
                this.printable = [];

                sfx.playLogonSfx();

                await new Promise(r => setTimeout(r, 2500));

                this.printable = [
                    '--- SYSTEM CHECK START ---',
                    '+----------+',
                    ...systemInfo.asLines,
                    '+----------+',
                    ' ',
                    { text: "Проверка доступа...", speed: 10, delay: 500 },
                    '> run daemon.anom',
                    'reading x-service...',
                    'reading login.boot...',
                    'check...',
                    'result: empty (code -10024)',
                    { text: "ОБНАРУЖЕНА НЕАВТОРИЗОВАННАЯ ПОПЫТКА ДОСТУПА", speed: 10, delay: 2000, type: LineType.ERROR },
                ];
                break;

            case ScenarioState.AWAIT_LOGIN:
                this.printable = [...this.printable, '', 'Пожалуйста, введите Ваш логин:', ' '];
                this.isInputActive = true;
                break;

            case ScenarioState.AWAIT_PASSWORD:
                this.printable = [...this.printable, '', 'Пожалуйста, введите Ваш пароль:', ' '];
                this.isInputActive = true;
                break;

            case ScenarioState.MAKE_AUTH:
                this.printable = [...this.printable, '', 'Выполняется авторизация...', ' '];
                // здесь будет логика запроса к серверу
                break;
        }
    }

    handleWriterComplete() {
        if (this.currentState === ScenarioState.PREBOOT) this.transitionTo(ScenarioState.SCANNING);
        else if (this.currentState === ScenarioState.SCANNING) this.transitionTo(ScenarioState.BOOT_GATE_OS);
        else if (this.currentState === ScenarioState.BOOT_GATE_OS) this.transitionTo(ScenarioState.AWAIT_LOGIN);
    }

    handleUserInput(value: string) {
        this.isInputActive = false;

        // логика команд (например, EXIT)
        if (value.toLowerCase() === 'exit') {
            // transitionTo(SHUTDOWN)...
            return;
        }

        if (this.currentState === ScenarioState.AWAIT_PASSWORD) {
            this.printable = [...this.printable, `> ${'*'.repeat(value.length)}`];
            this.transitionTo(ScenarioState.MAKE_AUTH);
        } else {
            this.printable = [...this.printable, `> ${value}`];
        }

        if (this.currentState === ScenarioState.AWAIT_LOGIN) {
            this.transitionTo(ScenarioState.AWAIT_PASSWORD);
        }
    }

    handlePowerToggle() {
        sfx.init();
        ui.toogleMonitor();

        if (ui.isMonitorActive) {
            sfx.playCrtOn();
            sfx.startHum();
        } else {
            sfx.playCrtOff();
            sfx.stopHum();
        }
    }
}

export const terminal = new TerminalManager();
