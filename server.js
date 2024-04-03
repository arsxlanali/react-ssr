import express from "express";
import fs from 'fs';
import { fileURLToPath } from "url";
import { dirname, resolve } from 'path';
import renderApp from './dist/server/ServerApp.js';


const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3002;

const html = fs.readFileSync(resolve(__dirname, './dist/client/index.html')).toString();

console.log("html", resolve(__dirname, './dist/client/index.html'))

const parts = html.split("not rendered");

const app = express();
app.use('/assets',express.static(resolve(__dirname, 
    './dist/client/assets')));

app.use((req, res)=>{
    res.write(parts[0]);
    const stream = renderApp(req.url, {
        onShellReady() {
            stream.pipe(res)
        },
        onShellError() {
            // error handling
        },
        onAllReady() {
            res.write(parts[1]);
            res.end();
        },
        onError(err) {
            console.error(err)
        }

    })
})

console.log(`Listening on http://localhost:${PORT}`)
app.listen(PORT)