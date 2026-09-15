import { app, BrowserWindow, desktopCapturer, globalShortcut, ipcMain, screen, session } from 'electron';
import path from 'path';
import fs from 'fs/promises';

let copilot: BrowserWindow | null = null;
let regionPicker: BrowserWindow | null = null;
let protectedWindow = true;
let clickThrough = false;

interface Settings {
  opacity: number;
  alwaysOnTop: boolean;
  contentProtection: boolean;
  clickThrough: boolean;
  shortcut: string;
}

const defaults: Settings = {
  opacity: 0.88,
  alwaysOnTop: true,
  contentProtection: true,
  clickThrough: false,
  shortcut: 'CommandOrControl+Shift+Space'
};

function settingsPath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

async function readSettings(): Promise<Settings> {
  try {
    return { ...defaults, ...JSON.parse(await fs.readFile(settingsPath(), 'utf8')) };
  } catch {
    return defaults;
  }
}

async function writeSettings(settings: Settings) {
  await fs.mkdir(path.dirname(settingsPath()), { recursive: true });
  await fs.writeFile(settingsPath(), JSON.stringify(settings, null, 2), 'utf8');
}

async function createCopilot() {
  const settings = await readSettings();
  protectedWindow = settings.contentProtection;
  clickThrough = settings.clickThrough;

  copilot = new BrowserWindow({
    width: 560,
    height: 760,
    minWidth: 380,
    minHeight: 480,
    show: false,
    frame: false,
    transparent: true,
    resizable: true,
    movable: true,
    alwaysOnTop: settings.alwaysOnTop,
    skipTaskbar: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: true
    }
  });

  copilot.setOpacity(settings.opacity);
  copilot.setContentProtection(protectedWindow);
  copilot.setIgnoreMouseEvents(clickThrough, { forward: true });

  if (process.env.VITE_DEV_SERVER_URL) await copilot.loadURL(process.env.VITE_DEV_SERVER_URL);
  else await copilot.loadFile(path.join(__dirname, '../renderer/index.html'));
  copilot.on('closed', () => { copilot = null; });
}

async function captureSources() {
  const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 1600, height: 1000 }, fetchWindowIcons: true });
  return sources.map(s => ({ id: s.id, name: s.name, displayId: s.display_id, thumbnail: s.thumbnail.toDataURL(), appIcon: s.appIcon?.toDataURL() ?? null }));
}

async function captureSource(sourceId: string) {
  const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 2560, height: 1600 }, fetchWindowIcons: false });
  const source = sources.find(s => s.id === sourceId);
  if (!source) throw new Error('Capture source not found. Please reopen Capture.');
  return { sourceId, name: source.name, dataUrl: source.thumbnail.toDataURL() };
}

async function createRegionPicker(displayId: number) {
  if (regionPicker) { regionPicker.focus(); return; }
  const display = screen.getAllDisplays().find(d => d.id === displayId) ?? screen.getPrimaryDisplay();
  const b = display.bounds;
  regionPicker = new BrowserWindow({ x: b.x, y: b.y, width: b.width, height: b.height, frame: false, transparent: true, fullscreen: false, movable: false, resizable: false, alwaysOnTop: true, skipTaskbar: true, focusable: true, backgroundColor: '#00000000', webPreferences: { preload: path.join(__dirname, '../preload/preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  regionPicker.setAlwaysOnTop(true, 'screen-saver');
  regionPicker.setContentProtection(true);
  await regionPicker.loadFile(path.join(__dirname, '../renderer/region-picker.html'));
  regionPicker.on('closed', () => { regionPicker = null; });
}

function registerIpc() {
  ipcMain.handle('settings:get', async () => readSettings());
  ipcMain.handle('settings:set', async (_, patch: Partial<Settings>) => {
    const current = await readSettings(); const next = { ...current, ...patch }; await writeSettings(next);
    if (copilot) { copilot.setOpacity(next.opacity); copilot.setAlwaysOnTop(next.alwaysOnTop); protectedWindow = next.contentProtection; copilot.setContentProtection(protectedWindow); clickThrough = next.clickThrough; copilot.setIgnoreMouseEvents(clickThrough, { forward: true }); }
    return next;
  });
  ipcMain.handle('window:show-hide', () => { if (!copilot) return false; if (copilot.isVisible()) copilot.hide(); else { copilot.show(); copilot.focus(); } return copilot.isVisible(); });
  ipcMain.handle('window:minimize', () => copilot?.minimize());
  ipcMain.handle('window:close', () => copilot?.hide());
  ipcMain.handle('window:set-bounds', (_, bounds: Electron.Rectangle) => copilot?.setBounds(bounds));
  ipcMain.handle('screen:sources', captureSources);
  ipcMain.handle('screen:capture', (_, sourceId: string) => captureSource(sourceId));
  ipcMain.handle('screen:displays', () => screen.getAllDisplays().map(d => ({ id: d.id, bounds: d.bounds, scaleFactor: d.scaleFactor, primary: d.id === screen.getPrimaryDisplay().id })));
  ipcMain.handle('screen:pick-region', (_, displayId: number) => createRegionPicker(displayId));
  ipcMain.on('region-picker:result', async (_, rect: { x: number; y: number; width: number; height: number }) => {
    if (!regionPicker) return;
    const display = screen.getAllDisplays().find(d => d.bounds.x === regionPicker!.getBounds().x && d.bounds.y === regionPicker!.getBounds().y) ?? screen.getPrimaryDisplay();
    const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: Math.round(display.bounds.width * display.scaleFactor), height: Math.round(display.bounds.height * display.scaleFactor) } });
    const source = sources.find(s => s.display_id === String(display.id)) ?? sources[0]; if (!source) return;
    const image = source.thumbnail; const scaleX = image.getSize().width / display.bounds.width; const scaleY = image.getSize().height / display.bounds.height;
    const crop = { x: Math.max(0, Math.round(rect.x * scaleX)), y: Math.max(0, Math.round(rect.y * scaleY)), width: Math.max(1, Math.min(image.getSize().width, Math.round(rect.width * scaleX))), height: Math.max(1, Math.min(image.getSize().height, Math.round(rect.height * scaleY))) };
    const cropped = image.crop(crop); const payload = { sourceId: source.id, name: 'Selected region', dataUrl: cropped.toDataURL() };
    if (copilot && !copilot.isDestroyed()) { copilot.webContents.send('screen:capture-result', payload); copilot.show(); copilot.focus(); }
    regionPicker.close();
  });
  ipcMain.on('region-picker:cancel', () => regionPicker?.close());
}

app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => callback(permission === 'media'));
  await createCopilot(); registerIpc();
  const settings = await readSettings();
  globalShortcut.register(settings.shortcut, () => { if (!copilot) return; if (copilot.isVisible()) copilot.hide(); else { copilot.show(); copilot.focus(); } });
  copilot?.show();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('will-quit', () => globalShortcut.unregisterAll());
