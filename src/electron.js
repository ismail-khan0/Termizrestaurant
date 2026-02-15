const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  console.log('🚀 Starting Restaurant POS...');
  console.log('Development mode:', isDev);
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
    show: false,
    icon: path.join(__dirname, '../../public/icon.png'),
    title: 'Restaurant POS',
    backgroundColor: '#111111',
    titleBarStyle: 'default'
  });

  // Load the app
  let startUrl;
  
  if (isDev) {
    startUrl = 'http://localhost:3000';
    console.log('🔧 Development mode - loading from:', startUrl);
  } else {
    // In production, serve from the build folder
    startUrl = `file://${path.join(__dirname, '../../build/index.html')}`;
    console.log('📦 Production mode - loading from build folder');
  }

  console.log('📍 Loading URL:', startUrl);
  
  mainWindow.loadURL(startUrl).catch(error => {
    console.error('❌ Failed to load content:', error);
    
    // Show user-friendly error page
    mainWindow.webContents.executeJavaScript(`
      document.body.innerHTML = '<div style="padding: 40px; text-align: center; font-family: Arial, sans-serif; color: white; background: #111; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <div style="background: #2d3748; padding: 40px; border-radius: 10px; max-width: 500px;">
          <h1 style="color: #e53e3e; font-size: 24px; margin-bottom: 20px;">🚨 Application Error</h1>
          <p style="font-size: 16px; margin-bottom: 10px; color: #e2e8f0;">Failed to load the application.</p>
          <p style="color: #a0aec0; margin-bottom: 20px; font-size: 14px;">Error: ${error.message}</p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3182ce; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">🔄 Retry</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #718096; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">❌ Exit</button>
          </div>
        </div>
      </div>';
    `);
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    console.log('✅ Window is ready to show');
    mainWindow.show();
    mainWindow.focus();
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
      console.log('🔧 DevTools opened in development mode');
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    console.log('📝 Window closed');
    mainWindow = null;
  });

  // Handle navigation events
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ App loaded successfully');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Failed to load:', errorCode, errorDescription);
  });
}

// App event handlers
app.whenReady().then(() => {
  console.log('🎯 App is ready, creating window...');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('📝 All windows closed');
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('🔗 App activated');
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  console.log('👋 App is quitting...');
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    console.warn('🚫 Blocked new window creation to:', navigationUrl);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

console.log('📄 Main process loaded');