<script lang="ts">
    import {onMount} from "svelte";
    import Logs from "../lib/Logs.ts";
    import environments from "../assets/environments.json";
    import autoAnimate from '@formkit/auto-animate';
    import Paging from "./Paging.svelte";

    let selectedEnvironment = environments[0].name
    $: currentLogs = [];
    $: allLogs = [];
    let pageSize = 10;

    let logs = new Logs((newLogs: []) => {
        for (let newLog of newLogs) {
            allLogs.push(newLog);
        }
    }, selectedEnvironment);

    onMount(() => {
        allLogs = logs.getAllLogs();
    });

    const parseDateTime = (date: string) => {
        return new Date(date).toLocaleString();
    }
</script>

<div class="" use:autoAnimate>
    {#each currentLogs as log}
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
                    <span>{parseDateTime(log["@t"])}</span>
                </div>

                <p>{log["@mt"]}</p>
            </div>
        </div>
    {/each}

    <Paging bind:trimmed={currentLogs} pageSize={pageSize} list={allLogs} />
</div>
