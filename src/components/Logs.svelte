<script>
    import {onMount} from "svelte";
    import Logs from "../lib/Logs.ts";

    let logs = new Logs(() => {
        logKey++;
    });
    let logKey = 0;
    let currentPage = 1;
    let pageSize = 10;
    let tracing = '';

    onMount(() => {
        logs.openStream();
    })

    $: currentPage, logKey++;

    const formatDateTime = (timestamp) => {
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

    const getPageLogs = (pageSize) => {
        let allLogs = logs.getAllLogs();

        if (tracing) {
            allLogs = allLogs.filter(log => log["@tr"] === tracing);
            currentPage = 1;
        }

        const maxPage = Math.ceil(allLogs.length / pageSize);
        currentPage = Math.max(1, Math.min(currentPage, maxPage));

        let start = (currentPage - 1) * pageSize;
        let end = start + pageSize;

        return allLogs.slice(start, end);
    }

    const traceRequest = (id) => {
        tracing = id;

        logKey++;
        logs.getAllLogs();
    }

    const stopTraceRequest = () => {
        tracing = '';

        logs.getAllLogs();
    }

</script>

{#if tracing}
    <button class="btn btn-primary" on:click={stopTraceRequest}>Stop tracing</button>
{/if}

{#key logKey}
    {#each getPageLogs(pageSize) as log}
        <div class="card mt-4">
            <div class="card-body">
                <div class="flex justify-between">
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
                    <button class="btn btn-primary btn-outline" on:click={() => traceRequest(log["@tr"])}>
                        Trace request
                    </button>
                {/if}
            </div>
        </div>
    {/each}
{/key}

<div class="flex justify-between">
    <button class="btn btn-primary" on:click={() => currentPage--}>Previous page</button>

    <input bind:value={currentPage} type="number" class="input input-bordered"/>

    <button class="btn btn-primary" on:click={() => currentPage++}>Next page</button>
</div>