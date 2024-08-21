// get the port from the .env file
import type {Environment} from "./Environment";

const port = 7654

export default class Logs {

    #callback;
    #eventSource;
    #environment: Environment;

    logs = [];

    constructor(callback, environment: Environment) {
        this.#callback = callback;
        fetch(`http://85.215.185.110:7654/logs/${environment}`)
            .then(response => {
                try {
                    console.log("Requesting logs from server..." + environment + " " + response.status);
                    return response.json()
                } catch (e) {
                }
            })
            .then(data => {
                this.logs = data;

                this.logs.forEach(log => {
                    let tempLog = log;
                    try {
                        tempLog = JSON.parse(log);
                    } catch (e) {
                    }

                    if (tempLog) {
                        this.logs = [tempLog, ...this.logs];
                    }
                })

                this.#callback(this.logs);
            });
    }

    openStream() {
        console.log("Opening stream..." + this.#environment)
        this.#eventSource = new EventSource(`http://85.215.185.110:7654/logs/stream/${this.#environment}`);

        this.#eventSource.onmessage = (event) => {
            const newLog = JSON.parse(event.data);

            this.logs = [newLog, ...this.logs];

            this.#callback(newLog);
        };

        this.#eventSource.onerror = (error) => {
            console.error("Error receiving SSE:", error);
        };
    }

    closeStream() {
        this.#eventSource.close();
    }

    getAllLogs() {
        return this.logs ?? [];
    }
}