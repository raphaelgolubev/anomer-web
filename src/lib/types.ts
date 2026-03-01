export const LineType = {
    DEFAULT: 'default',
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning',
    SYSTEM: 'system'
} as const;

export type LineTypeValue = typeof LineType[keyof typeof LineType];

export interface LineConfig {
    text: string;
    speed?: number;
    delay?: number;
    type?: LineTypeValue;
}

export type TerminalLine = string | LineConfig;

export const ScenarioState = {
    MONITOR_ON: 'MONITOR_ON',
    MONITOR_OFF: 'MONITOR_OFF',
    PREBOOT: 'PREBOOT',
    SCANNING: 'SCANNING',
    BOOT_GATE_OS: 'HARDWARE_CHECK',
    AWAIT_LOGIN: 'AWAIT_LOGIN',
    AWAIT_PASSWORD: 'AWAIT_PASSWORD',
    MAKE_AUTH: 'MAKE_AUTH',
} as const;

export type ScenarioStateValue = typeof ScenarioState[keyof typeof ScenarioState];

export interface OsdItem {
    id: string;
    label: string;
    value: () => number;
    step: number;
    max: number;
    adjust: (delta: number) => void;
}

export interface OsdTab {
    id: string;
    icon: string;
    label: string;
    items: OsdItem[];
}
