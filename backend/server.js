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
const GetAmountOfLines = (environment) => {
    const logFilePath = path.join(getLogLocation(environment), logFileToday);

    if (!fs.existsSync(logFilePath))
        return 0;

    const logs = fs.readFileSync(logFilePath, 'utf8');
    const logLines = logs.split('\n').filter(Boolean);

    return logLines.length;
}

const getLogLocation = (environment) => {
    const prefix = "/Projects/Flexi/";
    const suffix = "/FlexiApi/Logs";

    switch (environment) {
        case "Preview":
            return prefix + "Dev" + suffix;
        default:
            return prefix + "Production" + suffix;
    }
}

app.use(cors());

app.get('/logs/:environment', (req, res) => {
    try {
        const environment = req.params.environment;
        const logFolderPath = path.join(getLogLocation(environment));

        // loop thru all files in the logs folder
        const files = fs.readdirSync(logFolderPath);
        const finalLogs = [];

        for (let logFileName of files) {
            const logFilePath = path.join(getLogLocation(environment), logFileName);
            const logs = fs.readFileSync(logFilePath, 'utf8');

            // every line is an seperate log
            const logLines = logs.split('\n')

            for (let line of logLines) {
                finalLogs.push(line);
            }
        }

        console.log("Returning: " + finalLogs.length + " logs from: " + environment + " environment");

        res.json(finalLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json([]);
    }
});

app.get('/logs/stream/:environment', (req, res) => {
    console.log('Client connected to logs stream');

    const environment = req.params.environment;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Verstuur headers

    let lastLines = GetAmountOfLines(environment); // Start de lijnenteller voor deze client

    // Interval om de logs periodiek te controleren en door te sturen
    const intervalId = setInterval(() => {
        const currentLines = GetAmountOfLines(environment);

        console.log("Current lines: " + currentLines + " Last lines: " + lastLines);

        if (currentLines > lastLines) {
            const logFilePath = path.join(getLogLocation(environment), logFileToday);
            const logs = fs.readFileSync(logFilePath, 'utf8');
            const logLines = logs.split('\n').filter(Boolean).slice(lastLines);

            logLines.forEach((log) => {
                console.log("New logs send to client: " + log)
                res.write(`data: ${log}\n\n`); // Verstuur de nieuwe log naar de client
            });

            lastLines = currentLines;
        }
    }, 500);

    req.on('close', () => {
        console.log("Client disconnected from logs stream");
        clearInterval(intervalId); // Stop het interval wanneer de client loskoppelt
    });
});

app.listen(PORT, "0.0.0.0",() => {
    console.log(`Server running on port ${PORT}`);
});