import type {IFilter} from "../IFilter.ts";

export class MetricFilter implements IFilter {

    #nextFilter;

    constructor(filter: IFilter) {
        this.#nextFilter = filter;
    }

    filter(logs) {
        logs = logs.filter(log => log.RequestPath !== '/metrics');

        return this.#nextFilter.filter(logs)
    }
}