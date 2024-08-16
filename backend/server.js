import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {EventEmitter} from 'events';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7654;
const logEmitter = new EventEmitter(); // Event emitter to notify new logs

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
let logFileToday = `applog-${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}.json`;
const GetAmountOfLines = () => {
    const logFilePath = path.join("C:\\Users\\jusra\\RiderProjects\\FlexiApi2\\FlexiApi\\Logs\\", logFileToday);

    if (!fs.existsSync(logFilePath))
        return 0;

    const logs = fs.readFileSync(logFilePath, 'utf8');
    const logLines = logs.split('\n').filter(Boolean);

    return logLines.length;
}


let lastLines = GetAmountOfLines();

app.use(cors());

app.get('/logs', (req, res) => {
    const logFolderPath = path.join("C:\\Users\\jusra\\RiderProjects\\FlexiApi2\\FlexiApi\\Logs\\");

    // loop thru all files in the logs folder
    const files = fs.readdirSync(logFolderPath);
    const finalLogs = [];

    for (let logFileName of files) {
        const logFilePath = path.join("C:\\Users\\jusra\\RiderProjects\\FlexiApi2\\FlexiApi\\Logs\\" + logFileName);
        const logs = fs.readFileSync(logFilePath, 'utf8');

        // every line is an seperate log
        const logLines = logs.split('\n')

        for (let line of logLines) {
            finalLogs.push(line);
        }
    }

    console.log("Returning: " + finalLogs.length + " logs");

    res.json(finalLogs);
});

app.get('/logs/stream', (req, res) => {
    console.log('Client connected to logs stream')
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Send headers

    const onNewLog = (log) => {
        res.write(`data: ${log}\n\n`);
    };

    logEmitter.on('newLog', onNewLog);

    req.on('close', () => {
        console.log("Client disconnected from logs stream");
        logEmitter.removeListener('newLog', onNewLog);
    });
});

setInterval(() => {
    const currentLines = GetAmountOfLines();

    if (currentLines <= lastLines) return;

    const logFilePath = path.join("C:\\Users\\jusra\\RiderProjects\\FlexiApi2\\FlexiApi\\Logs\\", logFileToday);
    const logs = fs.readFileSync(logFilePath, 'utf8');
    const logLines = logs.split('\n').filter(Boolean).slice(lastLines);

    logLines.forEach((log) => {
        logEmitter.emit('newLog', log);
    });

    lastLines = currentLines;
}, 500)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});