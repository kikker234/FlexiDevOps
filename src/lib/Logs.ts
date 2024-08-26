export default class Logs {

    #callback;
    #eventSource;
    #environment;

    logs = [];

    constructor(callback, environment) {
        this.#environment = environment;
        this.#callback = callback;


        (async () => {
            await this.fetchLogs(environment);
        })();
    }

    async fetchLogs(environment) {
        try {
            const response = await fetch(`http://localhost:7654/logs/${environment}`);
            console.log("Requesting logs from server..." + environment + " " + response.status);

            if (response.ok) {
                const data = await response.json();
                this.logs = data.map(log => {
                    try {
                        return JSON.parse(log);
                    } catch {
                        return log;
                    }
                });

                // Sorteer de logs op timestamp in aflopende volgorde
                this.logs.sort((a, b) => {
                    return new Date(b["@t"]) - new Date(a["@t"]);
                });

                // Roep de callback aan met de ingeladen logs
                this.#callback(this.logs);
            } else {
                console.error(`Failed to fetch logs: ${response.status}`);
            }
        } catch (e) {
            console.error("Error fetching logs:", e);
        }
    }

    openStream() {
        console.log("Opening stream..." + this.#environment);
        this.#eventSource = new EventSource(`http://localhost:7654/logs/stream/${this.#environment}`);

        this.#eventSource.onmessage = (event) => {
            const newLog = JSON.parse(event.data);

            this.#callback(newLog);
        };

        this.#eventSource.onerror = (error) => {
            console.error("Error receiving SSE:", error);
        };
    }

    closeStream() {
        if (this.#eventSource) {
            this.#eventSource.close();
            console.log("Stream closed.");
        }
    }

    getAllLogs(): [] {
        return this.logs ?? [];
    }
}
