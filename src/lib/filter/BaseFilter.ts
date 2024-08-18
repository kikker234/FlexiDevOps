// class implementing the filter interface
import type {IFilter} from "./IFilter";

export class BaseFilter implements IFilter {

    filter(logs) {
        return logs.filter(log => log !== undefined);
    }
}