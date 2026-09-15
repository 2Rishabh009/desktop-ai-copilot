import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopAPI', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (patch: Record<string, unknown>) => ipcRenderer.invoke('settings:set', patch),
  toggleWindow: () => ipcRenderer.invoke('window:show-hide'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close'),
  getSources: () => ipcRenderer.invoke('screen:sources'),
  capture: (sourceId: string) => ipcRenderer.invoke('screen:capture', sourceId),
  getDisplays: () => ipcRenderer.invoke('screen:displays'),
  pickRegion: (displayId: number) => ipcRenderer.invoke('screen:pick-region', displayId),
  onCaptureResult: (callback: (payload: { sourceId: string; name: string; dataUrl: string }) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: any) => callback(payload);
    ipcRenderer.on('screen:capture-result', listener);
    return () => ipcRenderer.removeListener('screen:capture-result', listener);
  },
  regionResult: (rect: { x: number; y: number; width: number; height: number }) => ipcRenderer.send('region-picker:result', rect),
  regionCancel: () => ipcRenderer.send('region-picker:cancel')
});
