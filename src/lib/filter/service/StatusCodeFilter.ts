import type {IFilter} from "../IFilter.ts";

export class StatusCodeFilter implements IFilter {

    #nextFilter;
    #statusCode;

    constructor(filter: IFilter, statusCode: number) {
        this.#nextFilter = filter;
        this.#statusCode = statusCode;
    }

    filter(logs) {
        if(this.#statusCode === undefined) return this.#nextFilter.filter(logs);

        logs = logs.filter(log => log.StatusCode === this.#statusCode);

        return this.#nextFilter.filter(logs)
    }
}