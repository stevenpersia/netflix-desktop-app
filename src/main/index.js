import { app, BrowserWindow, Menu } from "electron";
import widevine from "electron-widevinecdm";

widevine.load(app);
let mainWindow;

function createMainWindow() {
	const window = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 1200,
		minHeight: 800,
		webPreferences: {
			plugins: true,
			sandbox: true,
			nodeIntegration: false
		}
	});

	window.loadURL("https://netflix.com/login");
	window.setMenu(null);
	window.on("closed", () => {
		mainWindow = null;
	});

	const template = [
		{
			label: "Netflix",
			submenu: [
				{
					label: "Exit",
					click() {
						app.quit();
					}
				}
			]
		},
		{
			label: "View",
			submenu: [{ role: "reload" }, { role: "togglefullscreen" }]
		},
		{ label: "Window", submenu: [{ role: "minimize" }, { role: "close" }] }
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	if (process.env.NODE_ENV !== "production") {
		window.webContents.openDevTools();
	}

	window.webContents.on("devtools-opened", () => {
		window.focus();
		setImmediate(() => {
			window.focus();
		});
	});

	return window;
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		mainWindow = createMainWindow();
	}
});

app.on("ready", () => {
	mainWindow = createMainWindow();
});
