// get the port from the .env file
const port = 7654

export default class Logs {

    #callback;
    #eventSource;
    logs = [];

    constructor(callback) {
        this.#callback = callback;

        fetch(`http://localhost:${port}/logs`)
            .then(response => {
                try {
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
        this.#eventSource = new EventSource(`http://localhost:${port}/logs/stream`);

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