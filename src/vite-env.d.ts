/// <reference types="vite/client" />

interface Window {
    electronAPI: {
        openFile: () => Promise<Uint8Array | null>
    }
}