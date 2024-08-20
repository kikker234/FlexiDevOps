<script lang="ts">
    import {onMount} from "svelte";
    import Logs from "../lib/Logs.ts";
    import {BaseFilter} from "../lib/filter/BaseFilter.ts";
    import {MetricFilter} from "../lib/filter/service/MetricFilter.ts";
    import type {IFilter} from "../lib/filter/IFilter";
    import {StatusCodeFilter} from "../lib/filter/service/StatusCodeFilter";
    import {Environment} from "../lib/Environment";


    let selectedEnvironment = Environment.PROD;
    let logs = new Logs(() => {
        logKey++;
    }, selectedEnvironment);
    let logKey = 0;
    let currentPage = 1;
    let pageSize = 10;
    let tracing = '';

    // filters
    let filterVariables = {
        "showMetrics": false,
        "statusCode": 0,
    }

    const switchEnvironment = (environment: Environment) => {
        selectedEnvironment = environment;
        logs = new Logs(() => {
            logKey++;
        }, environment);

        logKey++;
        console.log("Key is now: " + logKey)
    }

    onMount(() => {
        logs.openStream();
    })

    $: currentPage, logKey++;
    $: filterVariables, logKey++;

    const formatDateTime = (timestamp: string) => {
        const date = new Date(timestamp);

        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear();
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let seconds = date.getSeconds().toString().padStart(2, '0');
        let milliseconds = date.getMilliseconds().toString().padStart(3, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const getPageLogs = (pageSize: number) => {
        let allLogs = logs.getAllLogs();
        allLogs = filterLogs(allLogs);

        if (tracing) {
            allLogs = allLogs.filter(log => log["@tr"] === tracing);
            currentPage = 1;
        }

        const maxPage = Math.ceil(allLogs.length / pageSize);
        currentPage = Math.max(1, Math.min(currentPage, maxPage));

        let start: number = (currentPage - 1) * pageSize;
        let end: number = start + pageSize;

        for (let log of allLogs) {
            let template: string | never = log["@mt"];

            if (template) {
                let keys = Object.keys(log);
                for (let key of keys) {
                    const regex = new RegExp(`{${key}[^}]*}`, 'g');
                    template = template.replace(regex, log[key]);
                }

                log["@mt"] = template;
            }
        }


        return allLogs.slice(start, end);
    }

    const traceRequest = (id: string) => {
        tracing = id;

        logKey++;
        logs.getAllLogs();
    }

    const stopTraceRequest = () => {
        tracing = '';

        logs.getAllLogs();
    }

    const filterLogs = (logs: []) => {
        let filter: IFilter = new BaseFilter();

        if (!filterVariables.showMetrics)
            filter = new MetricFilter(filter);

        if (filterVariables.statusCode) {
            filter = new StatusCodeFilter(filter, filterVariables.statusCode);
        }

        return filter.filter(logs);
    }

    const getAllStatusCodes = () => {
        let codes: [] = [];
        let log = logs.getAllLogs();

        for (let logElement of log) {
            if (logElement["StatusCode"] && !codes.includes(logElement["StatusCode"])) {
                codes.push(logElement["StatusCode"]);
            }
        }

        return codes;
    }

</script>

{#if tracing}
    <button class="btn btn-primary w-full sm:w-auto" on:click={stopTraceRequest}>Stop tracing</button>
{/if}

{#key logKey}
    <div class="flex flex-col sm:flex-row gap-3">
        <select bind:value={filterVariables.statusCode} class="select select-bordered w-full sm:max-w-xs">
            <option value={0} selected={"selected"}>None</option>
            {#each getAllStatusCodes() as statusCode }
                <option value={statusCode} on:change={() => filterVariables.statusCode = statusCode}>
                    {statusCode}
                </option>
            {/each}
        </select>

        <select class="select select-bordered w-full sm:max-w-xs">
            {#each Object.values(Environment) as environment}
                <option selected={selectedEnvironment === environment} value={environment} on:change={() => switchEnvironment(environment)}>
                    {environment}
                </option>
            {/each}
        </select>

        <div class="flex justify-center sm:justify-start">
            <div class="form-control">
                <label class="label cursor-pointer">
                    <input type="checkbox" class="checkbox checkbox-primary" bind:value={filterVariables.showMetrics}
                           on:click={() => filterVariables.showMetrics = !filterVariables.showMetrics}/>
                    <span class="label-text ml-3">Show metrics</span>
                </label>
            </div>
        </div>
    </div>

    {#each getPageLogs(pageSize) as log}
        <div class="card bg-base-300 shadow-xl mt-4">
            <div class="card-body">
                <div class="flex flex-col sm:flex-row justify-between">
                    <h2 class="card-title">
                        {#if log["StatusCode"]}
                            {log["StatusCode"]}
                        {:else}
                            {log["@l"] ?? "Information"}
                        {/if}
                    </h2>
                    <span>{formatDateTime(log["@t"])}</span>
                </div>

                <p>{log["@mt"]}</p>

                {#if !tracing}
                    <button class="btn btn-primary btn-outline w-full sm:w-auto mt-2 sm:mt-0" on:click={() => traceRequest(log["@tr"])}>
                        Trace request
                    </button>
                {/if}
            </div>
        </div>
    {/each}
{/key}

<div class="flex flex-col sm:flex-row justify-between items-center mt-4">
    <button class="btn btn-primary w-full sm:w-auto mb-2 sm:mb-0" on:click={() => currentPage--}>Previous page</button>
    <input bind:value={currentPage} type="number" class="input input-bordered w-full sm:w-auto mx-2"/>
    <button class="btn btn-primary w-full sm:w-auto" on:click={() => currentPage++}>Next page</button>
</div>
