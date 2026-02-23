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
    BOOT: 'BOOT',
    SCANNING: 'SCANNING',
    HARDWARE_CHECK: 'HARDWARE_CHECK',
    AWAIT_LOGIN: 'AWAIT_LOGIN',
    AWAIT_PASSWORD: 'AWAIT_PASSWORD',
    MAKE_AUTH: 'MAKE_AUTH',
    SHUTDOWN: 'SHUTDOWN'
} as const;

export type ScenarioStateValue = typeof ScenarioState[keyof typeof ScenarioState];
