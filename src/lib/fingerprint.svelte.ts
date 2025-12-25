export interface BrowserData {
    user_agent: string;
    platform: string;
    language: string;
    resolution: string;
    cores: string | number;
    memory: string;
    gpu: string;
    timezone: string;
}

let data = $state<BrowserData>({
    user_agent: "Loading...",
    platform: "Loading...",
    language: "",
    resolution: "",
    cores: 0,
    memory: "N/A",
    gpu: "Detecting...",
    timezone: "",
});

export async function initSystemInfo() {
    if (typeof window === 'undefined') return;

    const nav = window.navigator;

    // gpu
    let gpuName = "";
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        gpuName = debugInfo 
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : 'RESTRICTED'
    }

    data = {
        user_agent: nav.userAgent,
        platform: nav.platform || "NO DATA",
        language: nav.language,
        resolution: `${window.screen.width}x${window.screen.height}`,
        cores: nav.hardwareConcurrency || 0,
        memory: (nav as any).deviceMemory
        ? `${(nav as any).deviceMemory} GB`
        : `~ ${(nav as any).hardwareConcurrency} GB`,
        gpu: gpuName,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

export const systemInfo = {
    get current() { return data },
    get asLines() {
        return [
            `OS: ${data.platform}`,
            `CPU: ${data.cores} cores`,
            `RAM: ${data.memory}`,
            `GPU: ${data.gpu}`,
            `RESOLUTION: ${data.resolution}`,
            `TZ: ${data.timezone}`,
        ]
    }
};

