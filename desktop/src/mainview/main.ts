import { BrowserWindow, App } from 'electrobun';
import path from 'path';

const app = new App();

app.on('ready', () => {
    const isDev = process.env.NODE_ENV === 'development';

    const win = new BrowserWindow({
        title: "A.N.O.M.E.R.",
        width: 1200,
        height: 900,
        // В деве открываем URL сервера, в билде — локальный файл
        url: isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`,
        frame: false,
        transparent: true
    });
});
